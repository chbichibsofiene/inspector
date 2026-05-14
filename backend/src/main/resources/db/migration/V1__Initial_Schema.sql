-- Initial Schema Migration
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    serial_code VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    profile_image_url LONGTEXT,
    reset_code VARCHAR(6),
    reset_code_expires_at DATETIME,
    expo_push_token VARCHAR(255)
);
