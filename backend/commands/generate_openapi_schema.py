import json
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
except Exception:

    def load_dotenv(*a, **k):
        return None


from app.main import app

# Load environment from .env if python-dotenv is available
load_dotenv()

OUTPUT_FILE = os.getenv("OPENAPI_OUTPUT_FILE")


def generate_openapi_schema(output_file):
    schema = app.openapi()
    output_path = Path(output_file)

    updated_schema = remove_operation_id_tag(schema)
    updated_schema = wrap_response_schemas(updated_schema)

    output_path.write_text(json.dumps(updated_schema, indent=2))
    print(f"OpenAPI schema saved to {output_file}")


def remove_operation_id_tag(schema):
    """
    Removes the tag prefix from the operation IDs in the OpenAPI schema.

    This cleans up the OpenAPI operation IDs that are used by the frontend
    client generator to create the names of the functions. The modified
    schema is then returned.
    """
    for path_data in schema["paths"].values():
        for operation in path_data.values():
            tag = operation["tags"][0]
            operation_id = operation["operationId"]
            to_remove = f"{tag}-"
            new_operation_id = operation_id[len(to_remove) :]
            operation["operationId"] = new_operation_id
    return schema


def wrap_response_schemas(schema):
    """
    Post-process the generated OpenAPI schema to wrap all application/json
    response schemas with a generic ApiResponse wrapper. This allows the
    frontend client generator to produce types that match the runtime
    wrapper produced by the middleware.
    """
    components = schema.setdefault("components", {})
    schemas = components.setdefault("schemas", {})

    # ApiMeta
    schemas.setdefault(
        "ApiMeta",
        {
            "title": "ApiMeta",
            "type": "object",
            "properties": {
                "timestamp": {"type": "string"},
            },
            "required": ["timestamp"],
        },
    )

    # ApiResponse
    schemas.setdefault(
        "ApiResponse",
        {
            "title": "ApiResponse",
            "type": "object",
            "properties": {
                "status": {"type": "integer"},
                "success": {"type": "boolean"},
                "message": {"type": "string"},
                "data": {},
                "error_code": {"type": "string", "nullable": True},
                "errors": {"type": "object", "nullable": True},
                "meta": {"$ref": "#/components/schemas/ApiMeta"},
            },
            "required": ["status", "success", "message", "meta"],
        },
    )

    paths = schema.get("paths", {})
    for _path, path_item in paths.items():
        for _method, operation in list(path_item.items()):
            if not isinstance(operation, dict):
                continue
            responses = operation.get("responses", {})
            for _status_code, resp in list(responses.items()):
                content = resp.get("content", {})
                app_json = content.get("application/json")
                if not app_json or "schema" not in app_json:
                    continue

                orig_schema = app_json["schema"]

                # Skip if already wrapped
                already = False
                if isinstance(orig_schema, dict):
                    if orig_schema.get("$ref") == "#/components/schemas/ApiResponse":
                        already = True
                    if "allOf" in orig_schema:
                        for item in orig_schema["allOf"]:
                            if (
                                isinstance(item, dict)
                                and item.get("$ref")
                                == "#/components/schemas/ApiResponse"
                            ):
                                already = True
                                break
                if already:
                    continue

                # Create new schema that places previous schema under `data`
                new_schema = {
                    "allOf": [
                        {"$ref": "#/components/schemas/ApiResponse"},
                        {"type": "object", "properties": {"data": orig_schema}},
                    ]
                }

                app_json["schema"] = new_schema

    return schema


if __name__ == "__main__":
    if not OUTPUT_FILE:
        raise RuntimeError("OPENAPI_OUTPUT_FILE not set in env")
    generate_openapi_schema(OUTPUT_FILE)
