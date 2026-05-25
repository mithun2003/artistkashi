"""Normalize user role enum values

Revision ID: b7c8d9e0f1a2
Revises: a1b2c3d4e5f6
Create Date: 2026-05-25 18:50:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "b7c8d9e0f1a2"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE TYPE role_new AS ENUM ('user', 'admin')")
    op.execute('ALTER TABLE "user" ALTER COLUMN role DROP DEFAULT')
    op.execute(
        """
        ALTER TABLE "user"
        ALTER COLUMN role TYPE role_new
        USING CASE
            WHEN role::text IN ('admin', 'instructor') THEN 'admin'
            ELSE 'user'
        END::role_new
        """
    )
    op.execute("DROP TYPE role")
    op.execute("ALTER TYPE role_new RENAME TO role")
    op.alter_column(
        "user",
        "role",
        existing_type=sa.Enum("user", "admin", name="role"),
        server_default="user",
        existing_nullable=False,
    )


def downgrade() -> None:
    op.execute("CREATE TYPE role_old AS ENUM ('student', 'instructor', 'admin', 'vendor')")
    op.execute('ALTER TABLE "user" ALTER COLUMN role DROP DEFAULT')
    op.execute(
        """
        ALTER TABLE "user"
        ALTER COLUMN role TYPE role_old
        USING CASE
            WHEN role::text = 'admin' THEN 'instructor'
            ELSE 'student'
        END::role_old
        """
    )
    op.execute("DROP TYPE role")
    op.execute("ALTER TYPE role_old RENAME TO role")
    op.alter_column(
        "user",
        "role",
        existing_type=sa.Enum("student", "instructor", "admin", "vendor", name="role"),
        server_default="student",
        existing_nullable=False,
    )
