FROM golang:1.27

WORKDIR /go/src/server
COPY . .

RUN go mod download
RUN go install -v ./...

CMD go run server.go
