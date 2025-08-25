# Tugas: Halaman Web Profil Diri (Tema Instagram)

Halaman HTML yang menampilkan profil diri dengan tema Instagram. Dibuat menggunakan HTML dan CSS murni, serta sudah responsif.

## Cara Menjalankan

- Buka langsung `index.html` di browser, atau gunakan Live Server (opsional).

## Pemenuhan Kriteria Tugas

1. Struktur HTML benar: menggunakan `<!DOCTYPE html>`, elemen `html`, `head`, dan `body` pada `index.html`.
2. Judul halaman sesuai: terdapat `<title>Instagram Profile - cml6awvx</title>` di bagian `<head>`.
3. Minimal 3 tingkat heading: menggunakan `h1` (logo/nama situs), `h2` (username), `h3` (nama lengkap), serta `h4` (judul bagian dan subjudul bio).
4. Paragraf tentang diri: bio menjelaskan profil singkat, studi, dan kontak pada bagian Bio.
5. Format teks beragam: tebal (span dengan font-weight), miring/italic pada tautan (`.profile-link`), dan variasi tipografi melalui heading.
6. Gambar avatar: foto profil pada `img/profile.JPG` dengan atribut `alt="Profile Image"`.
7. Daftar hobi/keahlian: hobi ditampilkan sebagai list (`ul > li`) berbentuk highlights melingkar dengan label.
8. Tautan eksternal: link menuju GitHub dan kontak email berada di bagian Bio.
9. (Opsional) Style: menggunakan CSS (eksternal) untuk memperindah tampilan (warna, layout, hover, dll.).
10. (Opsional) Komentar: terdapat komentar pada HTML untuk menandai bagian-bagian penting (header, bio, hobi, dsb.).

## Fitur Singkat

- Avatar, username, dan statistik (posts, followers, following)
- Bio singkat beserta kontak dan tautan
- Hobi dalam bentuk "story highlights" (list horizontal)
- Grid postingan 3 kolom dengan efek hover

## Responsivitas

Tampilan web sudah responsif: tata letak menyesuaikan pada perangkat mobile dan desktop (breakpoint utama 768px). Pada mobile, bio tampil penuh di bawah header, tombol aksi muncul di bawah hobi, dan komponen disusun agar mudah dibaca.

## Struktur Proyek

```
myprofile/
├─ index.html       # Markup halaman
├─ style.css        # Style dan layout (termasuk responsive)
└─ img/
   └─ profile.JPG   # Foto profil contoh
```

## Teknologi

- HTML5
- CSS3 (tanpa JavaScript)
- Font Awesome (ikon, via CDN)

Selamat menilai! Jika diperlukan, file dapat dibuka langsung tanpa instalasi tambahan.
