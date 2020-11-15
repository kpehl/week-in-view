DROP DATABASE IF EXISTS week_in_view_draft_db;
CREATE DATABASE week_in_view_draft_db;

DROP USER IF EXISTS 'wiv_admin'@'localhost';
CREATE USER 'wiv_admin'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON week_in_view_draft_db.* TO 'wiv_admin'@'localhost';