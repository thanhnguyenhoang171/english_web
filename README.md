https://english-web-gold.vercel.app/
# English web

Ứng dụng, cộng đồng học tiếng Anh (Fullstack NestJS + Vite/React).

---

## Yêu cầu

- Node.js >= 18  
- npm >= 9  
- MongoDB (hoặc dùng MongoDB Atlas như trong `.env.example`)

---

## Cấu trúc dự án

```

ai-english-platform/
├─ backend/        # NestJS backend
├─ frontend/       # Vite + React frontend

```
   -- Mẫu biến môi trường
**Backend:**
backend/.env:
```
PORT=
HOST=localhost
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRATION=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRATION_TIME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET
```
**Frontend:**
frontend/.env.development:
```
NODE_ENV=development
PORT=
VITE_BACKEND_URL=
```
frontend/.env.production:
```
NODE_ENV=production
PORT=
VITE_BACKEND_URL=
```

## ⚡ Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repo-url>
cd ai-english-platform
````

### 2. Cài đặt dependencies

Cài cho cả backend và frontend:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 3. Cấu hình biến môi trường

Sao chép file `.env.example` thành `.env` hoặc `.env.development` / `.env.production` tương ứng:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.development frontend/.env
```

Điền các thông tin:

* `MONGODB_URI` → URL MongoDB
* `JWT_SECRET`, `JWT_REFRESH_SECRET` → Khóa JWT
* Cloudinary API keys nếu dùng upload ảnh

---

### 4. Chạy ứng dụng

#### Chỉ chạy backend

```bash
npm --prefix backend run start:dev
```

#### Chỉ chạy frontend

```bash
npm --prefix frontend run dev
```

#### Chạy đồng thời backend + frontend

```bash
npm run dev
```

Sau đó truy cập frontend tại [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Scripts quan trọng

### Backend (NestJS)

| Script       | Chức năng                |
| ------------ | ------------------------ |
| `start:dev`  | Chạy dev server có watch |
| `start:prod` | Chạy production build    |
| `build`      | Build project            |
| `lint`       | Kiểm tra code style      |
| `test`       | Chạy unit tests          |

### Frontend (Vite)

| Script    | Chức năng        |
| --------- | ---------------- |
| `dev`     | Chạy dev server  |
| `build`   | Build production |
| `preview` | Preview build    |

---

## Note

* Backend chạy mặc định trên `http://localhost:3000`.
* Frontend chạy mặc định trên `http://localhost:5173` và gọi API backend thông qua `VITE_BACKEND_URL`.
* Nếu muốn deploy production, hãy tạo `.env.production` với URL backend thật.

