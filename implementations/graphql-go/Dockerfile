FROM golang:1.19

WORKDIR /go/src/server
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

CMD go run server.go
