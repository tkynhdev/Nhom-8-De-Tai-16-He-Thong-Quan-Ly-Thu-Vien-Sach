package com.library.repository;

import com.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')) AND " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :category, '%')) AND " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :isbn, '%')) " +
           "ORDER BY b.id DESC")
    List<Book> searchBooks(@Param("title") String title,
                           @Param("author") String author,
                           @Param("category") String category,
                           @Param("isbn") String isbn);

    Optional<Book> findByIsbn(String isbn);
}
