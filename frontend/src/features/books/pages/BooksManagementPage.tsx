import React, { FormEvent, useMemo, useState } from 'react';
import { useBooks } from '../api/useBooks';
import { useCreateBook, useDeleteBook, useUpdateBook } from '../api/useBookMutations';
import { BookRequest, BookSearchResponse } from '../../../types/api';
import useAuth from '../../../hooks/useAuth';

const emptyForm: BookRequest = {
  isbn: '',
  title: '',
  author: '',
  category: '',
  publisher: '',
  description: '',
  coverUrl: '',
};

const BooksManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<BookRequest>(emptyForm);
  const [editingBook, setEditingBook] = useState<BookSearchResponse | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { data, isLoading, isError } = useBooks({ page: 0, size: 200 });
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  
  const books = useMemo(() => data?.content ?? [], [data]);
  const canDelete = user?.role === 'ADMIN';

  const resetForm = () => {
    setEditingBook(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      isbn: form.isbn.trim(),
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      publisher: form.publisher?.trim(),
      description: form.description?.trim(),
      coverUrl: form.coverUrl?.trim(),
    };

    if (editingBook) {
      updateBook.mutate({ id: editingBook.id, payload }, { onSuccess: resetForm });
    } else {
      createBook.mutate(payload, { onSuccess: resetForm });
    }
  };

  const startEdit = (book: BookSearchResponse) => {
    setEditingBook(book);
    setForm({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      category: book.category,
      publisher: '',
      description: '',
      coverUrl: book.coverUrl ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = (book: BookSearchResponse) => {
    if (!canDelete || !window.confirm(`Xoá sách "${book.title}"?\nHành động này không thể hoàn tác.`)) return;
    deleteBook.mutate(book.id);
  };

  const filteredBooks = books.filter((b) => {
    const kw = searchKeyword.toLowerCase();
    return !kw || b.title.toLowerCase().includes(kw) || b.isbn.toLowerCase().includes(kw) || b.author.toLowerCase().includes(kw);
  });

  const errorMsg = (createBook.error || updateBook.error || deleteBook.error) as any;
  const errorMessage = errorMsg?.response?.data?.message;

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Catalog</p>
            <h2 className="panel-title">Danh mục sách</h2>
            <p className="panel-description">Quản lý thông tin đầu sách dùng cho tra cứu và mượn trả.</p>
          </div>
          <button
            className="btn-primary shrink-0"
            onClick={() => { setShowForm(true); setEditingBook(null); setForm(emptyForm); }}
          >
            + Thêm sách mới
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input-field pl-9"
            placeholder="Tìm theo tên sách, tác giả, ISBN..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </section>

      {/* Form thêm/sửa */}
      {showForm && (
        <section className="panel border-primary-200 bg-primary-50/30">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="section-kicker">{editingBook ? 'Chỉnh sửa' : 'Tạo mới'}</p>
              <h3 className="panel-title">{editingBook ? `Sửa thông tin: ${editingBook.title}` : 'Thêm sách mới vào danh mục'}</h3>
            </div>
            <button className="text-ink-400 hover:text-ink-700" onClick={resetForm}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="grid grid-cols-1 gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="form-label"> Mã ISBN</label>
              <input className="input-field" placeholder="Ví dụ: 9780123456789"
                value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
            </div>
            <div>
              <label className="form-label"> Tên sách</label>
              <input className="input-field" placeholder="Nhập tên sách..."
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="form-label"> Tác giả</label>
              <input className="input-field" placeholder="Nhập tên tác giả..."
                value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </div>
            <div>
              <label className="form-label"> Danh mục</label>
              <input className="input-field" placeholder="Ví dụ: Khoa học viễn tưởng, Kinh tế..."
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div>
              <label className="form-label"> Nhà xuất bản</label>
              <input className="input-field" placeholder="Nhà xuất bản..."
                value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
            </div>
            <div>
              <label className="form-label"> Mô tả ngắn</label>
              <input className="input-field" placeholder="Tóm tắt nội dung sách..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="lg:col-span-2">
              <label className="form-label"> Link ảnh bìa (URL)</label>
              <input className="input-field" placeholder="https://example.com/cover.jpg"
                value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
              <button className="btn-primary" type="submit" disabled={createBook.isPending || updateBook.isPending}>
                {createBook.isPending || updateBook.isPending
                  ? 'Đang lưu...'
                  : editingBook ? ' Cập nhật sách' : '+ Tạo sách'}
              </button>
              <button className="btn-secondary" type="button" onClick={resetForm}>Huỷ</button>
              {errorMessage && <span className="text-sm font-semibold text-red-600"> {errorMessage}</span>}
            </div>
          </form>
        </section>
      )}

      {/* Bảng danh sách */}
      <section>
        {isLoading ? (
          <div className="state-card">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="text-sm text-ink-500">Đang tải danh mục sách...</p>
          </div>
        ) : isError ? (
          <div className="state-card border-red-200 bg-red-50 text-red-700"> Không thể tải danh mục sách.</div>
        ) : filteredBooks.length === 0 ? (
          <div className="state-card">
            <div className="state-icon text-xl"></div>
            <h3 className="text-lg font-bold text-ink-900">Không tìm thấy sách</h3>
            <p className="mt-1 text-sm text-ink-500">Thử tìm kiếm với từ khoá khác.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Ảnh bìa</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Danh mục</th>
                  <th className="text-right">Sẵn sàng</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="font-mono text-xs text-ink-500">{book.isbn}</td>
                    <td>
                      {book.coverUrl ? (
                        <img className="h-14 w-10 rounded border border-border object-cover shadow-sm" src={book.coverUrl} alt={book.title} loading="lazy" />
                      ) : (
                        <div className="flex h-14 w-10 items-center justify-center rounded border border-border bg-slate-50 text-xs text-ink-300">No img</div>
                      )}
                    </td>
                    <td className="font-semibold text-ink-900 line-clamp-2 min-w-[200px]">{book.title}</td>
                    <td className="text-ink-700">{book.author}</td>
                    <td><span className="tag bg-slate-50">{book.category}</span></td>
                    <td className="text-right font-bold text-primary-700">{book.availableCopies}</td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button
                          className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          type="button" onClick={() => startEdit(book)}
                        >
                           Sửa
                        </button>
                        {canDelete && (
                          <button
                            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            type="button" onClick={() => handleDelete(book)}
                          >
                            
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BooksManagementPage;
