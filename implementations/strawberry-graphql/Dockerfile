FROM python:3.14-slim-bookworm

COPY requirements.txt server.py ./
RUN pip install -r requirements.txt

EXPOSE 4001
CMD strawberry dev -p 4001 -h 0.0.0.0 server:schema
