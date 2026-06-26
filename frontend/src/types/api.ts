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
  memberCode?: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewalCount: number;
  overdueDays?: number | null;
  fineAmount?: number | null;
}

export interface BookCopyData {
  id: number;
  copyCode: string;
  status: string;
  shelfLocation?: string | null;
  bookTitle: string;
}

export interface PopularBookResponse {
  title: string;
  borrowCount: number;
}

export interface MemberActivityResponse {
  memberCode: string;
  fullName: string;
  loanCount: number;
}

export interface StatisticsOverviewResponse {
  totalActiveLoans: number;
  totalOverdue: number;
  availableCopies: number;
  monthlyFinesCollected: number;
  popularBooks: PopularBookResponse[];
  topMembers: MemberActivityResponse[];
}
