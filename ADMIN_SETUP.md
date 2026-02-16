# Admin Setup Guide

## Setting Up Admin Access

Untuk memberikan akses admin ke user di aplikasi ini, Anda perlu menambahkan/update data di tabel `profiles` pada Supabase.

### Langkah 1: Login ke aplikasi sebagai user yang ingin dijadikan admin

Login menggunakan metode yang tersedia (Email/Google/GitHub).

### Langkah 2: Dapatkan User ID

Setelah login, buka Console Browser (F12) dan jalankan:

```javascript
// Get current user from Supabase
const { data } = await supabase.auth.getUser();
console.log("User ID:", data.user?.id);
console.log("Email:", data.user?.email);
```

Atau coba akses `/admin` dan lihat error di console yang menampilkan user ID Anda.

### Langkah 3: Update Database via Supabase Dashboard

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **Table Editor** → `profiles`
4. Cari row dengan `id` yang sesuai dengan User ID Anda
   - **Jika row tidak ada:** Insert row baru dengan:
     - `id`: User ID Anda (UUID)
     - `email`: Email Anda
     - `is_admin`: `true` (centang checkbox)
     - Field lain: optional
   - **Jika row sudah ada:** Update field `is_admin` menjadi `true`

### Langkah 4: Refresh Aplikasi

Setelah update database, refresh browser atau logout lalu login kembali. Sekarang Anda bisa akses `/admin`.

## Alternatif: Menggunakan SQL Editor

Anda juga bisa menjalankan SQL berikut di **SQL Editor** Supabase:

```sql
-- Check if profile exists
SELECT * FROM profiles WHERE id = 'YOUR_USER_ID_HERE';

-- Insert new profile with admin access (jika belum ada)
INSERT INTO profiles (id, email, is_admin, created_at)
VALUES (
  'YOUR_USER_ID_HERE',
  'your-email@example.com',
  true,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- OR Update existing profile to make admin
UPDATE profiles
SET is_admin = true
WHERE id = 'YOUR_USER_ID_HERE';
```

## Troubleshooting

### Admin check error: "Row not found"

Artinya user Anda belum memiliki row di tabel `profiles`. Silakan insert row baru seperti dijelaskan di atas.

### Masih tidak bisa akses setelah set is_admin = true

1. Clear browser cache dan cookies
2. Logout dan login kembali
3. Cek console browser untuk error messages
4. Pastikan `is_admin` di database benar-benar `true` (bukan `null` atau `false`)

### Environment Variables

Pastikan file `.env.local` memiliki konfigurasi Supabase yang benar:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
