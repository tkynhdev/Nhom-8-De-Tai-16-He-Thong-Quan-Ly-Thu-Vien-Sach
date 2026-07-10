# Library Backend

Backend Spring Boot cho he thong quan ly thu vien so.

## Cong nghe

- Java 21
- Spring Boot 3.3
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- Bean Validation
- Swagger/OpenAPI
- JUnit/MockMvc

## Cau hinh moi truong

Backend doc cau hinh tu bien moi truong, co gia tri mac dinh trong `src/main/resources/application.yml`.

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/library"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
$env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
```

## Chay ung dung

```powershell
.\mvnw.cmd spring-boot:run
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## Tai khoan demo

Du lieu mau nam trong `V3__seed_demo_data.sql`.

- `M001`: MEMBER
- `L001`: LIBRARIAN
- `A001`: ADMIN

Login:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "memberCode": "M001"
}
```

## API chinh

- `GET /api/v1/books/search`: tra cuu sach.
- `POST /api/v1/loans/borrow`: muon sach.
- `GET /api/v1/loans/my-loans`: lich su muon cua thanh vien.
- `POST /api/v1/loans/{loanId}/return`: tra sach va tinh phi phat neu qua han.
- `POST /api/v1/loans/{loanId}/renew`: gia han muon sach.
- `GET /api/v1/loans/overdue`: danh sach phieu muon qua han.
- `POST /api/v1/reservations`: dat cho sach het ban sao.
- `GET /api/v1/admin/book-copies`: quan ly ban sao vat ly.
- `GET /api/v1/admin/statistics/overview`: bao cao thong ke.

## Test

```powershell
.\mvnw.cmd test
```

Neu dung macOS/Linux/Git Bash, chay `./mvnw spring-boot:run` hoac `./mvnw test`.
