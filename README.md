# Hệ thống Quản lý Thư viện Sách (Fullstack)

Dự án này là hệ thống thư viện số hỗ trợ quản lý kho sách, đăng ký mượn sách, theo dõi thời hạn trả và tính phí phạt trễ hạn.

## ERD (Sơ đồ Cơ sở Dữ liệu)

```mermaid
erDiagram
    books {
        bigserial id PK
        varchar isbn "UK"
        varchar title
        varchar author
        varchar category
        varchar publisher
        text description
        varchar cover_url
        timestamp created_at
        timestamp updated_at
    }
    
    book_copies {
        bigserial id PK
        bigint book_id FK
        varchar copy_code "UK"
        varchar status "AVAILABLE, LOANED, RESERVED, LOST"
        varchar shelf_location
        timestamp created_at
        timestamp updated_at
    }
    
    members {
        bigserial id PK
        varchar member_code "UK"
        varchar full_name
        varchar email "UK"
        varchar phone "UK"
        varchar role "MEMBER, LIBRARIAN, ADMIN"
        varchar card_type "STANDARD, PREMIUM"
        date card_expiry_date
        timestamp created_at
        timestamp updated_at
    }
    
    loans {
        bigserial id PK
        bigint member_id FK
        bigint book_copy_id FK
        timestamp loan_date
        timestamp due_date
        timestamp return_date
        varchar status "ACTIVE, RETURNED"
        integer renewal_count
    }
    
    reservations {
        bigserial id PK
        bigint member_id FK
        bigint book_id FK
        timestamp reservation_date
        varchar status "PENDING, FULFILLED, CANCELLED"
    }
    
    fines {
        bigserial id PK
        bigint loan_id FK
        numeric amount
        varchar status "UNPAID, PAID, WAIVED"
        varchar reason
        timestamp created_at
    }
    
    books ||--o{ book_copies : "has"
    book_copies ||--o{ loans : "borrowed as"
    members ||--o{ loans : "borrows"
    books ||--o{ reservations : "reserved"
    members ||--o{ reservations : "reserves"
    loans ||--o{ fines : "generates"
```

## Yêu cầu Hệ thống
- JDK 21+
- Node.js 18+
- PostgreSQL 15+
- Maven (cho backend)

## Hướng dẫn cài đặt Backend
1. Mở thư mục `backend`
2. Cấu hình file `src/main/resources/application.yml` (hoặc tạo file `.env` tham chiếu tới DB PostgreSQL)
3. Chạy `.\mvnw.cmd spring-boot:run`
4. Flyway sẽ tự động chạy các file SQL Migration và khởi tạo schema cũng như dữ liệu mẫu (admin: member/member123, librarian: lib/lib123, member: member/member123).
5. API chạy ở cổng `8080` (Swagger UI: `http://localhost:8080/swagger-ui.html`)

## Hướng dẫn cài đặt Frontend
1. Mở thư mục `frontend`
2. Chạy `npm install`
3. Chạy `npm run dev`
4. Truy cập `http://localhost:5173`
5. Bạn có thể đăng nhập bằng mã thẻ:
   - Admin: `admin` (Mật khẩu bất kỳ do BE không kiểm tra)
   - Librarian: `librarian`
   - Member: `member`

## Các tính năng chính
1. **Quản lý Thành viên**: Thêm/Sửa/Xoá, phân quyền RBAC.
2. **Quản lý Sách và Kho**: Quản lý đầu mục sách, quản lý các bản sao (Book copies).
3. **Mượn/Trả sách**: Nghiệp vụ quản lý phiếu mượn, kiểm tra tự động phát sinh Fine (phí phạt) khi quá hạn.
4. **Đặt chỗ**: Đặt chỗ (Reservation) sách đã hết và tự động thông báo/chuyển trạng thái khi có người trả sách.
5. **Thống kê**: Bảng điều khiển (Dashboard) cho thủ thư và quản trị viên, xuất file CSV.
