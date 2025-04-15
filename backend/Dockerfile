FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

# 의존성 파일 복사 및 다운로드
COPY pom.xml .
RUN mvn dependency:go-offline

# 소스 코드 복사
COPY src ./src

# 애플리케이션 빌드
RUN mvn package -DskipTests

# 런타임 이미지
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 빌드 이미지에서 JAR 파일 복사
COPY --from=build /app/target/*.jar app.jar

# MySQL이 시작된 후 애플리케이션 시작
ENTRYPOINT ["java", "-jar", "app.jar"] 