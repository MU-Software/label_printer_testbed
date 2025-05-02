from __future__ import annotations

import collections.abc
import contextlib
import http

import fastapi
import fastapi.middleware.cors
import fastapi.staticfiles


async def _redirect_to_front_404_handler(*_: tuple, **__: dict) -> fastapi.responses.RedirectResponse:
    return fastapi.responses.RedirectResponse("/")


def create_app(**kwargs: dict) -> fastapi.FastAPI:
    @contextlib.asynccontextmanager
    async def app_lifespan(app: fastapi.FastAPI) -> collections.abc.AsyncGenerator[None, None]:
        pass

    app = fastapi.FastAPI(
        **kwargs,
        lifespan=app_lifespan,
        middleware=[
            fastapi.middleware.Middleware(
                fastapi.middleware.cors.CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
            ),
        ],
    )
    app.exception_handler(exc_class_or_status_code=http.HTTPStatus.NOT_FOUND)(_redirect_to_front_404_handler)
    app.mount("/static", fastapi.staticfiles.StaticFiles(directory="src/static"), name="static")
    # for route in routes.get_routes():
    #     app.include_router(route)

    return app
