CREATE TABLE IF NOT EXISTS games (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        console_id BIGINT NOT NULL REFERENCES consoles(id),
        title VARCHAR(150) NOT NULL,
        condition TEXT NOT NULL
);