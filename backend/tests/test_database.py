import pytest
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
)

from app.core.db import (
    async_session_maker,
    create_db_and_tables,
    get_async_session,
)
from app.models import Base


@pytest.fixture
async def mock_engine(mocker):
    # Mock the engine
    mock_engine = mocker.AsyncMock(spec=AsyncEngine)

    # Create a mock connection
    mock_conn = mocker.AsyncMock()
    mock_conn.run_sync = mocker.AsyncMock()

    # Set up the context manager properly
    mock_context = mocker.AsyncMock()
    mock_context.__aenter__.return_value = mock_conn
    mock_engine.begin.return_value = mock_context

    return mock_engine


@pytest.fixture
async def mock_session(
    mocker,
):
    session = mocker.AsyncMock(
        spec=AsyncSession,
    )

    mock_session_maker = mocker.patch("app.core.db.async_session_maker")

    mock_session_maker.return_value.__aenter__.return_value = session

    return session


@pytest.mark.asyncio
async def test_create_db_and_tables(
    mock_engine,
    mocker,
):
    mocker.patch(
        "app.core.db.engine",
        mock_engine,
    )

    await create_db_and_tables()

    mock_engine.begin.assert_called_once()

    mock_conn = mock_engine.begin.return_value.__aenter__.return_value

    mock_conn.run_sync.assert_called_once_with(
        Base.metadata.create_all,
    )


@pytest.mark.asyncio
async def test_get_async_session(
    mock_session,
):
    generator = get_async_session()

    session = await generator.__anext__()

    assert session == mock_session


def test_engine_creation(
    mocker,
):
    mock_settings = mocker.patch("app.core.db.settings")

    mock_settings.DATABASE_URL = "sqlite+aiosqlite:///./test.db"

    mock_settings.EXPIRE_ON_COMMIT = False

    from app.core.db import (
        async_session_maker,
        engine,
    )

    assert isinstance(
        engine,
        AsyncEngine,
    )

    assert async_session_maker.kw["expire_on_commit"] is False


@pytest.mark.asyncio
async def test_session_maker_configuration():
    async with async_session_maker() as session:
        assert isinstance(
            session,
            AsyncSession,
        )
