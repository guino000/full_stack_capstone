"""Added columns to cart_items table

Revision ID: de88d62991ea
Revises: 54aa803173f7
Create Date: 2022-07-09 17:07:43.940146

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'de88d62991ea'
down_revision = '54aa803173f7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cart_items', sa.Column('quantity', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cart_items', 'quantity')
    # ### end Alembic commands ###
