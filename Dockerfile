FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean build -x test --no-daemon

EXPOSE 8080
CMD ["java", "-jar", "build/libs/tritech-0.0.1-SNAPSHOT.jar"]