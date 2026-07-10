ALTER TABLE books ADD COLUMN cover_url VARCHAR(500);

-- Original 3 books
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/91Wc20Q%2BkIL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780132350884';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/51A8l%2B2v1-L._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780134494166';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/81pYqj18k5L._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780201633610';

-- Books added in V4
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/91asbEQkVqL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9781491950296';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/51W1sBPO7tL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780135957059';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/51szD9HC9pL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780201616224';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/71mKvD89OEL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9781491904244';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/91tNtwHPE8L._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9781449373320';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/41zTswCO7bL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780134685991';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/51sZW87slRL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780321125217';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/51gP0hC29-L._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9781617294945';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/5154e-C434L._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9780137081073';
UPDATE books SET cover_url = 'https://m.media-amazon.com/images/I/81mIicn1mOL._AC_UF1000,1000_QL80_.jpg' WHERE isbn = '9781492056355';
