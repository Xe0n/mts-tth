CREATE TABLE IF NOT EXISTS video_items(
pk UUID NOT NULL DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL UNIQUE,
short_description VARCHAR(256),
full_description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
safe_version BOOLEAN NOT NULL DEFAULT false,
CONSTRAINT pk_video_items PRIMARY KEY (pk)
);