-- Insert more books
INSERT INTO books (isbn, title, author, category, publisher, description)
VALUES
    ('9781491950296', 'Programming TypeScript', 'Boris Cherny', 'Technology', 'O''Reilly Media', 'Making Your JavaScript Applications Scale.'),
    ('9780135957059', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Technology', 'Addison-Wesley Professional', 'Your Journey to Mastery.'),
    ('9780201616224', 'Design Patterns', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Technology', 'Addison-Wesley Professional', 'Elements of Reusable Object-Oriented Software.'),
    ('9781491904244', 'You Don''t Know JS: Scope & Closures', 'Kyle Simpson', 'Technology', 'O''Reilly Media', 'A deeper understanding of JavaScript.'),
    ('9781449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Technology', 'O''Reilly Media', 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems.'),
    ('9780134685991', 'Effective Java', 'Joshua Bloch', 'Technology', 'Addison-Wesley Professional', 'Programming Language Guide.'),
    ('9780321125217', 'Domain-Driven Design', 'Eric Evans', 'Technology', 'Addison-Wesley Professional', 'Tackling Complexity in the Heart of Software.'),
    ('9781617294945', 'Spring in Action', 'Craig Walls', 'Technology', 'Manning', 'Spring Framework Guide.'),
    ('9780137081073', 'Clean Coder', 'Robert C. Martin', 'Technology', 'Prentice Hall', 'A Code of Conduct for Professional Programmers.'),
    ('9781492056355', 'Learning React', 'Alex Banks, Eve Porcello', 'Technology', 'O''Reilly Media', 'Modern Patterns for Developing React Apps.')
ON CONFLICT (isbn) DO NOTHING;

-- Insert copies for the new books
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'TS-01', 'AVAILABLE', 'C1-01' FROM books WHERE isbn = '9781491950296' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'PRAG-01', 'AVAILABLE', 'C1-02' FROM books WHERE isbn = '9780135957059' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'DESIGN-01', 'AVAILABLE', 'C1-03' FROM books WHERE isbn = '9780201616224' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'YDKJS-01', 'AVAILABLE', 'C2-01' FROM books WHERE isbn = '9781491904244' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'DDIA-01', 'AVAILABLE', 'C2-02' FROM books WHERE isbn = '9781449373320' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'DDIA-02', 'AVAILABLE', 'C2-02' FROM books WHERE isbn = '9781449373320' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'JAVA-01', 'AVAILABLE', 'C3-01' FROM books WHERE isbn = '9780134685991' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'DDD-01', 'AVAILABLE', 'C3-02' FROM books WHERE isbn = '9780321125217' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'SPRING-02', 'AVAILABLE', 'B2-02' FROM books WHERE isbn = '9781617294945' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'CLEAN-CODER-01', 'AVAILABLE', 'A1-03' FROM books WHERE isbn = '9780137081073' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'REACT-01', 'AVAILABLE', 'D1-01' FROM books WHERE isbn = '9781492056355' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'REACT-02', 'AVAILABLE', 'D1-01' FROM books WHERE isbn = '9781492056355' ON CONFLICT DO NOTHING;

-- Insert some more members
INSERT INTO members (member_code, full_name, email, phone, card_type, card_expiry_date, role)
VALUES
    ('M002', 'Tran Van B', 'tranvanb@example.com', '0912345671', 'STANDARD', CURRENT_DATE + INTERVAL '1 year', 'MEMBER'),
    ('M003', 'Le Thi C', 'lethic@example.com', '0912345672', 'PREMIUM', CURRENT_DATE + INTERVAL '1 year', 'MEMBER'),
    ('M004', 'Pham Van D', 'phamvand@example.com', '0912345673', 'STANDARD', CURRENT_DATE + INTERVAL '1 year', 'MEMBER')
ON CONFLICT (member_code) DO NOTHING;
