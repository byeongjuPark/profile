# 포트폴리오 프로필 애플리케이션

개인 포트폴리오 프로필을 관리하고 표시하는 웹 애플리케이션입니다.

## Docker 설치하기

### Mac OS

```bash
# Homebrew를 통한 설치
brew install --cask docker

# Docker Desktop 실행
open -a Docker
```

### Windows

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) 웹사이트에서 설치 파일 다운로드
2. 다운로드한 설치 파일(Docker Desktop Installer.exe)을 실행
3. 설치 마법사의 지시에 따라 설치 완료
4. 설치 후 Docker Desktop 실행

### Linux (Ubuntu)

```bash
# 필요한 패키지 설치
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Docker 공식 GPG 키 추가
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Docker 저장소 설정
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 엔진 설치
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker 그룹에 현재 사용자 추가 (sudo 없이 Docker 사용)
sudo usermod -aG docker $USER
newgrp docker
```

## Docker로 실행하기

### 사전 요구사항

- Docker
- Docker Compose

### 실행 방법

1. 프로젝트 루트 디렉토리에서 다음 명령어를 실행:

```bash
docker-compose up -d
```

2. 각 서비스 접속:
   - 프론트엔드: http://localhost:3000
   - 백엔드 API: http://localhost:8080
   - MySQL: localhost:3306

### 서비스 중지

```bash
docker-compose down
```

### 데이터 초기화 (모든 컨테이너 및 볼륨 삭제)

```bash
docker-compose down -v
```

## 개발 모드에서 실행

### 백엔드

```bash
cd backend
./mvnw spring-boot:run
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

## 프로젝트 구조

- **frontend**: Next.js로 구현된 프론트엔드 애플리케이션
- **backend**: Spring Boot로 구현된 백엔드 API 서버
- **mysql**: 데이터 저장을 위한 MySQL 데이터베이스

## 환경변수 설정 방법

이 프로젝트는 다양한 환경에서 실행될 수 있도록 환경변수를 통해 설정할 수 있습니다.

### 주요 환경변수

- `NEXT_PUBLIC_API_URL`: 프론트엔드에서 백엔드 API에 접근하기 위한 URL

### 개발 환경 설정

1. **로컬 개발 환경 (.env.local)**

   `frontend/.env.local` 파일을 생성하고 다음과 같이 설정합니다:

   ```
   # 백엔드 API URL
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

2. **Docker Compose를 사용한 개발 환경**

   `docker-compose.yml` 파일에 환경변수가 이미 설정되어 있습니다:

   ```yaml
   frontend:
     environment:
       - NEXT_PUBLIC_API_URL=${API_URL:-http://localhost:8080}
   ```

   이 설정은 호스트 시스템에 `API_URL` 환경변수가 설정되어 있으면 그 값을 사용하고, 
   없으면 기본값으로 `http://localhost:8080`을 사용합니다.

### 프로덕션(배포) 환경 설정

1. **빌드 시 환경변수 설정 (.env.production)**

   `frontend/.env.production` 파일을 생성하고 실제 배포 환경에 맞게 설정합니다:

   ```
   # 백엔드 API URL (실제 배포 시 서버 도메인으로 변경)
   NEXT_PUBLIC_API_URL=https://your-production-api.com
   ```

2. **Docker Compose로 배포 시 환경변수 설정**

   배포 시 환경변수를 지정하여 Docker Compose를 실행합니다:

   ```bash
   API_URL=https://your-api.com docker-compose up -d
   ```

3. **런타임 폴백 메커니즘**

   환경변수가 설정되지 않은 경우, 애플리케이션은 `window.location.origin`을 사용하여
   현재 브라우저에서 접속한 도메인을 API URL로 사용합니다. 이는 프론트엔드와 백엔드가
   같은 도메인에 호스팅되어 있을 때 유용합니다.

## 실행 방법

### Docker Compose를 사용한 실행

전체 애플리케이션(프론트엔드, 백엔드, 데이터베이스)을 한 번에 실행합니다:

```bash
docker-compose up -d
```

### 수정 후 재빌드

코드를 수정한 후 컨테이너를 재빌드하고 재시작합니다:

```bash
docker-compose down
docker-compose up --build -d
```

## 접속 방법

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080
- 데이터베이스: localhost:3307 (MySQL 클라이언트 사용)
