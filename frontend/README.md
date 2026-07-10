# Library Frontend

Frontend React cho he thong quan ly thu vien so.

## Cong nghe

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Router v6
- Axios
- React Hook Form
- Recharts

## Cai dat

```powershell
npm install
```

## Cau hinh API

Tao file `.env` neu can doi backend URL:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Neu khong co `.env`, frontend dung mac dinh `http://localhost:8080/api/v1`.

## Chay dev server

```powershell
npm run dev
```

Mo:

```text
http://localhost:5173
```

## Build

```powershell
npm run build
```

## Cac man hinh da co

- `Books`: tim sach, muon sach, dat cho khi het ban sao.
- `My Loans`: lich su muon cua thanh vien.
- `Inventory Management`: danh sach ban sao vat ly tu backend.
- `Returns & Fines`: danh sach sach qua han va tinh phi phat.
- `Reports`: thong ke sach pho bien, thanh vien tich cuc, tien phat.

## Ghi chu

Frontend hien doc token tu `localStorage` voi key:

- `accessToken`
- `refreshToken`

API login backend da co tai `POST /api/v1/auth/login`. Team co the them trang login that su de nhap `memberCode` va luu token vao `localStorage`.
