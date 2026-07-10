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
  coverUrl?: string | null;
  availableCopies: number;
}

export interface BookRequest {
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  description?: string;
  coverUrl?: string;
}

export interface BorrowRequest {
  bookId: number;
}

export interface LoanResponse {
  id: number;
  bookCopyId: number;
  bookTitle: string;
  memberCode?: string;
  memberName?: string;
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
  bookId?: number;
  bookTitle: string;
}

export interface BookCopyRequest {
  bookId: number;
  copyCode: string;
  status: 'AVAILABLE' | 'LOANED' | 'RESERVED' | 'LOST';
  shelfLocation?: string;
}

export interface LoginRequest {
  memberCode: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  memberCode: string;
  role: 'MEMBER' | 'LIBRARIAN' | 'ADMIN';
}

export interface MemberResponse {
  id: number;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: 'MEMBER' | 'LIBRARIAN' | 'ADMIN';
  cardType: 'STANDARD' | 'PREMIUM';
  cardExpiryDate: string;
}

export interface MemberRequest {
  memberCode?: string;
  password?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'MEMBER' | 'LIBRARIAN' | 'ADMIN';
  cardType: 'STANDARD' | 'PREMIUM';
  cardExpiryDate: string;
}

export interface ReservationResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  reservationDate: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED' | string;
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
