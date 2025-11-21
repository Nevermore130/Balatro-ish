# Docker 部署指南

本文档介绍如何使用 Docker 部署 Balatro-ish 应用。

## 前置要求

- Docker (版本 20.10 或更高)
- Docker Compose (版本 2.0 或更高，可选)

## 快速开始

### 方法一：使用 Docker Compose（推荐）

1. **复制环境变量文件**
   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件，填入你的 Gemini API Key**
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **构建并启动容器**
   ```bash
   docker-compose up -d --build
   ```

4. **访问应用**
   打开浏览器访问：http://localhost:3000

5. **查看日志**
   ```bash
   docker-compose logs -f
   ```

6. **停止容器**
   ```bash
   docker-compose down
   ```

### 方法二：使用 Docker 命令

1. **构建镜像**
   ```bash
   docker build --build-arg GEMINI_API_KEY=your_api_key_here -t balatro-ish:latest .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name balatro-ish \
     -p 3000:80 \
     --restart unless-stopped \
     balatro-ish:latest
   ```

3. **访问应用**
   打开浏览器访问：http://localhost:3000

4. **查看日志**
   ```bash
   docker logs -f balatro-ish
   ```

5. **停止容器**
   ```bash
   docker stop balatro-ish
   docker rm balatro-ish
   ```

## 环境变量

应用需要以下环境变量：

- `GEMINI_API_KEY`: Gemini API 密钥（必需）

### 使用环境变量文件

创建 `.env` 文件：
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

然后在构建时使用：
```bash
docker-compose up -d --build
```

或者使用 `--env-file` 参数：
```bash
docker run -d \
  --name balatro-ish \
  -p 3000:80 \
  --env-file .env \
  balatro-ish:latest
```

## 生产环境部署

### 使用 HTTPS

在生产环境中，建议使用反向代理（如 Traefik 或 Nginx）来处理 HTTPS。修改 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  balatro-ish:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        GEMINI_API_KEY: ${GEMINI_API_KEY}
    container_name: balatro-ish
    restart: unless-stopped
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    networks:
      - balatro-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.balatro-ish.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.balatro-ish.entrypoints=websecure"
      - "traefik.http.routers.balatro-ish.tls.certresolver=letsencrypt"

networks:
  balatro-network:
    driver: bridge
```

### 自定义端口

修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:80"  # 将 8080 改为你想要的端口
```

## 故障排查

### 查看容器日志
```bash
docker-compose logs -f balatro-ish
```

### 进入容器调试
```bash
docker exec -it balatro-ish sh
```

### 检查容器状态
```bash
docker ps -a
```

### 重新构建镜像
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 更新应用

1. **拉取最新代码**
   ```bash
   git pull
   ```

2. **重新构建并启动**
   ```bash
   docker-compose up -d --build
   ```

## 清理

### 停止并删除容器
```bash
docker-compose down
```

### 删除镜像
```bash
docker rmi balatro-ish:latest
```

### 清理所有未使用的资源
```bash
docker system prune -a
```

