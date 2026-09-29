FROM python:3.14-alpine
WORKDIR /web
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py ./
EXPOSE 4001
CMD python server.py
