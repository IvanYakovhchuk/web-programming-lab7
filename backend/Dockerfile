FROM openjdk:22-jdk-slim AS build

COPY . /app

RUN apt-get update && apt-get install -y maven

WORKDIR /app
RUN mvn clean package

FROM openjdk:22-jdk-slim

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]