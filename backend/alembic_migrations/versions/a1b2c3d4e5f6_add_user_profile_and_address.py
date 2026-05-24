"""Add user profile fields and addresses table

Revision ID: a1b2c3d4e5f6
Revises: 402d067a8b92
Create Date: 2026-05-24 12:45:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "a1b2c3d4e5f6"
down_revision = "402d067a8b92"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands generated for adding profile fields and addresses table ###
    # Create role enum type
    role_enum = postgresql.ENUM('student', 'instructor', 'admin', 'vendor', name='role')
    role_enum.create(op.get_bind(), checkfirst=True)

    # Add columns to user table
    op.add_column('user', sa.Column('full_name', sa.String(length=255), nullable=True))
    op.add_column('user', sa.Column('phone', sa.String(length=32), nullable=True))
    op.add_column('user', sa.Column('role', sa.Enum('student', 'instructor', 'admin', 'vendor', name='role'), nullable=False, server_default='student'))

    # Create addresses table
    op.create_table(
        'addresses',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('line1', sa.String(length=255), nullable=False),
        sa.Column('line2', sa.String(length=255), nullable=True),
        sa.Column('city', sa.String(length=128), nullable=True),
        sa.Column('state', sa.String(length=128), nullable=True),
        sa.Column('postal_code', sa.String(length=32), nullable=True),
        sa.Column('country', sa.String(length=128), nullable=True),
        sa.Column('phone', sa.String(length=32), nullable=True),
        sa.Column('is_default', sa.Boolean(), nullable=True, server_default=sa.text('false')),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_addresses_user_id'), 'addresses', ['user_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands generated for downgrade ###
    op.drop_index(op.f('ix_addresses_user_id'), table_name='addresses')
    op.drop_table('addresses')
    op.drop_column('user', 'role')
    op.drop_column('user', 'phone')
    op.drop_column('user', 'full_name')
    # Drop role enum type
    role_enum = postgresql.ENUM('student', 'instructor', 'admin', 'vendor', name='role')
    role_enum.drop(op.get_bind(), checkfirst=True)
    # ### end Alembic commands ###
