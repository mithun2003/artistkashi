# app/services/cloudflare_service.py

import asyncio

import httpx
from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import (
    ServiceException,
    ValidationException,
)


class CloudflareImageService:
    def __init__(self):
        self.account_id = settings.CLOUDFLARE_ACCOUNT_ID
        self.api_token = settings.CLOUDFLARE_API_TOKEN

    async def upload_image(self, file: UploadFile) -> str:

        if not file.content_type:
            raise ValidationException("Invalid file")

        allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}

        if file.content_type not in allowed_types:
            raise ValidationException("Only JPEG, PNG, WEBP and GIF images are allowed")

        url = (
            f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/images/v1"
        )

        headers = {
            "Authorization": f"Bearer {self.api_token}",
        }

        try:
            content = await file.read()

            files = {"file": (file.filename, content, file.content_type)}

            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(url, headers=headers, files=files)

            response.raise_for_status()

            payload = response.json()

            if not payload.get("success"):
                raise ServiceException("Cloudflare", str(payload.get("errors")))

            result = payload.get("result")

            if not result:
                raise ServiceException("Cloudflare", "No upload result returned")

            variants = result.get("variants", [])

            if not variants:
                raise ServiceException("Cloudflare", "No image URL returned")

            return variants[0]

        except httpx.HTTPError as exc:
            raise ServiceException("Cloudflare", f"Upload failed: {exc}") from exc

    async def upload_images(self, files: list[UploadFile]) -> list[str]:

        if not files:
            return []

        results = await asyncio.gather(*[self.upload_image(file) for file in files])

        return list(results)


cloudflare_image_service = CloudflareImageService()
