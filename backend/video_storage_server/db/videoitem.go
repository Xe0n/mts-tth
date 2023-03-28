package db

import (
	"database/sql"

	"github.com/yud-warrior/video-storage-server/models"
)

func (db Database) GetAllVideoItems() (*models.VideoItemList, error) {
	list := &models.VideoItemList{}
	rows, err := db.Conn.Query("SELECT * FROM video_items ORDER BY created_at ASC")
	if err != nil {
		return list, err
	}
	for rows.Next() {
		var videoItem models.VideoItem
		err := rows.Scan(
			&videoItem.ID,
			&videoItem.Name,
			&videoItem.ShortDescription,
			&videoItem.FullDescription,
			&videoItem.CreatedAt,
			&videoItem.SafeVersion,
		)
		if err != nil {
			return list, err
		}
		list.VideoItems = append(list.VideoItems, videoItem)
	}
	return list, nil
}

func (db Database) GetFirstNVideoItems(numberOfRows int) (*models.VideoItemList, error) {
	list := &models.VideoItemList{}
	rows, err := db.Conn.Query("SELECT * FROM video_items ORDER BY created_at ASC fetch first $1 rows only", numberOfRows)
	if err != nil {
		return list, err
	}
	for rows.Next() {
		var videoItem models.VideoItem
		err := rows.Scan(
			&videoItem.ID,
			&videoItem.Name,
			&videoItem.ShortDescription,
			&videoItem.FullDescription,
			&videoItem.CreatedAt,
			&videoItem.SafeVersion,
		)
		if err != nil {
			return list, err
		}
		list.VideoItems = append(list.VideoItems, videoItem)
	}
	return list, nil
}

func (db Database) AddVideoItem(videoItem *models.VideoItem) error {
	var id string
	var createdAt string
	var safeVersion bool
	query := `INSERT INTO video_items (name, short_description, full_description) VALUES ($1, $2, $3) RETURNING id, created_at, safe_version`
	err := db.Conn.QueryRow(
		query, videoItem.Name,
		videoItem.ShortDescription,
		videoItem.FullDescription,
	).Scan(&id, &createdAt, &safeVersion)
	if err != nil {
		return err
	}
	videoItem.ID = id
	videoItem.CreatedAt = createdAt
	return nil
}

func (db Database) GetVideoItemById(videoItemId string) (models.VideoItem, error) {
	videoItem := models.VideoItem{}
	query := `SELECT * FROM video_items WHERE id = $1;`
	row := db.Conn.QueryRow(query, videoItemId)
	switch err := row.Scan(
		&videoItem.ID,
		&videoItem.Name,
		&videoItem.ShortDescription,
		&videoItem.FullDescription,
		&videoItem.CreatedAt,
		&videoItem.SafeVersion,
	); err {
	case sql.ErrNoRows:
		return videoItem, ErrNoMatch
	default:
		return videoItem, err
	}
}

func (db Database) DeleteVideoItem(videoItemId string) error {
	query := `DELETE FROM video_items WHERE id = $1;`
	_, err := db.Conn.Exec(query, videoItemId)
	switch err {
	case sql.ErrNoRows:
		return ErrNoMatch
	default:
		return err
	}
}

func (db Database) UpdateVideoItem(videoItemId string, videoItemData models.VideoItem) (models.VideoItem, error) {
	videoItem := models.VideoItem{}
	query := `UPDATE video_items SET name=$1, short_description=$2, full_description=$3, safe_version=$4 WHERE id=$5 RETURNING id, name, short_description, full_description, created_at, safe_version;`
	err := db.Conn.QueryRow(
		query,
		videoItemData.Name,
		videoItemData.ShortDescription,
		videoItemData.FullDescription,
		videoItemData.SafeVersion,
		videoItemId,
	).Scan(&videoItem.ID,
		&videoItem.Name,
		&videoItem.ShortDescription,
		&videoItem.FullDescription,
		&videoItem.CreatedAt,
		&videoItem.SafeVersion,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return videoItem, ErrNoMatch
		}
		return videoItem, err
	}
	return videoItem, nil
}

func (db Database) UpdateVideoItemSafeVersion(videoItemId string, safeVersion bool) (models.VideoItem, error) {
	videoItem := models.VideoItem{}
	query := `UPDATE video_items SET safe_version=$1 WHERE id=$2 RETURNING id, name, short_description, full_description, created_at, safe_version;`
	err := db.Conn.QueryRow(
		query,
		safeVersion,
		videoItemId,
	).Scan(&videoItem.ID,
		&videoItem.Name,
		&videoItem.ShortDescription,
		&videoItem.FullDescription,
		&videoItem.CreatedAt,
		&videoItem.SafeVersion,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return videoItem, ErrNoMatch
		}
		return videoItem, err
	}
	return videoItem, nil
}
