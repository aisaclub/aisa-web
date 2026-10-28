# AISA UiTM Melaka (Kampus Jasin) - Official Web Portal

Laman web rasmi **Artificial Intelligence Student Association (AISA)**, persatuan di bawah naungan Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM / FSKM), UiTM Cawangan Melaka Kampus Jasin.

Dibina dengan reka bentuk futuristik AI, interaktif 3D Three.js, mini-game latihan model AI, carta organisasi berhierarki (Tree Chart), pengurusan hebahan & arkib aktiviti, serta bersedia untuk dihoskan secara percuma di **Cloudflare Pages**.

---

## 🌟 Ciri-Ciri Utama

1. **3D Interactive Hologram Neural Core (Three.js)**:
   - Visual model AI 3D berputar yang bertindak balas dengan pergerakan tetikus dan klik (shockwave pulse).
2. **Playable Mini-Game: "Neuro-Dash: Epoch Rush"**:
   - Game arked 60fps berasaskan HTML5 Canvas & Web Audio Synthesizer terus di dalam browser.
   - Kawal drone AI mengutip data & kluster GPU, mengelak ralat bug, dan bersaing untuk high score!
3. **15-Second Cinematic Teaser Reel**:
   - Showcase pengenalan persatuan beranimasi dengan meter masa, beat equalizer dan sorotan pencapaian kelab.
4. **Carta Organisasi Interaktif (Tree Chart & Grid View)**:
   - Salasilah berhierarki: Penasihat Pensyarah -> Majlis Tertinggi (YDP, TYDP, SU, Bendahari) -> Ketua Biro -> Barisan Exco.
   - Kad interaktif dengan modal profil lengkap, bidang minat AI, pautan LinkedIn & GitHub.
5. **Hebahan & Pertandingan (Live Bulletin)**:
   - Tapis mengikut kategori (Pertandingan, Bengkel, Hebahan, Notis).
   - Kiraan tarikh tutup pendaftaran dan pautan terus ke Google Form pendaftaran.
6. **Arkib Aktiviti Lepas & Galeri Foto**:
   - Sorotan hackathon dan lawatan industri dengan fungsi *lightbox viewer* gambar resolusi tinggi.
7. **Portal Kemas Kini Exco & Admin (Self-Service CMS)**:
   - Log masuk Exco (Kod laluan demo: `aisa2026`).
   - Tukar gambar, nama, jawatan dan maklumat profil Exco bila-bila masa — carta organisasi akan dikemas kini secara masa nyata!
   - Tambah hebahan baru dan aktiviti lepas dengan mudah.
   - Dilengkapi skrip SQL sedia ada untuk disalin ke **Cloudflare D1**.

---

## 🚀 Cara Menjalankan Projek di Komputer Sendiri (Localhost)

1. Buka folder projek di terminal / command prompt:
   ```bash
   cd C:\Users\ammar\.gemini\antigravity\scratch\aisa-uitm-web
   ```

2. Jalankan arahan pembangunan:
   ```bash
   npm run dev
   ```

3. Buka pelayar web di `http://localhost:3000`.

---

## ☁️ Cara Deploy ke Cloudflare Pages (100% Percuma)

### Kaedah A: Menggunakan GitHub (Paling Mudah & Disyorkan)
1. Cipta repositori baru di akaun GitHub persatuan anda (cth: `aisa-uitm-portal`).
2. Muat naik (push) kod ini ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for AISA UiTM Jasin portal"
   git remote add origin https://github.com/<organisasi-anda>/aisa-uitm-portal.git
   git push -u origin main
   ```
3. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4. Tetapkan konfigurasi binaan:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Klik **Save and Deploy**. Laman web anda akan bersiaran secara langsung dalam masa kurang 1 minit dengan pautan seperti `https://aisa-uitm.pages.dev`!

### Kaedah B: Menggunakan Wrangler CLI
```bash
npx wrangler pages deploy dist --project-name=aisa-uitm-web
```

---

## 🗄️ Menghubungkan ke Cloudflare D1 (Pangkalan Data Edge)
Jika anda mahu data disimpan di pelayan Cloudflare dan bukan sekadar di browser:
1. Cipta D1 database di Cloudflare:
   ```bash
   npx wrangler d1 create aisa-db
   ```
2. Salin `database_id` yang terhasil ke dalam fail `wrangler.toml`.
3. Jalankan skema jadual:
   ```bash
   npx wrangler d1 execute aisa-db --file=./schema.sql
   ```

---

Dikeluarkan untuk **Artificial Intelligence Student Association (AISA)**, UiTM Melaka Kampus Jasin.
