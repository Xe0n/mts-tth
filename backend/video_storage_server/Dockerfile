FROM golang:1.20-alpine3.17 as builder
COPY go.mod go.sum /go/src/github.com/yud-warrior/video-storage-server/
WORKDIR /go/src/github.com/yud-warrior/video-storage-server
RUN go mod download
COPY . /go/src/github.com/yud-warrior/video-storage-server
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o build/video-storage-server github.com/yud-warrior/video-storage-server
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init
RUN chmod +x /go/src/github.com/yud-warrior/video-storage-server/migrate_up.sh
RUN chmod +x /go/src/github.com/yud-warrior/video-storage-server/migrate_down.sh
RUN chmod +x /go/src/github.com/yud-warrior/video-storage-server/migrate_force_1.sh
RUN chmod +x /go/src/github.com/yud-warrior/video-storage-server/mp4_to_hls_ffmpeg.sh
RUN chmod +x /go/src/github.com/yud-warrior/video-storage-server/make_migrations.sh

FROM alpine
RUN apk add --no-cache ca-certificates && update-ca-certificates
COPY --from=builder /go/src/github.com/yud-warrior/video-storage-server/build/video-storage-server /usr/bin/video-storage-server
EXPOSE 8080 8080
ENTRYPOINT ["/usr/bin/video-storage-server"]