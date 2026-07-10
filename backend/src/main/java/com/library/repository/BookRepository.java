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
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :category, '%')) " +
           "ORDER BY b.id DESC")
    List<Book> searchBooksByKeyword(@Param("keyword") String keyword, @Param("category") String category);

    Optional<Book> findByIsbn(String isbn);
}
