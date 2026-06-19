package com.library.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class BookReturnedEvent extends ApplicationEvent {

    private final Long bookId;
    private final Long bookCopyId;

    public BookReturnedEvent(Object source, Long bookId, Long bookCopyId) {
        super(source);
        this.bookId = bookId;
        this.bookCopyId = bookCopyId;
    }
}
