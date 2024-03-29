FROM golang:latest as build-env
LABEL authors="victorrueda"

RUN go install github.com/go-delve/delve/cmd/dlv@latest

ADD .. /app
WORKDIR /app

RUN go build -gcflags "all=-N -l" -o /server

FROM ubuntu:latest
RUN mkdir -p /usr/share/ca-certificates
COPY photogrio.crt /usr/share/ca-certificates
RUN apt-get update
RUN apt-get install -y ca-certificates
RUN update-ca-certificates
EXPOSE 5001 40000
WORKDIR /photogrio/
COPY .env.development /photogrio/
RUN mkdir -p /logs/
RUN apt update
RUN apt install nano
COPY localhost.pem /photogrio/
COPY localhostkey.pem /photogrio/
COPY --from=build-env /go/bin/dlv /
COPY --from=build-env /server /photogrio/

CMD ["/dlv", "--listen=:40000", "--headless=true", "--api-version=2", "--accept-multiclient", "exec", "/photogrio/server"]