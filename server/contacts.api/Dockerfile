FROM golang:latest as build-env
LABEL authors="victorrueda"

RUN go install github.com/go-delve/delve/cmd/dlv@latest

ADD . /app
WORKDIR /app

RUN go build -gcflags "all=-N -l" -o /server

FROM ubuntu:latest
EXPOSE 5001 40001
WORKDIR /
RUN mkdir -p /logs/
COPY --from=build-env /go/bin/dlv /
COPY --from=build-env /server /contact-api/

CMD ["/dlv", "--listen=:40001", "--headless=true", "--api-version=2", "--accept-multiclient", "exec", "/contact-api/server"]