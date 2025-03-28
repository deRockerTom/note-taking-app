FROM python:3.12

WORKDIR /app

COPY ./app/requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY ./app /app

CMD ["uvicorn", "main:app", "--log-level", "info",  "--host", "0.0.0.0", "--port", "8000"]
