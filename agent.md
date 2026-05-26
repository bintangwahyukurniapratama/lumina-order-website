# Website Lumina Order - Agent Guidebook

## 1. Workspace & Tech Stack
- **Struktur Folder:**
  - `/css/` untuk file CSS.
  - `/js/` untuk file JavaScript.
  - `/assets/` untuk gambar dan aset lainnya.
- **Teknologi Utama:** 
  - Vanilla HTML5.
  - Tailwind CSS (via CDN).
  - Vanilla JavaScript (ES6+).
- **Sifat Proyek:** Zero-cost, ringan, dan tanpa proses build tambahan.

## 2. Mobile-First Responsiveness
- **Layout Dasar:** Utamakan desain untuk layar HP dengan `grid-cols-1` dan padding cukup besar `px-4`.
- **Breakpoint Desktop:** Gunakan `md:grid-cols-2` dan `lg:grid-cols-3` untuk layar yang lebih besar.
- **Navigasi Kategori (Mobile):** Filter kategori harus horizontal scrollable di HP tanpa menumpuk ke bawah (gunakan `flex flex-nowrap overflow-x-auto`).
- **Aksesibilitas Sentuh:** Area klik tombol minimal `py-3 px-4` agar mudah ditekan di layar sentuh.

## 3. Desain Sistem Neo-Brutalism
- **Garis Tepi Tebal:** `border-[3px] border-black` pada semua kartu, tombol, dan pop-up.
- **Sudut Kaku:** Tidak ada `border-radius` atau `rounded`. Semuanya bersudut tajam 90 derajat.
- **Bayangan Pejal (Solid Shadow):** Gunakan `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` untuk elemen statis. Dilarang menggunakan bayangan blur/halus.
- **Latar Belakang Web:** Off-white dengan pola titik-titik (dot grid-pattern) menggunakan CSS murni (didefinisikan di `style.css`).
- **Tipografi:** Font sans-serif (misal: 'Inter' atau bawaan Tailwind), tebal, dan berukuran besar untuk judul.

## 4. Motion & Mikro-Interaksi
- **Card Hover/Tap (Lift & Shadow Shift):** Saat kursor di atas kartu, aplikasikan `transform -translate-x-1 -translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` dengan transisi `duration-150 ease-out`.
- **Active Press (Tombol Ditekan):** Saat tombol diklik, buat elemen amblas dengan `active:translate-x-1 active:translate-y-1 active:shadow-none`.
- **Card Stack Vibe:** Rotasi acak tipis pada kartu saat dimuat (misal `-rotate-1` atau `rotate-1`).

## 5. Fitur Platform & Dummy Data
- **Data (js/data.js):** JSON berisi data dummy ("Media Interaktif Tata Surya 3D", "E-Flashcard AR-KALA", "Virtual Lab ElectroLab"). Properti: ID, judul, deskripsi, kategori, placeholder thumbnail.
- **Halaman Utama:**
  - Header tebal "Lumina Order".
  - Deskripsi singkat.
  - Tombol filter kategori.
  - Grid Kartu Media.
- **Launcher Modal (Mode Proyektor):**
  - Pop-up Modal besar berdesain Neo-Brutalism.
  - Muncul saat "Buka Media" diklik.
  - Berisi `<iframe>` responsif.
  - Tombol "Full Screen" yang fungsional untuk memperbesar iframe.
  - Placeholder elemen visual "Area QR Code".
