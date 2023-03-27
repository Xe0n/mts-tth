#!/bin/bash
export POSTGRESQL_URL="postgres://video_storage_server:video_storage_server_pass@localhost:5432/video_storage_server_db?sslmode=disable"
migrate -database ${POSTGRESQL_URL} -path db/migrations up