FROM python:3.9-alpine
WORKDIR /web
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY server.py ./
EXPOSE 4001
CMD strawberry server -p 4001 -h 0.0.0.0 server:schema
