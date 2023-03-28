### Create migrations example:
migrate create -ext sql -dir db/migrations -seq create_video_items_table 
### Run migrations example:
migrate -database ${POSTGRESQL_URL} -path db/migrations up
### Converting .mp4 to .m3u8 playlist:
./mp4_to_hls_ffmpeg.sh storage/videos/src_videos/<name>.mp4 storage/videos/hls/<name>