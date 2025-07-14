# 使用 OpenJDK 镜像作为基础
FROM openjdk:17-jdk-slim AS builder

# 安装 Maven
RUN apt-get update && apt-get install -y maven

# 设置工作目录
WORKDIR /app

# 复制 Maven 配置文件和源码
COPY pom.xml .
COPY src ./src

# 编译并打包应用，跳过测试以加速构建
RUN mvn clean package -DskipTests

# 第二阶段：创建运行时镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 从构建阶段复制 JAR 文件
COPY --from=builder /app/target/WebSearch-0.0.1-SNAPSHOT.jar app.jar

# 创建上传文件目录
RUN mkdir -p /app/uploads

# 设置环境变量（默认值，可通过 Docker 或 K8s 覆盖）
ENV SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/WebSearch
ENV SPRING_DATASOURCE_USERNAME=WebSearch
ENV SPRING_DATASOURCE_PASSWORD=WebSearch123!
ENV SEARCHENGINE_URL=http://192.168.78.246:3001/search
ENV CRAWLER_URL=http://192.168.78.246:3000
ENV SPRING_PROFILES_ACTIVE=production
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
