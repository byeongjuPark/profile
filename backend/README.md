# Backend Profile Project

## MySQL Database Setup

The application now uses MySQL as its database. Follow these steps to set up the MySQL database:

1. Install MySQL if you haven't already:

   - For macOS: `brew install mysql`
   - For Windows: Download and install from [MySQL official website](https://dev.mysql.com/downloads/installer/)
   - For Linux: Use your distribution's package manager (e.g., `apt-get install mysql-server`)

2. Start MySQL service:

   - macOS: `brew services start mysql`
   - Windows: The service should start automatically or through MySQL Workbench
   - Linux: `sudo systemctl start mysql`

3. Create the database:

   ```sql
   CREATE DATABASE profiledb;
   ```

4. Configure application.properties:
   The default configuration should work with the following settings:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/profiledb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=
   ```

   If you use a different username or password, make sure to update them in the application.properties file.

5. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Configuration Notes

- The application uses Hibernate's auto-update feature to automatically create and update database schema.
- For production use, consider changing `spring.jpa.hibernate.ddl-auto` to `validate` instead of `update`.
