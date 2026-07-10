import React, { FormEvent, useState } from 'react';
import { MemberRequest, MemberResponse } from '../../../types/api';
import { useCreateMember, useDeleteMember, useMembers, useUpdateMember } from '../api/useMembers';

const nextYear = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
};

const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

const emptyForm: MemberRequest = {
  memberCode: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  role: 'MEMBER',
  cardType: 'STANDARD',
  cardExpiryDate: nextYear(),
};

const roleColors: Record<string, string> = {
  ADMIN: 'border-red-200 bg-red-50 text-red-700',
  LIBRARIAN: 'border-primary-200 bg-primary-50 text-primary-700',
  MEMBER: 'border-accent-100 bg-accent-50 text-accent-700',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'border-accent-100 bg-accent-50 text-accent-700',
  INACTIVE: 'border-red-200 bg-red-50 text-red-700',
  EXPIRED: 'border-orange-200 bg-orange-50 text-orange-700',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Vô hiệu',
  EXPIRED: 'Hết hạn thẻ',
};

const roleLabels: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  LIBRARIAN: 'Thủ thư',
  MEMBER: 'Thành viên',
};

const MembersPage: React.FC = () => {
  const { data: members = [], isLoading, isError } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const [editingMember, setEditingMember] = useState<MemberResponse | null>(null);
  const [form, setForm] = useState<MemberRequest>(emptyForm);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const startEdit = (member: MemberResponse) => {
    setEditingMember(member);
    setForm({
      memberCode: member.memberCode,
      password: '',
      name: member.name,
      email: member.email,
      phone: member.phone ?? '',
      role: member.role,
      cardType: member.cardType,
      cardExpiryDate: member.cardExpiryDate,
    });
    setShowForm(true);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      memberCode: form.memberCode?.trim(),
      password: form.password?.trim() || undefined,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim(),
    };
    if (editingMember) {
      updateMember.mutate({ id: editingMember.id, payload }, { onSuccess: resetForm });
    } else {
      createMember.mutate(payload, { onSuccess: resetForm });
    }
  };

  const handleExpire = (member: MemberResponse) => {
    updateMember.mutate({
      id: member.id,
      payload: {
        name: member.name, email: member.email, phone: member.phone,
        role: member.role, cardType: member.cardType, cardExpiryDate: yesterday(),
      },
    });
  };

  const handleRenew = (member: MemberResponse) => {
    updateMember.mutate({
      id: member.id,
      payload: {
        name: member.name, email: member.email, phone: member.phone,
        role: member.role, cardType: member.cardType, cardExpiryDate: nextYear(),
      },
    });
  };

  const handleDelete = (member: MemberResponse) => {
    if (!window.confirm(`Xoá thành viên "${member.memberCode}" (${member.name})?\nHành động này không thể hoàn tác.`)) return;
    deleteMember.mutate(member.id);
  };

  const errorMsg = (createMember.error || updateMember.error || deleteMember.error) as any;
  const errorMessage = errorMsg?.response?.data?.message;

  const filteredMembers = members.filter((m) => {
    const kw = searchKeyword.toLowerCase();
    return !kw || m.memberCode.toLowerCase().includes(kw) || m.name.toLowerCase().includes(kw) || m.email.toLowerCase().includes(kw);
  });

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Quản lý tài khoản</p>
            <h2 className="panel-title">Danh sách thành viên</h2>
            <p className="panel-description">Tạo tài khoản, chỉnh sửa vai trò, hạn thẻ và quản lý quyền hạn.</p>
          </div>
          <button
            className="btn-primary shrink-0"
            onClick={() => { setShowForm(true); setEditingMember(null); setForm(emptyForm); }}
          >
            + Thêm thành viên
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input-field pl-9"
            placeholder="Tìm theo mã, họ tên, email..."
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
              <p className="section-kicker">{editingMember ? 'Chỉnh sửa' : 'Tạo mới'}</p>
              <h3 className="panel-title">{editingMember ? `Sửa: ${editingMember.memberCode}` : 'Thêm thành viên mới'}</h3>
            </div>
            <button className="text-ink-400 hover:text-ink-700" onClick={resetForm}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
            <div>
              <label className="form-label"> Mã thành viên</label>
              <input className="input-field" placeholder="Ví dụ: MV001"
                value={form.memberCode}
                onChange={(e) => setForm({ ...form, memberCode: e.target.value })}
                disabled={Boolean(editingMember)} required />
            </div>
            <div>
              <label className="form-label"> Mật khẩu</label>
              <input className="input-field" placeholder={editingMember ? 'Để trống = giữ nguyên' : 'Tối thiểu 6 ký tự'}
                type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingMember} />
            </div>
            <div>
              <label className="form-label"> Họ và tên</label>
              <input className="input-field" placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="form-label"> Email</label>
              <input className="input-field" placeholder="email@example.com"
                type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="form-label"> Số điện thoại</label>
              <input className="input-field" placeholder="09xx xxx xxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label"> Vai trò</label>
              <select className="input-field" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as MemberRequest['role'] })}>
                <option value="MEMBER">Thành viên</option>
                <option value="LIBRARIAN">Thủ thư</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
            <div>
              <label className="form-label"> Loại thẻ</label>
              <select className="input-field" value={form.cardType}
                onChange={(e) => setForm({ ...form, cardType: e.target.value as MemberRequest['cardType'] })}>
                <option value="STANDARD">Thẻ thường</option>
                <option value="PREMIUM">Thẻ cao cấp</option>
              </select>
            </div>
            <div>
              <label className="form-label"> Ngày hết hạn thẻ</label>
              <input className="input-field" type="date" value={form.cardExpiryDate}
                onChange={(e) => setForm({ ...form, cardExpiryDate: e.target.value })} required />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
              <button className="btn-primary" type="submit" disabled={createMember.isPending || updateMember.isPending}>
                {createMember.isPending || updateMember.isPending
                  ? 'Đang lưu...'
                  : editingMember ? ' Cập nhật thành viên' : '+ Tạo thành viên'}
              </button>
              <button className="btn-secondary" type="button" onClick={resetForm}>Huỷ</button>
              {errorMessage && <span className="text-sm font-semibold text-red-600"> {errorMessage}</span>}
            </div>
          </form>
        </section>
      )}

      {/* Bảng thành viên */}
      <section>
        {isLoading ? (
          <div className="state-card">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="text-sm text-ink-500">Đang tải danh sách thành viên...</p>
          </div>
        ) : isError ? (
          <div className="state-card border-red-200 bg-red-50 text-red-700"> Không thể tải danh sách thành viên.</div>
        ) : filteredMembers.length === 0 ? (
          <div className="state-card">
            <div className="state-icon text-xl"></div>
            <h3 className="text-lg font-bold text-ink-900">Không tìm thấy thành viên</h3>
            <p className="mt-1 text-sm text-ink-500">Thử tìm kiếm với từ khoá khác.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã thành viên</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Loại thẻ</th>
                  <th>Hết hạn thẻ</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="font-mono font-bold text-ink-900">{member.memberCode}</td>
                    <td className="font-semibold text-ink-800">{member.name}</td>
                    <td className="text-ink-600">{member.email}</td>
                    <td>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleColors[member.role] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {roleLabels[member.role] ?? member.role}
                      </span>
                    </td>
                    <td className="text-sm text-ink-600">{member.cardType === 'PREMIUM' ? '⭐ Cao cấp' : 'Thường'}</td>
                    <td className="text-sm text-ink-600">
                      {new Date(member.cardExpiryDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusColors[member.status] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {statusLabels[member.status] ?? member.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button
                          className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          type="button" onClick={() => startEdit(member)}
                        >
                           Sửa
                        </button>
                        {member.status === 'ACTIVE' ? (
                          <button
                            className="rounded-lg border border-orange-200 px-2.5 py-1 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                            type="button" onClick={() => handleExpire(member)}
                          >
                            Hết hạn
                          </button>
                        ) : (
                          <button
                            className="rounded-lg border border-accent-100 px-2.5 py-1 text-xs font-semibold text-accent-700 hover:bg-accent-50 transition-colors"
                            type="button" onClick={() => handleRenew(member)}
                          >
                            Gia hạn
                          </button>
                        )}
                        <button
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          type="button" onClick={() => handleDelete(member)}
                        >
                          
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredMembers.length > 0 && (
          <p className="mt-2 text-xs text-ink-400">Hiển thị {filteredMembers.length} / {members.length} thành viên</p>
        )}
      </section>
    </div>
  );
};

export default MembersPage;
