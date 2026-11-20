# ---------- Build Stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN chmod +x mvnw || true

RUN if [ -f "./mvnw" ]; then ./mvnw dependency:go-offline; else mvn dependency:go-offline; fi

COPY src src

RUN if [ -f "./mvnw" ]; then \
      ./mvnw clean package -DskipTests; \
    else \
      mvn clean package -DskipTests; \
    fi

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

RUN mkdir -p data

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]