# webresource
A full-stack article management system, developed for Internet Engineering course

## Running the Project

This project is a full-stack article management system built with:

* **Backend:** Spring Boot + Hibernate + H2 Database
* **Frontend:** React + Vite

The application can be used in two ways:

1. Through the **React Frontend**
2. Directly through the **REST API**

---

## Project Structure

```text
webresource/
│
├── backend/     # Spring Boot backend
└── frontend/    # React frontend
```

---

## Requirements

Install the following before running the project:

* Java 21+
* Maven
* Node.js 18+
* npm

---

## Running the Backend

Open a terminal:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend server will start on:

```text
http://localhost:8080
```

---

## Database

The project uses an H2 relational database with Hibernate ORM.

Hibernate automatically creates the required tables when the application starts.

### H2 Console

Access the database console at:

```text
http://localhost:8080/h2-console
```

Use the following configuration:

| Setting  | Value                             |
| -------- | --------------------------------- |
| JDBC URL | `jdbc:h2:file:./data/articles_db` |
| Username | `sa`                              |
| Password | *(leave empty)*                   |

---

## Running the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

---

## Using the Application

### Method 1 — React Frontend

Open:

```text
http://localhost:5173
```

Features:

* View all articles
* Search articles
* Sort articles
* Create articles
* View article details
* Delete articles
* See citation counts
* View publish dates

---

### Method 2 — REST API

The backend exposes REST endpoints.

Base URL:

```text
http://localhost:8080/api/articles
```

---

## API Examples

### Create an Article

```bash
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Java",
    "summary":"Java basics",
    "body":"Introduction to Java",
    "refs":[]
}'
```

---

### Create an Article with References

```bash
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Spring",
    "summary":"Spring Framework",
    "body":"Spring Boot content",
    "refs":["Java"]
}'
```

---

### Get All Articles

```bash
curl http://localhost:8080/api/articles
```

---

### Search Articles

```bash
curl "http://localhost:8080/api/articles?q=java"
```

---

### Sort by Date

```bash
curl "http://localhost:8080/api/articles?sort=date"
```

---

### Get Single Article

```bash
curl http://localhost:8080/api/articles/Java
```

---

### Delete an Article

```bash
curl -X DELETE http://localhost:8080/api/articles/Java
```

---

## Technologies Used

### Backend

* Spring Boot
* Spring Data JPA
* Hibernate
* H2 Database
* Maven

### Frontend

* React
* Vite
* Axios
* React Router
* React Toastify

---

### Notes

* Article titles must be unique.
* Self-references are not allowed.
* Data is persisted in the H2 database and remains after restarting the application.
