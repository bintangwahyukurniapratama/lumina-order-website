# Website Lumina Order - Agent Guidebook

## 1. Workspace & Tech Stack
- **Struktur Folder:**
  - `/css/` untuk file CSS.
  - `/js/` untuk file JavaScript.
  - `/assets/` untuk gambar, SVG, ikon, dan aset lainnya.
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

## 3. Desain Sistem Refined Neo-Brutalism (Gaya grass.io)
- **Garis Tepi Tebal:** `border-[2px]` atau `border-[3px]` dengan warna hitam (atau warna gelap) pada kartu, tombol, dan elemen pembatas.
- **Sudut Membulat (Rounded):** Gunakan `rounded-xl`, `rounded-2xl`, atau `rounded-3xl` untuk kartu dan kontainer. Gunakan `rounded-full` untuk tombol ikon atau elemen sirkular. Desain ini lebih elegan dibanding sudut 90 derajat yang kaku.
- **Bayangan Pejal (Solid Shadow):** Gunakan shadow solid yang tidak di-blur, misalnya `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` untuk memberikan kedalaman, namun tetap rapi.
- **Palet Warna:** Warna pastel yang cerah namun profesional (hijau pastel, biru muda, kuning cerah, putih, dan abu-abu terang).
- **Ikonografi:** **DILARANG MENGGUNAKAN EMOJI.** Selalu gunakan SVG ikon profesional (seperti Heroicons atau ikon kustom) agar tampilan lebih terpercaya dan rapi. Simpan ikon di folder `assets` jika berupa file terpisah, atau embed SVG secara langsung.
- **Tipografi:** Font sans-serif (misal: 'Inter' atau bawaan Tailwind), bersih, tebal untuk judul, dan berukuran proporsional.

## 4. Motion & Mikro-Interaksi
- **Scroll Reveal (Muncul):** Gunakan animasi fade-in dan transform (translate-y) yang sangat halus dan smooth saat elemen masuk ke dalam layar (scroll).
- **Card Hover/Tap:** Saat hover pada kartu, berikan transisi halus seperti `transform -translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]` dengan `duration-200 ease-out`.
- **Active Press (Tombol Ditekan):** Saat diklik, elemen amblas secara halus dengan efek `active:translate-x-1 active:translate-y-1 active:shadow-none`.
- **Loading Animation:** Gunakan spinner atau animasi rotasi/pulse yang rapih dan tidak terlihat patah-patah/murahan.

## 5. Fitur Platform & Dummy Data
- **Data (js/data.js):** JSON berisi data dummy ("Media Interaktif Tata Surya 3D", "E-Flashcard AR-KALA", "Virtual Lab ElectroLab"). Properti: ID, judul, deskripsi, kategori, placeholder thumbnail.
- **Halaman Utama:**
  - Header tebal "Lumina Order".
  - Deskripsi singkat.
  - Tombol filter kategori dengan SVG Ikon (tanpa emoji).
  - Grid Kartu Media.
- **Launcher Modal (Mode Proyektor):**
  - Pop-up Modal responsif berdesain Refined Neo-Brutalism.
  - Muncul saat "Buka Media" diklik.
  - Berisi `<iframe>` responsif.
  - Tombol fungsional, dan placeholder elemen visual "Area QR Code".
