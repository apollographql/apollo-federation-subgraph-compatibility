FROM python:3.14-slim-bookworm
WORKDIR /web
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY server.py ./
EXPOSE 4001
USER appuser
CMD strawberry dev -p 4001 -h 0.0.0.0 server:schema
