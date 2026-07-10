import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type MarketingPageKind = 'home' | 'product' | 'features' | 'management' | 'pricing' | 'about' | 'contact' | 'blog';

// ── Navigation items (dùng trong MarketingShell) ──────────────
const navItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Phần mềm', path: '/phan-mem' },
  { label: 'Tính năng', path: '/tinh-nang' },
  { label: 'Quản lý', path: '/quan-ly' },
  { label: 'Bảng giá', path: '/bang-gia' },
  { label: 'Liên hệ', path: '/lien-he' },
];

const modules = [
  { icon: '', title: 'Quản lý sách', body: 'ISBN, tác giả, danh mục, bản sao vật lý và trạng thái lưu thông đầy đủ.' },
  { icon: '', title: 'Mượn trả nhanh', body: 'Quét mã sách, tạo phiếu mượn, trả sách và in biên nhận tại quầy.' },
  { icon: '', title: 'Thành viên', body: 'Thẻ thư viện, vai trò, hạn thẻ, gia hạn và lịch sử mượn chi tiết.' },
  { icon: '', title: 'Báo cáo', body: 'Sách được mượn nhiều, sách quá hạn, bản sao khả dụng, tiền phạt.' },
  { icon: '', title: 'Tiền phạt', body: 'Cấu hình số ngày mượn, phí trễ hạn và số lần gia hạn linh hoạt.' },
  { icon: '', title: 'Phân quyền', body: 'MEMBER, LIBRARIAN, ADMIN — tách luồng thao tác rõ ràng, bảo mật.' },
];

const plans = [
  { name: 'Cơ bản', fit: 'Thư viện nhỏ', body: 'Quản lý sách, thành viên, mượn trả cơ bản.', highlight: false },
  { name: 'Chuyên nghiệp', fit: 'Thư viện trường học', body: 'Barcode, báo cáo, tiền phạt, phân quyền đầy đủ.', highlight: true },
  { name: 'Doanh nghiệp', fit: 'Hệ thống nhiều chi nhánh', body: 'Tuỳ biến quy trình, backup, hỗ trợ triển khai riêng.', highlight: false },
];

const articles = [
  { title: 'Số hoá thư viện bắt đầu từ đâu?', body: 'Chuẩn hoá mã sách, bản sao vật lý và quy trình mượn trả.', tag: 'Hướng dẫn' },
  { title: 'Vì sao barcode làm thư viện nhanh hơn?', body: 'Giảm nhập tay, giảm sai số, tăng tốc độ xử lý tại quầy.', tag: 'Kỹ thuật' },
  { title: 'Báo cáo nào cần cho quản lý thư viện?', body: 'Tồn kho, mượn trả, quá hạn, thành viên và nhu cầu sách.', tag: 'Quản lý' },
];

// ── Marketing Shell (có header/footer riêng cho marketing pages) ──
const MarketingShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-canvas text-ink-800">
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span>
            <span className="block text-lg font-bold leading-tight text-ink-900">LibSys</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-ink-400">Thư viện số</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link to="/login" className="btn-primary">
          Mở ứng dụng
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-ink-600 hover:bg-primary-50">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>

    {children}

    <footer className="border-t border-border bg-ink-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-white">LibSys</span>
          </div>
          <p className="text-sm text-slate-400">Phần mềm quản lý thư viện cho trường học, thư viện cộng đồng và đơn vị đào tạo.</p>
        </div>
        <div className="text-sm text-slate-400">
          <p className="mb-2 font-semibold text-white">Tài khoản demo</p>
          <p>admin / admin123</p>
          <p>member / member123</p>
        </div>
        <div className="text-sm text-slate-400">
          <p className="mb-2 font-semibold text-white">Liên hệ</p>
          <p> sales@libsys.local</p>
          <p> 1800-LIBSYS</p>
          <p>⏰ T2–T7: 7:30 – 17:30</p>
        </div>
      </div>
      <div className="border-t border-slate-700 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © 2025 LibSys — Hệ thống Quản lý Thư viện Sách
      </div>
    </footer>
  </div>
);

// ── Product Preview Component ──────────────────────────────────
const ProductPreview = () => (
  <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur">
    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
      <div>
        <p className="section-kicker">LibSys dashboard</p>
        <h3 className="text-lg font-bold text-ink-900">Bàn lưu thông</h3>
      </div>
      <span className="tag">QUẢN TRỊ</span>
    </div>
    <div className="grid gap-3 md:grid-cols-4">
      {[['Đang mượn', 128], ['Quá hạn', 6], ['Còn bản', 840], ['Tiền phạt', '2.4M']].map(([label, val]) => (
        <div key={String(label)} className="rounded-xl border border-border bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink-900">{val}</p>
        </div>
      ))}
    </div>
    <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-xl border border-border bg-white p-4">
        <p className="mb-3 font-semibold text-ink-900">Mượn sách bằng mã</p>
        <div className="space-y-2">
          <div className="h-9 rounded-lg bg-slate-100" />
          <div className="h-9 rounded-lg bg-slate-100" />
          <div className="h-10 w-28 rounded-lg bg-primary-600" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <p className="mb-3 font-semibold text-ink-900">Sách mượn nhiều</p>
        {[72, 58, 44, 32].map((width) => (
          <div key={width} className="mb-3 h-5 rounded-full bg-primary-200" style={{ width: `${width}%` }}>
            <div className="h-5 rounded-full bg-primary-600" style={{ width: `${width}%` }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Section wrapper ────────────────────────────────────────────
const Section = ({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) => (
  <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
    <p className="section-kicker">{kicker}</p>
    <h2 className="mt-2 max-w-3xl text-3xl font-bold text-ink-900 sm:text-4xl">{title}</h2>
    <div className="mt-8">{children}</div>
  </section>
);

// ── Trang chủ marketing ────────────────────────────────────────
const MarketingHomePage = () => (
  <>
    <section className="overflow-hidden bg-ink-900 text-white">
      <div className="mx-auto grid min-h-[680px] max-w-7xl content-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent-100">Phần mềm quản lý thư viện</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Số hoá thư viện, mượn trả nhanh, báo cáo rõ.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            LibSys gồm catalog, barcode, thành viên, tiền phạt và báo cáo — tất cả trong một hệ thống gọn để thư viện vận hành như một sản phẩm thật.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">Dùng thử demo</Link>
            <Link to="/phan-mem" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">Xem phần mềm</Link>
          </div>
        </div>
        <ProductPreview />
      </div>
    </section>
    <Section kicker="Vấn đề" title="Thư viện không thiếu sách — thư viện thiếu hệ thống vận hành gọn.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          'Sổ sách bằng Excel dễ sai số liệu và khó tìm lại lịch sử.',
          'Mượn trả thủ công làm chậm quầy thư viện vào giờ cao điểm.',
          'Không biết sách nào còn bản sao, sách nào đang quá hạn.',
          'Báo cáo vận hành phải tổng hợp tay mỗi cuối tháng.',
        ].map((pain) => (
          <div key={pain} className="panel border-l-4 border-l-red-300">
            <p className="text-sm leading-6 text-ink-600">{pain}</p>
          </div>
        ))}
      </div>
    </Section>
    <Section kicker="Module" title="Đủ các phần để bàn giao như một sản phẩm SaaS.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <article key={mod.title} className="panel transition-all hover:border-primary-200 hover:shadow-md">
            <div className="mb-3 text-2xl">{mod.icon}</div>
            <h3 className="font-bold text-ink-900">{mod.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-500">{mod.body}</p>
          </article>
        ))}
      </div>
    </Section>
    <Section kicker="Demo" title="Muốn xem dashboard thật? Mở demo và đăng nhập bằng tài khoản seed.">
      <Link to="/login" className="btn-primary">Mở ứng dụng →</Link>
    </Section>
  </>
);

// ── Phần mềm ──────────────────────────────────────────────────
const ProductPage = () => (
  <Section kicker="Phần mềm" title="LibSys gồm thư viện số và dashboard vận hành trong cùng một frontend.">
    <div className="grid gap-6 lg:grid-cols-2">
      <ProductPreview />
      <div className="space-y-4">
        {modules.slice(0, 4).map((mod) => (
          <div key={mod.title} className="panel flex items-start gap-4">
            <span className="text-2xl">{mod.icon}</span>
            <div>
              <h3 className="font-bold text-ink-900">{mod.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{mod.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ── Tính năng ─────────────────────────────────────────────────
const FeaturesPage = () => (
  <Section kicker="Tính năng" title="Tính năng chia theo nghiệp vụ thư viện, không phải theo menu kỹ thuật.">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((mod) => (
        <article key={mod.title} className="panel transition-all hover:border-primary-200 hover:shadow-md">
          <div className="mb-3 text-2xl">{mod.icon}</div>
          <h3 className="font-bold text-ink-900">{mod.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-500">{mod.body}</p>
        </article>
      ))}
    </div>
  </Section>
);

// ── Quản lý ───────────────────────────────────────────────────
const ManagementPage = () => (
  <Section kicker="Quản lý" title="Ba vai trò, ba trải nghiệm riêng: MEMBER, LIBRARIAN, ADMIN.">
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        { role: 'MEMBER', icon: '', body: 'Tìm sách, mượn sách, đặt chỗ và xem lịch sử mượn trực tuyến.' },
        { role: 'LIBRARIAN', icon: '', body: 'Quản lý catalog, bản sao, barcode, mượn trả và biên nhận tại quầy.' },
        { role: 'ADMIN', icon: '', body: 'Quản lý thành viên, cấu hình tiền phạt, báo cáo và xuất CSV.' },
      ].map(({ role, icon, body }) => (
        <article key={role} className="panel">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <span className="tag text-sm">{role}</span>
          </div>
          <p className="text-sm leading-6 text-ink-600">{body}</p>
        </article>
      ))}
    </div>
  </Section>
);

// ── Bảng giá ──────────────────────────────────────────────────
const PricingPage = () => (
  <Section kicker="Bảng giá" title="Gói giá đơn giản để bạn demo trước, tuỳ biến sau.">
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className={`panel flex flex-col ${plan.highlight ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-200' : ''}`}>
          {plan.highlight && <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600"> Phổ biến nhất</p>}
          <h3 className="text-2xl font-bold text-ink-900">{plan.name}</h3>
          <p className="mt-1 text-sm font-semibold text-primary-700">{plan.fit}</p>
          <p className="mt-4 flex-1 text-sm leading-6 text-ink-500">{plan.body}</p>
          <Link to="/lien-he" className={`mt-6 ${plan.highlight ? 'btn-primary' : 'btn-secondary'} text-center`}>Nhận tư vấn</Link>
        </article>
      ))}
    </div>
  </Section>
);

// ── Giới thiệu ────────────────────────────────────────────────
const AboutPage = () => (
  <div className="page-stack mx-auto max-w-7xl px-4 py-14 sm:px-6">
    {/* Hero section giới thiệu */}
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 40%, #172554 100%)', minHeight: 280 }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white opacity-5" />
      <div className="pointer-events-none absolute -bottom-12 left-12 h-40 w-40 rounded-full bg-white opacity-5" />
      <div className="relative px-8 py-12 sm:px-16">
        <p className="mb-3 inline-block rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-200">
          Về chúng tôi
        </p>
        <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
          LibSys — Thư viện số<br />
          <span className="text-blue-300">dành cho vận hành thật</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
          Chúng tôi xây dựng LibSys cho thư viện cần vận hành hiệu quả mỗi ngày — không chỉ cần giao diện đẹp.
        </p>
      </div>
    </section>

    {/* Nội dung giới thiệu */}
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="panel">
        <p className="section-kicker">Sứ mệnh</p>
        <h2 className="panel-title">Chúng tôi là ai?</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-ink-600">
          <p>
            <strong className="text-ink-800">LibSys</strong> là hệ thống quản lý thư viện số được xây dựng dành riêng cho thư viện trường học, trung tâm đào tạo, thư viện nội bộ và thư viện cộng đồng tại Việt Nam.
          </p>
          <p>
            Mục tiêu của chúng tôi là <strong className="text-ink-800">cắt bỏ các thao tác lặp lại</strong>, giữ dữ liệu sạch sẽ và cho quản lý thấy được tình hình vận hành mỗi ngày mà không cần tổng hợp thủ công.
          </p>
          <p>
            LibSys phù hợp từ thư viện nhỏ vài trăm đầu sách đến hệ thống nhiều chi nhánh với hàng chục nghìn bản sao.
          </p>
        </div>
      </section>

      <section className="panel">
        <p className="section-kicker">Điểm nổi bật</p>
        <h2 className="panel-title">Tại sao chọn LibSys?</h2>
        <ul className="mt-4 space-y-3">
          {[
            { icon: '', text: 'Triển khai nhanh — không cần cài đặt phức tạp' },
            { icon: '', text: 'Bảo mật phân quyền theo 3 vai trò rõ ràng' },
            { icon: '', text: 'Báo cáo tức thì, không cần tổng hợp tay' },
            { icon: '', text: 'Mượn trả trực tuyến 24/7 qua trình duyệt' },
            { icon: '', text: 'Tự động tính phí phạt theo ngày quá hạn' },
            { icon: '', text: 'Cập nhật liên tục theo phản hồi người dùng' },
          ].map(({ icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm text-ink-700">
              <span className="shrink-0 text-lg">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </section>
    </div>

    {/* Stats */}
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { value: '10.000+', label: 'Đầu sách quản lý' },
        { value: '500+', label: 'Thành viên' },
        { value: '99.9%', label: 'Uptime hệ thống' },
        { value: '24/7', label: 'Hỗ trợ trực tuyến' },
      ].map((stat) => (
        <div key={stat.label} className="panel text-center">
          <p className="text-2xl font-black text-primary-600">{stat.value}</p>
          <p className="mt-1 text-xs font-semibold text-ink-500">{stat.label}</p>
        </div>
      ))}
    </section>

    {/* CTA */}
    <section className="rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-blue-50 p-8 text-center">
      <h2 className="text-2xl font-black text-ink-900">Muốn trải nghiệm LibSys?</h2>
      <p className="mt-2 text-sm text-ink-500">Mở ứng dụng demo và đăng nhập bằng tài khoản có sẵn.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link to="/login" className="btn-primary px-6">Mở ứng dụng demo</Link>
        <Link to="/lien-he" className="btn-secondary px-6">Liên hệ tư vấn</Link>
      </div>
    </section>
  </div>
);

// ── Liên hệ ───────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <p className="section-kicker">Hỗ trợ</p>
        <h1 className="mt-2 text-3xl font-black text-ink-900 sm:text-4xl">Liên hệ với chúng tôi</h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-ink-500">
          Có câu hỏi về LibSys? Điền form bên dưới hoặc liên hệ trực tiếp — chúng tôi phản hồi trong vòng 24 giờ.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form liên hệ */}
        <div className="panel">
          <p className="section-kicker">Gửi tin nhắn</p>
          <h2 className="panel-title">Đặt lịch demo hoặc hỏi đáp</h2>

          {sent ? (
            <div className="mt-6 rounded-xl border border-accent-100 bg-accent-50 p-6 text-center">
              <div className="mb-3 text-4xl"></div>
              <h3 className="text-lg font-bold text-accent-700">Đã gửi thành công!</h3>
              <p className="mt-2 text-sm text-accent-600">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
              <button onClick={() => setSent(false)} className="btn-secondary mt-4 text-sm">Gửi tin nhắn khác</button>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="contact-name"> Họ và tên</label>
                  <input id="contact-name" name="name" className="input-field" placeholder="Nguyễn Văn A" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label" htmlFor="contact-email"> Email</label>
                  <input id="contact-email" name="email" type="email" className="input-field" placeholder="email@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="contact-org"> Đơn vị / Tổ chức</label>
                <input id="contact-org" name="org" className="input-field" placeholder="Tên trường hoặc thư viện" value={form.org} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label" htmlFor="contact-message"> Nội dung</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Nhu cầu quản lý thư viện, số lượng sách, câu hỏi..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="btn-primary w-full py-3 text-base font-bold" type="submit">
                Gửi yêu cầu →
              </button>
            </form>
          )}
        </div>

        {/* Thông tin liên hệ */}
        <div className="flex flex-col gap-4">
          <div className="panel">
            <h3 className="mb-4 font-bold text-ink-900"> Thông tin liên hệ</h3>
            <div className="space-y-3 text-sm text-ink-600">
              {[
                { icon: '', label: 'Email hỗ trợ', value: 'support@libsys.local' },
                { icon: '', label: 'Hotline', value: '1800-LIBSYS' },
                { icon: '⏰', label: 'Giờ làm việc', value: 'T2–T7: 7:30 – 17:30' },
                { icon: '', label: 'Địa chỉ', value: 'Khu Công nghệ cao, TP. HCM' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="shrink-0 text-lg">{icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</p>
                    <p className="mt-0.5 font-semibold text-ink-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── Blog ──────────────────────────────────────────────────────
const BlogPage = () => (
  <Section kicker="Kiến thức" title="Nội dung về quản lý thư viện hiện đại.">
    <div className="grid gap-4 md:grid-cols-3">
      {articles.map((article) => (
        <article key={article.title} className="panel transition-all hover:border-primary-200 hover:shadow-md">
          <span className="tag mb-3 inline-block">{article.tag}</span>
          <h3 className="font-bold text-ink-900">{article.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-500">{article.body}</p>
          <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
            Đọc tiếp →
          </a>
        </article>
      ))}
    </div>
  </Section>
);

// ── Page map ──────────────────────────────────────────────────
const pageByKind: Record<MarketingPageKind, React.ReactNode> = {
  home: <MarketingHomePage />,
  product: <ProductPage />,
  features: <FeaturesPage />,
  management: <ManagementPage />,
  pricing: <PricingPage />,
  about: <AboutPage />,
  contact: <ContactPage />,
  blog: <BlogPage />,
};

export const MarketingPage = ({ kind = 'home' }: { kind?: MarketingPageKind }) => (
  <MarketingShell>{pageByKind[kind]}</MarketingShell>
);

export { AboutPage, ContactPage };
export default MarketingPage;
