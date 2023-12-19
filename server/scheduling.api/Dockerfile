FROM golang:latest as build-env
LABEL authors="victorrueda"

RUN go install github.com/go-delve/delve/cmd/dlv@latest

ADD . /app
WORKDIR /app

RUN go build -gcflags "all=-N -l" -o /server

FROM ubuntu:latest
RUN mkdir -p /usr/share/ca-certificates
COPY photogrio.crt /usr/share/ca-certificates
RUN apt-get update
RUN apt-get install -y ca-certificates
RUN update-ca-certificates
RUN apt update
RUN apt install nano
EXPOSE 5003 40003
WORKDIR /scheduling-api
COPY --from=build-env /go/bin/dlv /
COPY --from=build-env /server /scheduling-api/
