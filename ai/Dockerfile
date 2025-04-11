
###
# Dockerfile.main_test
FROM python:3.9-slim

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN pip install --no-cache-dir chromadb ollama flask translate httpx==0.28.1 redis

WORKDIR /app

COPY main.py main.py

CMD ["python", "main.py"]