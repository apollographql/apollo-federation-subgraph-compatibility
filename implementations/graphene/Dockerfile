FROM python:3.10-alpine
WORKDIR /web
COPY requirements.txt ./
# adding git -> temp workaround for graphene-federation not available in pypi
RUN apk add --no-cache git \
    && pip install -r requirements.txt
COPY server.py ./
EXPOSE 4001
CMD python server.py
