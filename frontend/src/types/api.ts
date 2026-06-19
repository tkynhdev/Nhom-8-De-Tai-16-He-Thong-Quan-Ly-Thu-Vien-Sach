export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface BookSearchResponse {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
}

export interface BorrowRequest {
  bookId: number;
}

export interface LoanResponse {
  id: number;
  bookCopyId: number;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewalCount: number;
}

export interface BookCopyData {
  id: number;
  copyCode: string;
  status: string;
  shelfLocation?: string | null;
  bookTitle: string;
}
