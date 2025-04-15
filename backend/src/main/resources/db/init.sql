-- MySQL database initialization script

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS profiledb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE profiledb;

-- Make sure we have the right privileges
-- Uncomment and modify if you're using a different user
-- GRANT ALL PRIVILEGES ON profiledb.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;

-- Note: Tables will be created automatically by Hibernate 
-- with spring.jpa.hibernate.ddl-auto=update 