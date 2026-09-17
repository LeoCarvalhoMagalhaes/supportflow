from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models
from app.routers import auth, tickets


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SUPPORTFLOW API",
    description="API para gerenciamento de tickets de suporte.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(tickets.router)
app.include_router(auth.router)


@app.get("/")
def home():
    return {
        "message": "SUPPORTFLOW API está funcionando!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }