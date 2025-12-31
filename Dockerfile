FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean build -x test --no-daemon

EXPOSE 8080
CMD sh -c "java -jar build/libs/*.jar"