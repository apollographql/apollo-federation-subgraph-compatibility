FROM python:3.9-alpine
WORKDIR /web
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY server.py ./
EXPOSE 4001
CMD python server.py
