FROM node:18-alpine AS build

WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# 프로덕션 실행 이미지
FROM node:18-alpine AS runner

WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV=production

# 빌드된 파일과 필요한 설정 파일 복사
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# 서버 실행
CMD ["npm", "start"] 