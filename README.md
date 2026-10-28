<div align="center">

```
   █████╗ ██╗███████╗ █████╗     ██╗   ██╗██╗████████╗███╗   ███╗
  ██╔══██╗██║██╔════╝██╔══██╗    ██║   ██║██║╚══██╔══╝████╗ ████║
  ███████║██║███████╗███████║    ██║   ██║██║   ██║   ██╔████╔██║
  ██╔══██║██║╚════██║██╔══██║    ██║   ██║██║   ██║   ██║╚██╔╝██║
  ██║  ██║██║███████║██║  ██║    ╚██████╔╝██║   ██║   ██║ ╚═╝ ██║
  ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚═╝   ╚═╝   ╚═╝     ╚═╝
   ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION • UITM MELAKA
```

# 🏛️ AISA Official Web Portal & Edge Ecosystem
### Kolej Pengajian Pengkomputeran, Informatik dan Matematik (KPPIM) • Kampus Jasin

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Database-Cloudflare%20D1%20SQLite-F38020?style=for-the-badge&logo=sqlite&logoColor=white)](https://developers.cloudflare.com/d1/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![UiTM Melaka](https://img.shields.io/badge/Affiliation-UiTM%20Jasin%20KPPIM-4B0082?style=for-the-badge)](https://melaka.uitm.edu.my/)

[🌐 Demo Langsung](#-cara-deploy-ke-cloudflare-pages-100-percuma) • [📑 Carta Organisasi](#-carta-organisasi--pensyarah-penasihat) • [📧 Email Studio Exco](#-exco-email-campaign-studio--multi-design-templates) • [🗄️ Cloudflare D1 Setup](#-integrasi-cloudflare-d1-serverless-database) • [🚀 Git Push Guide](#-arahan-push-ke-github-aisaclubaisa-web)

---

</div>

## 📌 Ringkasan Eksekutif Projek

Portal Web Rasmi **AISA (Artificial Intelligence Student Association)** UiTM Melaka Kampus Jasin dibangunkan khusus untuk menyatukan ekosistem mahasiswa AI, barisan pensyarah penasihat KPPIM, serta menyediakan sistem pengurusan persatuan secara bersepadu tanpa bergantung kepada borang pihak ketiga (*zero external Google Forms*).

Sistem ini dioptimumkan untuk hos percuma berkelajuan tinggi di **Cloudflare Pages** dengan pangkalan data relasi teragih **Cloudflare D1 (Serverless SQLite)**.

---

## 🏗️ Seni Bina Sistem (Architecture Overview)

```
                           +------------------------------------------------+
                           |          PENGGUNA / PELAWAT / MAHASISWA        |
                           +------------------------------------------------+
                                                  |
                                                  v
                   +---------------------------------------------------------------+
                   |           CLOUDFLARE PAGES EDGE RUNTIME (Global CDN)          |
                   |                                                               |
                   |  +---------------------------------------------------------+  |
                   |  |           Vite + React 19 + Tailwind CSS v4             |  |
                   |  |  • 3D Geodesic Neural Mesh (Three.js WebGL)             |  |
                   |  |  • Mini-Game 60fps "Neuro-Dash" (Canvas + Web Audio)    |  |
                   |  |  • Carta Organisasi Hierarki (Penasihat -> MT -> Exco)  |  |
                   |  |  • Pendaftaran Ahli Native (Auto Member ID Generator)  |  |
                   |  |  • Langganan Notis Hebahan & Buletin Pintar             |  |
                   |  |  • Exco Command Console & Live Multi-Template Email     |  |
                   |  +---------------------------------------------------------+  |
                   +---------------------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
           [POST /api/register]                              [POST /api/subscribe]
           [POST /api/broadcast]                             [GET /api/announcements]
                         |                                                 |
                         +------------------------+------------------------+
                                                  |
                                                  v
                   +---------------------------------------------------------------+
                   |            CLOUDFLARE PAGES FUNCTIONS (/functions/api)        |
                   |  • Auth & Request Validation                                  |
                   |  • SQL Query Binding via env.DB                               |
                   |  • Auto Email Notification Logger                             |
                   +---------------------------------------------------------------+
                                                  |
                                                  v
                   +---------------------------------------------------------------+
                   |             CLOUDFLARE D1 (Serverless SQLite DB)              |
                   |                                                               |
                   |  [TABLES]                                                     |
                   |  ├── subscribers       (Emel, Topik Pilihan, Status)          |
                   |  ├── registrations     (Nama, No Pelajar, Program, ID Ahli)   |
                   |  ├── email_logs        (Rekod Emel Dihantar, Template, Status)|
                   |  ├── lecturer_advisors (Bilik, Waktu Konsultasi, Niche AI)    |
                   |  ├── committee_members (YDP, Exco, Gambar, LinkedIn, GitHub)  |
                   |  ├── announcements     (Notis, Pertandingan, Countdown)       |
                   |  └── activities        (Hackathon, Arkib Gambar, Lightbox)    |
                   +---------------------------------------------------------------+
```

---

## 🌟 Ciri-Ciri Utama & Pengalaman Pengguna (UX/UI)

### 1. 🌐 Public Experience Berprestij
* **Geodesic Neural Hologram (Three.js)**: Elemen 3D sfera neural yang elegan dan tenang di bahagian Hero dengan tindak balas tetikus dan sentuhan (bukan sci-fi neon berlebihan, sebaliknya bertemakan *academic executive slate* `#0b0f19`).
* **15-Second Cinematic Teaser Reel**: Modal sorotan persatuan beranimasi dengan meter masa, beat visualizer dan pencapaian kelab.
* **Mini-Game Interaktif "Neuro-Dash: Epoch Rush"**: Game arked 60fps berasaskan HTML5 Canvas dengan efek bunyi Web Audio API Synthesizer tanpa fail audio luaran!

### 2. 🌳 Carta Organisasi Hierarki & Barisan Pensyarah Penasihat
* **Mod Dwi-Paparan**: Pilihan antara **Salasilah Pokok (Hierarchical Tree View)** dan **Grid Eksekutif**.
* **Integrasi Pensyarah Penasihat KPPIM**: Memaparkan bilik pensyarah, waktu konsultasi, bidang kepakaran AI, dan emel rasmi UiTM.
* **Kad Profil Interaktif**: Memaparkan butiran biro, projek GitHub, akaun LinkedIn, dan kepakaran khusus setiap Exco.

### 3. 📝 Pendaftaran Ahli Native (Terbuka Kepada Semua Kursus FSKM & FPA)
* **Terbuka Tanpa Diskriminasi**: Terbuka kepada seluruh pelajar UiTM Melaka Kampus Jasin merangkumi:
  * **FSKM / KPPIM (Sarjana Muda)**:
    * `CS230` – Bachelor of Computer Science (Hons.) / Sarjana Muda Sains Komputer (Kepujian)
    * `CS251` – Bachelor of Computer Science (Hons.) Computer Networks / Data Communication and Networking
    * `CS255` – Bachelor of Computer Science (Hons.) Computer Networks
    * `CS266` – Bachelor of Information Technology (Hons.) Information Systems Engineering
  * **FSKM / KPPIM (Diploma)**:
    * `CS110` – Diploma in Computer Science (Diploma Sains Komputer)
  * **Fakulti Perladangan & Agroteknologi - FPA (Sarjana Muda)**:
    * `AT228` – Bachelor of Technology Smart Crop Production with Honours
    * `AT234` – Bachelor of Science in Horticulture Technology (Honours)
    * `AT240` – Bachelor in Plantation Management Technology with Honours
    * `AT242` – Bachelor of Science in Agronomy with Honours
    * `AT243` – Bachelor of Science in Agribusiness (Honours)
  * **Fakulti Perladangan & Agroteknologi - FPA (Diploma)**:
    * `AT110` – Diploma in Plantation Industry Management
  * **Program Terbuka**: Pelajar daripada mana-mana fakulti lain di UiTM Cawangan Melaka.
* **100% Borang Native (Bukan Google Form)**: Data dimasukkan terus ke Cloudflare D1.
* **Auto-Generated Digital Membership ID**: Menjana ID unik (cth: `AISA-2026-8492`) dan kad keahlian digital.
* **Peti Langganan Notis Sahaja (Bukan Ahli)**: Membolehkan pelajar luar dan komuniti kampus melanggan hebahan pertandingan dan bengkel secara spesifik. Setiap langganan merekodkan status penerimaan ke `email_logs`.

### 4. ✉️ Exco Email Campaign Studio (3 Reka Bentuk Berbeza)
Exco boleh menghantar notis mesyuarat atau hebahan dengan memilih 3 reka bentuk emel tersuai:
1. **UiTM Royal Official Memo**: Reka bentuk rasmi surat pekeliling universiti lengkap dengan nombor rujukan, tandatangan YDP, dan kod etika KPPIM.
2. **Tech Summit Modern Card**: Kad bergradien moden dengan kiraan masa, lencana topik AI, dan butang RSVP kalendar satu klik.
3. **Minimalist Urgent Alert**: Format pekeliling ringkas berlatar belakang gelap untuk mesyuarat tergempar dan pembatalan kelas/bengkel.

---

## 🗄️ Integrasi Cloudflare D1 (Serverless Database)

Portal ini menggunakan **Cloudflare D1** ([Dokumentasi Rasmi D1](https://developers.cloudflare.com/d1/)) untuk menyimpan semua data relasi secara global di edge.

### Fail Konfigurasi & Migrasi:
* [`wrangler.toml`](file:///./wrangler.toml) - Pengikatan binding pangkalan data `DB`.
* [`migrations/0001_initial_schema.sql`](file:///./migrations/0001_initial_schema.sql) - Skema 7 jadual relasi lengkap berserta index & triggers.
* [`migrations/0002_seed_data.sql`](file:///./migrations/0002_seed_data.sql) - Data awal pensyarah, exco, hebahan, dan aktiviti.
* [`functions/api/`](file:///./functions/api/) - Endpoint serverless Pages Functions (`register.ts`, `subscribe.ts`, `broadcast.ts`).

### Panduan Setup D1 Menggunakan Wrangler CLI:

```bash
# 1. Log masuk ke akaun Cloudflare anda
npx wrangler login

# 2. Cipta pangkalan data D1 bernama 'aisa-db'
npx wrangler d1 create aisa-db
```

Output terminal akan memberikan `database_id`. Masukkan ID tersebut ke dalam fail `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "aisa-db"
database_id = "MASUKKAN-DATABASE-ID-ANDA-DI-SINI"
migrations_dir = "migrations"
```

Jalankan migrasi skema dan data awal:

```bash
# Untuk pengujian setempat (Local testing):
npx wrangler d1 migrations apply aisa-db --local

# Untuk pelaksanaan di Cloudflare Edge sebenar (Production):
npx wrangler d1 migrations apply aisa-db --remote
```

---

## 🚀 Panduan Membangunkan & Menguji Setempat (Local Development)

```bash
# 1. Clone repositori
git clone https://github.com/aisaclub/aisa-web.git
cd aisa-web

# 2. Pasang kebergantungan (Dependencies)
npm install

# 3. Jalankan server pembangunan Vite
npm run dev

# 4. Akses melalui browser di http://localhost:3000
```

Untuk menguji Pages Functions bersama Cloudflare D1 secara lokal:
```bash
npx wrangler pages dev dist --d1=DB=aisa-db
```

---

## ☁️ Cara Deploy ke Cloudflare Pages (100% Percuma)

### Langkah Demi Langkah di Cloudflare Dashboard:
1. Log masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigasi ke **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
3. Pilih repositori `aisaclub/aisa-web`.
4. Masukkan tetapan konfigurasi berikut:
   * **Project Name**: `aisa-web`
   * **Framework preset**: `Vite`
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
5. Di bahagian **Settings** > **Functions** > **D1 database bindings**:
   * **Variable name**: `DB`
   * **D1 database**: Pilih `aisa-db`
6. Tekan **Save and Deploy**. Laman web rasmi anda kini bersiaran di seluruh dunia dengan sokongan HTTPS automatik!

---

## 🐙 Arahan Push ke GitHub `aisaclub/aisa-web`

Jika anda menghadapi ralat kebenaran (*Permission Denied 403*):
```
remote: Permission to aisaclub/aisa-web.git denied to ammarsyaathir.
fatal: unable to access 'https://github.com/aisaclub/aisa-web.git/': The requested URL returned error: 403
```

Ia bermaksud akaun peribadi anda belum ditambah sebagai **Collaborator** atau tiada hak akses tulis (*Write Access*) dalam organisasi GitHub **`aisaclub`**.

### Penyelesaian 1: Tambah Kolaborator di GitHub
1. Pemilik organisasi `aisaclub` perlu membuka:  
   `https://github.com/aisaclub/aisa-web/settings/access`
2. Tekan **Add people** dan jemput username anda dengan kebenaran **Admin** atau **Write**.
3. Terima jemputan di emel atau di `https://github.com/aisaclub/aisa-web/invitations`.
4. Jalankan:
   ```bash
   git push -u origin main
   ```

### Penyelesaian 2: Gunakan GitHub Personal Access Token (PAT)
1. Pergi ke `https://github.com/settings/tokens?type=beta` (Fine-grained token) atau Classic Token.
2. Jana token dengan kebenaran `repo` (Full control of private repositories).
3. Jalankan arahan push dengan token:
   ```bash
   git push https://<TOKEN_ANDA>@github.com/aisaclub/aisa-web.git main
   ```

---

## 📂 Struktur Fail Projek

```
aisa-uitm-web/
├── .github/                       # CI/CD Workflows
├── functions/                     # Cloudflare Pages Functions (Edge API)
│   └── api/
│       ├── broadcast.ts           # Exco Broadcast & Email Campaign API
│       ├── register.ts            # Pendaftaran Keahlian Native API
│       └── subscribe.ts           # Langganan Notis & Buletin API
├── migrations/                    # Cloudflare D1 SQLite Migrations
│   ├── 0001_initial_schema.sql    # D1 Tables Schema & Indices
│   └── 0002_seed_data.sql         # Data Awal Pensyarah & Aktiviti
├── public/                        # Aset Statik (Favicon, Logo, Peta)
├── src/
│   ├── components/                # Komponen UI React
│   │   ├── ActivitiesSection.tsx  # Arkib Aktiviti & Lightbox Gallery
│   │   ├── AdminPortalModal.tsx   # Dashboard Pengurusan Exco & Data Ahli
│   │   ├── AIGame.tsx             # Mini-Game "Neuro-Dash" (60fps Canvas)
│   │   ├── EmailTemplateModal.tsx # Preview Emel Pendaftaran Ahli
│   │   ├── ExcoEmailStudioModal.tsx# Exco Email Campaign Studio (3 Tema)
│   │   ├── Footer.tsx             # Footer & Pautan Rasmi UiTM
│   │   ├── HebahanSection.tsx     # Papan Notis & Hebahan Pertandingan
│   │   ├── Hero.tsx               # Hero Section & Quick Links
│   │   ├── JoinUsSection.tsx      # Borang Pendaftaran & Langganan Notis
│   │   ├── Navbar.tsx             # Navigasi & Status Edge Network
│   │   ├── OrgTreeChart.tsx       # Carta Organisasi Pokok & Pensyarah
│   │   ├── SocialIcons.tsx        # Ikon Vektor SVG
│   │   ├── TeaserVideoModal.tsx   # Teaser Video Reel 15 Saat
│   │   └── ThreeCanvas.tsx        # 3D Geodesic Neural Mesh (Three.js)
│   ├── data/
│   │   └── initialData.ts         # Data Awal Pensyarah KPPIM & Exco
│   ├── services/
│   │   └── api.ts                 # Service Client D1 + LocalStorage Fallback
│   ├── types.ts                   # Skema Jenis Data TypeScript
│   ├── App.tsx                    # Komponen Utama Aplikasi
│   ├── main.tsx                   # Titik Masuk (Entry Point)
│   └── style.css                  # Tema Slate-Navy & Animasi
├── index.html                     # HTML Shell & Web Fonts
├── package.json                   # Dependensi Projek
├── tsconfig.json                  # Konfigurasi TypeScript
├── vite.config.ts                 # Konfigurasi Vite & Tailwind CSS v4
└── wrangler.toml                  # Konfigurasi Cloudflare Pages & D1 Binding
```

---

## 👥 Barisan Kepimpinan & Pensyarah Penasihat

* **Ketua Pusat Pengajian / Penasihat Kehormat**: Ts. Dr. Mohd Hafiz Bin Mohd Yusof (Penyelidikan: AI Ethics & Machine Learning)
* **Pensyarah Penasihat Kanan**: Dr. Siti Zubaidah Binti Ahmad (Penyelidikan: Deep Learning & Computer Vision)
* **Yang Di-Pertua (YDP)**: Muhammad Danial Haikal (CS251 - Sains Komputer)
* **Timbalan Yang Di-Pertua (TYDP)**: Nurul Izzah Farhana (CS245 - Kejuruteraan Sistem Maklumat)

---

<div align="center">

**Artificial Intelligence Student Association (AISA)**  
Kolej Pengajian Pengkomputeran, Informatik dan Matematik (KPPIM)  
Universiti Teknologi MARA (UiTM) Cawangan Melaka Kampus Jasin  
77300 Merlimau, Melaka, Malaysia  

*Dicipta dengan dedikasi tinggi untuk melahirkan barisan jurutera AI terunggul negara.*

</div>
