-- Fix existing categories
UPDATE books SET category = 'Khoa học - Kỹ thuật' WHERE category IN ('Technology', 'Lập trình', 'Kiến trúc phần mềm');

-- Add new books for other categories
INSERT INTO books (isbn, title, author, category, publisher, description, cover_url)
VALUES
    ('9786043232323', 'Nhà Giả Kim', 'Paulo Coelho', 'Văn học - Tiểu thuyết', 'NXB Hội Nhà Văn', 'Tiểu thuyết nổi tiếng toàn cầu.', 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg'),
    ('9786043232324', 'Cha Giàu Cha Nghèo', 'Robert Kiyosaki', 'Kinh tế - Quản trị', 'NXB Trẻ', 'Sách về tài chính cá nhân.', 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg'),
    ('9786043232325', 'Đắc Nhân Tâm', 'Dale Carnegie', 'Tâm lý - Kỹ năng sống', 'NXB Tổng hợp TP.HCM', 'Nghệ thuật thu phục lòng người.', 'https://covers.openlibrary.org/b/isbn/9781439190459-L.jpg'),
    ('9786043232326', 'Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 'Thiếu nhi', 'NXB Trẻ', 'Truyện thiếu nhi kỳ ảo.', 'https://covers.openlibrary.org/b/isbn/9780590353403-L.jpg'),
    ('9786043232327', 'Súng, Vi Trùng và Thép', 'Jared Diamond', 'Lịch sử - Xã hội', 'NXB Thế Giới', 'Tóm tắt lịch sử xã hội loài người.', 'https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg')
ON CONFLICT (isbn) DO NOTHING;

-- Insert copies
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'VH-01', 'AVAILABLE', 'E1-01' FROM books WHERE isbn = '9786043232323' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'KT-01', 'AVAILABLE', 'E1-02' FROM books WHERE isbn = '9786043232324' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'TL-01', 'AVAILABLE', 'E1-03' FROM books WHERE isbn = '9786043232325' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'TN-01', 'AVAILABLE', 'E2-01' FROM books WHERE isbn = '9786043232326' ON CONFLICT DO NOTHING;
INSERT INTO book_copies (book_id, copy_code, status, shelf_location)
SELECT id, 'LS-01', 'AVAILABLE', 'E2-02' FROM books WHERE isbn = '9786043232327' ON CONFLICT DO NOTHING;

-- Fix images for ALL books to use OpenLibrary by ISBN (which is reliable and allows cross-origin requests)
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/isbn/' || isbn || '-L.jpg' WHERE isbn NOT IN ('9786043232323', '9786043232324', '9786043232325', '9786043232326', '9786043232327');
