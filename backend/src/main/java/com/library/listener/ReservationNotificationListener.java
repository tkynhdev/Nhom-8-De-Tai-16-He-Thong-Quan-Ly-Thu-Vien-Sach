package com.library.listener;

import com.library.event.BookReturnedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ReservationNotificationListener {

    @Async
    @EventListener
    public void handleBookReturnedEvent(BookReturnedEvent event) {
        log.info("🔔 [EVENT] BookReturnedEvent triggered! Book ID: {}, Copy ID: {}. Notify next member in reservation queue.",
                 event.getBookId(), event.getBookCopyId());
    }
}
