CREATE TABLE consoles (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL
);