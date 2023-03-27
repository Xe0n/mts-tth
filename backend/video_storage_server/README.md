### Create migrations example:
migrate create -ext sql -dir db/migrations -seq create_video_items_table 
### Run migrations example:
migrate -database ${POSTGRESQL_URL} -path db/migrations up