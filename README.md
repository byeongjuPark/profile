# 프로필 프로젝트

프론트엔드(Next.js)와 백엔드(Spring Boot), MySQL을 포함한 프로필 웹 애플리케이션입니다.

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

- `/backend`: Spring Boot 백엔드 프로젝트
- `/frontend`: Next.js 프론트엔드 프로젝트
- `docker-compose.yml`: Docker Compose 설정 파일
