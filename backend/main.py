from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api import front_api


app = FastAPI()
# app.include_router(binary_api.binary_router)
app.include_router(front_api.front_router)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)