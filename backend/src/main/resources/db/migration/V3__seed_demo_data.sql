INSERT INTO members (member_code, full_name, email, phone, card_type, card_expiry_date, role)
VALUES
    ('M001', 'Nguyen Van Member', 'member@example.com', '0900000001', 'STANDARD', CURRENT_DATE + INTERVAL '1 year', 'MEMBER'),
    ('L001', 'Tran Thi Librarian', 'librarian@example.com', '0900000002', 'PREMIUM', CURRENT_DATE + INTERVAL '1 year', 'LIBRARIAN'),
    ('A001', 'Le Van Admin', 'admin@example.com', '0900000003', 'PREMIUM', CURRENT_DATE + INTERVAL '1 year', 'ADMIN')
ON CONFLICT (member_code) DO NOTHING;

INSERT INTO books (isbn, title, author, category, publisher, description)
VALUES
    ('9780132350884', 'Clean Code', 'Robert C. Martin', 'Technology', 'Prentice Hall', 'A handbook of agile software craftsmanship.'),
    ('9780134494166', 'Clean Architecture', 'Robert C. Martin', 'Technology', 'Prentice Hall', 'Architecture principles for maintainable software.'),
    ('9781617292545', 'Spring Boot in Action', 'Craig Walls', 'Technology', 'Manning', 'A practical guide to building Spring Boot applications.')
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'CLEAN-CODE-01', 'AVAILABLE', 'A1-01'
FROM books
WHERE isbn = '9780132350884'
ON CONFLICT (copy_code) DO NOTHING;

INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'CLEAN-ARCH-01', 'LOANED', 'A1-02'
FROM books
WHERE isbn = '9780134494166'
ON CONFLICT (copy_code) DO NOTHING;

INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'SPRING-BOOT-01', 'AVAILABLE', 'B2-01'
FROM books
WHERE isbn = '9781617292545'
ON CONFLICT (copy_code) DO NOTHING;

INSERT INTO loans (book_copy_id, member_id, loan_date, due_date, status, renewal_count)
SELECT bc.id, m.id, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days', 'ACTIVE', 0
FROM book_copies bc
JOIN members m ON m.member_code = 'M001'
WHERE bc.copy_code = 'CLEAN-ARCH-01'
  AND NOT EXISTS (
      SELECT 1
      FROM loans existing
      WHERE existing.book_copy_id = bc.id
        AND existing.member_id = m.id
        AND existing.status = 'ACTIVE'
  );
