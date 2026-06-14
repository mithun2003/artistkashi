"""add image source type

Revision ID: e91badb52896
Revises: 30d267f5e721
Create Date: 2026-06-13 06:16:02.518192

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e91badb52896"
down_revision: Union[str, None] = "30d267f5e721"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():

    image_source_type = sa.Enum(
        "upload",
        "external_url",
        name="image_source_type",
    )

    image_source_type.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "product_images",
        sa.Column(
            "source_type",
            image_source_type,
            nullable=False,
            server_default="external_url",
        ),
    )

    op.alter_column(
        "product_images",
        "source_type",
        server_default=None,
    )


def downgrade():

    op.drop_column("product_images", "source_type")

    image_source_type = sa.Enum(
        "upload",
        "external_url",
        name="image_source_type",
    )

    image_source_type.drop(op.get_bind(), checkfirst=True)
