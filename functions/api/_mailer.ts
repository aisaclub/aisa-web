// Helper module: _mailer.ts
// Cloudflare Pages Functions email dispatcher supporting Google Apps Script Gmail Relay & Resend API
// Contains 6 distinct, premium email design styles:
// 1. Minimalist Academic (Clean White Swiss)
// 2. Glassmorphism (Frosted Glass Cyber)
// 3. Skeuomorphism (Physical Tactile Lanyard Badge with Chip)
// 4. Neo-Brutalism (Bold High-Contrast Tech Summit)
// 5. UiTM Royal Purple & Corporate Gold (Official University Memo)
// 6. Cyber Clean Titanium (Modern AI Lab Light)

export type EmailDesignStyle =
  | 'minimalist'
  | 'glassmorphism'
  | 'skeuomorphism'
  | 'neobrutalism'
  | 'uitm_royal'
  | 'cyber_clean';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  apiKey?: string;
  fromName?: string;
  gmailRelayUrl?: string;
  replyTo?: string;
}

export async function sendRealEmail({
  to,
  subject,
  html,
  apiKey,
  fromName = 'AISA UiTM Melaka Jasin',
  gmailRelayUrl,
  replyTo = 'aisaclub.uitmjasin@gmail.com',
}: SendEmailOptions): Promise<{ sent: boolean; status: string; data?: any; error?: string }> {
  // Method 1: Google Apps Script Webhook Relay (Sends DIRECTLY from aisaclub.uitmjasin@gmail.com for FREE)
  if (gmailRelayUrl && gmailRelayUrl.trim() !== '') {
    try {
      const gRes = await fetch(gmailRelayUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html,
          fromName,
          replyTo,
        }),
      });
      const gJson = (await gRes.json()) as any;
      if (gRes.ok && gJson.success) {
        return { sent: true, status: 'DELIVERED_VIA_GMAIL', data: gJson };
      }
    } catch (gErr: any) {
      console.warn('Gmail relay error, falling back to Resend if available:', gErr.message);
    }
  }

  // Method 2: Resend API
  const effectiveKey = apiKey && apiKey.trim() !== '' ? apiKey.trim() : null;

  if (!effectiveKey) {
    return {
      sent: false,
      status: 'LOGGED_TO_D1_ONLY',
      data: { message: 'Emel direkodkan ke D1 database. Tambah GMAIL_RELAY_URL atau RESEND_API_KEY di Cloudflare untuk penghantaran emel sebenar.' },
    };
  }

  try {
    // Resend blocks fake domains like example.com with 422 validation_error.
    // Map example.com to Resend's official sandbox test address: delivered@resend.dev
    const recipient = to.toLowerCase().includes('example.com')
      ? 'delivered@resend.dev'
      : to;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <onboarding@resend.dev>`,
        reply_to: replyTo,
        to: [recipient],
        subject: subject,
        html: html,
      }),
    });

    const resJson = (await response.json()) as any;
    if (response.ok) {
      return { sent: true, status: 'DELIVERED', data: resJson };
    } else {
      return {
        sent: false,
        status: resJson.name || 'API_ERROR',
        error: resJson.message || JSON.stringify(resJson),
      };
    }
  } catch (err: any) {
    return { sent: false, status: 'NETWORK_ERROR', error: err.message };
  }
}

// -------------------------------------------------------------
// 1. WELCOME MEMBERSHIP PASS TEMPLATES (6 DISTINCT STYLES)
// -------------------------------------------------------------
export interface WelcomeEmailData {
  fullName: string;
  membershipId: string;
  studentId: string;
  program: string;
  semester: string;
  aiInterest: string;
}

export function renderWelcomeEmailHtml(data: WelcomeEmailData, style: EmailDesignStyle = 'minimalist'): string {
  switch (style) {
    case 'glassmorphism':
      return renderWelcomeGlassmorphism(data);
    case 'skeuomorphism':
      return renderWelcomeSkeuomorphism(data);
    case 'neobrutalism':
      return renderWelcomeNeoBrutalism(data);
    case 'uitm_royal':
      return renderWelcomeUiTmRoyal(data);
    case 'cyber_clean':
      return renderWelcomeCyberClean(data);
    case 'minimalist':
    default:
      return renderWelcomeMinimalist(data);
  }
}

// STYLE 1: Minimalist Academic (Clean White Swiss) - Bright & Professional
function renderWelcomeMinimalist(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pengesahan Keahlian AISA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #4f46e5, #06b6d4);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 20px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 10px; background-color: #e0f2fe; color: #0369a1; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">PENGESAHAN KEAHLIAN RASMI</span>
                    <h1 style="margin: 12px 0 4px; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION</h1>
                    <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">UiTM Cawangan Melaka Kampus Jasin • FSKM & FPA</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 30px;">
              <h2 style="margin: 0 0 10px; font-size: 18px; color: #0f172a;">Selamat Datang, ${data.fullName}!</h2>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #334155;">
                Permohonan keahlian anda bagi sesi 2026/2027 telah berjaya diluluskan. Kad Keahlian Digital anda kini aktif sepenuhnya dalam ekosistem AISA.
              </p>

              <!-- Digital Pass Card (Minimalist Clean Slate) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">NO. KEAHLIAN RASMI</span>
                          <div style="font-size: 22px; font-weight: 900; color: #4338ca; letter-spacing: 1px; margin: 4px 0 16px;">${data.membershipId}</div>
                        </td>
                        <td align="right" valign="top">
                          <span style="display: inline-block; padding: 4px 10px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 700; border-radius: 20px;">AKTIF 2026/2027</span>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="6" cellspacing="0" style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
                      <tr>
                        <td style="font-size: 12px; color: #64748b; width: 110px;">Nama Penuh:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #0f172a;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">No. Pelajar:</td>
                        <td style="font-size: 13px; font-family: monospace; font-weight: 600; color: #0f172a;">${data.studentId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">Program:</td>
                        <td style="font-size: 12px; color: #334155;">${data.program}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">Semester:</td>
                        <td style="font-size: 12px; color: #334155;">${data.semester}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">Tumpuan AI:</td>
                        <td style="font-size: 12px; font-weight: 600; color: #4338ca;">${data.aiInterest}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
                Sebarang hebahan bengkel superkomputer, latihan intensif AI, dan panggilan mesyuarat agung akan dihantar terus ke alamat emel ini.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                Dihantar secara rasmi oleh Sistem Pengurusan AISA • UiTM Cawangan Melaka Kampus Jasin, 77300 Merlimau, Melaka.<br>
                Emel Pertanyaan: <a href="mailto:aisaclub.uitmjasin@gmail.com" style="color: #4338ca; text-decoration: none; font-weight: 600;">aisaclub.uitmjasin@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// STYLE 2: Glassmorphism (Frosted Glass Cyber)
function renderWelcomeGlassmorphism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kad Keahlian AISA (Glassmorphism)</title>
</head>
<body style="margin: 0; padding: 0; background: #eef2ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #eff6ff 100%); padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background: rgba(255, 255, 255, 0.95); border: 2px solid #c7d2fe; border-radius: 24px; box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.15); overflow: hidden;">
          <!-- Glowing Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%); padding: 32px 25px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; padding: 3px 12px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">KKEAHLIAN DIGITAL 2026</span>
              <h1 style="margin: 10px 0 4px; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION</h1>
              <p style="margin: 0; font-size: 12px; color: #e0e7ff;">UiTM Melaka Kampus Jasin • FSKM & FPA</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 10px; font-size: 18px; color: #1e1b4b;">Tahniah & Selamat Datang, ${data.fullName}!</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">
                Pendaftaran anda telah disahkan! Di bawah adalah Kad Keahlian Digital anda:
              </p>

              <!-- Frosted Pass Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f5f3ff 0%, #ecfeff 100%); border: 1.5px solid #a5b4fc; border-radius: 20px; padding: 24px; margin-bottom: 22px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase;">ID KEAHLIAN RASMI:</span>
                    <h3 style="margin: 4px 0 15px; font-size: 24px; font-weight: 900; color: #4338ca; letter-spacing: 1px;">${data.membershipId}</h3>
                    
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #64748b; width: 110px;">Nama:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #0f172a;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">No. Pelajar:</td>
                        <td style="font-size: 13px; font-family: monospace; font-weight: 700; color: #0284c7;">${data.studentId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">Program:</td>
                        <td style="font-size: 12px; color: #1e293b;">${data.program}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">Semester:</td>
                        <td style="font-size: 12px; color: #1e293b;">${data.semester}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;">Tumpuan AI:</td>
                        <td style="font-size: 12px; font-weight: 700; color: #7c3aed;">${data.aiInterest}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Simpan emel ini sebagai bukti keahlian untuk menghadiri bengkel dan aktiviti persatuan.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f8faff; border-top: 1px solid #e0e7ff; padding: 18px; text-align: center; font-size: 11px; color: #64748b;">
              AISA UiTM Melaka Kampus Jasin • <a href="mailto:aisaclub.uitmjasin@gmail.com" style="color: #4f46e5; font-weight: bold; text-decoration: none;">aisaclub.uitmjasin@gmail.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// STYLE 3: Skeuomorphism (Physical Tactile Lanyard Badge with Chip)
function renderWelcomeSkeuomorphism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AISA Student ID Badge</title>
</head>
<body style="margin: 0; padding: 0; background-color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e2e8f0; padding: 35px 15px;">
    <tr>
      <td align="center">
        <!-- Lanyard Clip Grommet -->
        <div style="width: 70px; height: 14px; background: linear-gradient(180deg, #94a3b8 0%, #475569 100%); border-radius: 6px; margin: 0 auto 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"></div>
        <div style="width: 44px; height: 10px; background: #0f172a; border-radius: 5px; margin: 0 auto 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);"></div>

        <!-- Physical PVC Badge Card -->
        <table width="100%" style="max-width: 520px; background: #ffffff; border: 1px solid #cbd5e1; border-bottom: 4px solid #64748b; border-radius: 20px; box-shadow: 0 20px 45px rgba(0,0,0,0.16), 0 5px 15px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Top Badge Ribbon -->
          <tr>
            <td style="background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%); padding: 20px; text-align: center; border-bottom: 3px solid #f59e0b;">
              <span style="font-size: 10px; font-weight: 800; color: #fde68a; letter-spacing: 2px;">UNIVERSITI TEKNOLOGI MARA</span>
              <h2 style="margin: 4px 0 0; color: #ffffff; font-size: 18px; font-weight: 900; letter-spacing: 0.5px;">AISA STUDENT ACCESS PASS</h2>
              <span style="font-size: 11px; color: #c7d2fe;">KAMPUS JASIN • SESI 2026/2027</span>
            </td>
          </tr>
          <!-- Body Badge Card -->
          <tr>
            <td style="padding: 25px 25px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                <tr>
                  <!-- Metallic Gold Chip -->
                  <td width="60" valign="top">
                    <div style="width: 48px; height: 36px; background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%); border-radius: 6px; border: 1px solid #b45309; box-shadow: inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.15); position: relative;">
                      <div style="width: 20px; height: 34px; border-right: 1px solid #b45309; margin: 0 auto;"></div>
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-size: 10px; color: #64748b; font-weight: bold;">MEMBERSHIP NUMBER</span>
                    <div style="font-size: 20px; font-weight: 900; color: #1e1b4b; font-family: monospace; letter-spacing: 1px;">${data.membershipId}</div>
                  </td>
                </tr>
              </table>

              <!-- Student Details Box -->
              <table width="100%" cellpadding="5" cellspacing="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
                <tr>
                  <td style="font-size: 12px; color: #64748b; width: 100px;">Nama:</td>
                  <td style="font-size: 13px; font-weight: 800; color: #0f172a;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b;">No. Matrik:</td>
                  <td style="font-size: 13px; font-family: monospace; font-weight: 700; color: #1e293b;">${data.studentId}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b;">Program:</td>
                  <td style="font-size: 12px; color: #334155;">${data.program}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b;">Semester:</td>
                  <td style="font-size: 12px; color: #334155;">${data.semester}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b;">Bidang AI:</td>
                  <td style="font-size: 12px; font-weight: 700; color: #4338ca;">${data.aiInterest}</td>
                </tr>
              </table>

              <!-- Hologram Security Foil -->
              <div style="height: 12px; background: linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ec4899); border-radius: 4px; opacity: 0.85; margin-bottom: 15px;"></div>

              <div style="text-align: center; font-size: 11px; color: #64748b;">
                Tunjukkan kad ini semasa pendaftaran acara atau sesi makmal superkomputer.
              </div>
            </td>
          </tr>
          <!-- Bottom Barcode Area -->
          <tr>
            <td style="background: #f1f5f9; border-top: 1px solid #cbd5e1; padding: 12px; text-align: center;">
              <span style="font-family: monospace; font-size: 14px; letter-spacing: 5px; color: #475569; font-weight: bold;">||| | ||||| || |||| ||||| ||</span>
              <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">AUTHENTICATED • AISA UITM JASIN</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// STYLE 4: Neo-Brutalism (Bold High-Contrast Tech Summit)
function renderWelcomeNeoBrutalism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AISA Registration (Neo-Brutalism)</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fef08a; font-family: 'Courier New', Courier, monospace, sans-serif; color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef08a; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 560px; background-color: #ffffff; border: 3px solid #000000; border-radius: 12px; box-shadow: 8px 8px 0px #000000; overflow: hidden;">
          <!-- Neo Header -->
          <tr>
            <td style="background: #000000; color: #facc15; padding: 22px; text-align: center; border-bottom: 3px solid #000000;">
              <span style="background: #38bdf8; color: #000000; padding: 2px 8px; font-weight: 900; font-size: 11px; border: 2px solid #000000; display: inline-block;">VERIFIED STUDENT</span>
              <h1 style="margin: 8px 0 2px; font-size: 22px; font-weight: 900; letter-spacing: 0px;">AISA // UITM JASIN</h1>
              <p style="margin: 0; font-size: 11px; color: #ffffff;">OFFICIAL AI COMMUNITY // FSKM & FPA</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 26px;">
              <div style="background: #a7f3d0; border: 2px solid #000000; box-shadow: 4px 4px 0px #000000; padding: 10px 14px; font-weight: 900; font-size: 13px; margin-bottom: 18px;">
                STATUS: REGISTERED AND ACTIVE (2026/2027)
              </div>

              <h2 style="font-size: 18px; margin: 0 0 10px; font-weight: 900;">HELLO ${data.fullName.toUpperCase()}!</h2>
              <p style="font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
                Permohonan anda telah direkodkan ke dalam database Cloudflare D1. Simpan butiran kad keahlian di bawah:
              </p>

              <!-- Neo Pass Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 3px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 8px; padding: 16px; margin-bottom: 22px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 900; color: #64748b;">MEMBER_ID:</span>
                    <div style="font-size: 24px; font-weight: 900; color: #000000; margin: 2px 0 14px;">${data.membershipId}</div>

                    <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 12px; border-top: 2px dashed #000000; padding-top: 8px;">
                      <tr>
                        <td width="90" style="font-weight: 900;">NAMA:</td>
                        <td>${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 900;">MATRIK:</td>
                        <td>${data.studentId}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 900;">KURSUS:</td>
                        <td>${data.program}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 900;">SEMESTER:</td>
                        <td>${data.semester}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 900;">MINAT AI:</td>
                        <td style="color: #4338ca; font-weight: bold;">${data.aiInterest}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; line-height: 1.5; margin: 0;">
                Sebarang pertanyaan sila hubungi: <a href="mailto:aisaclub.uitmjasin@gmail.com" style="color: #000000; font-weight: 900;">aisaclub.uitmjasin@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// STYLE 5: UiTM Royal Purple & Corporate Gold (Official University Memo)
function renderWelcomeUiTmRoyal(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pengesahan Pendaftaran AISA UiTM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf5ff; font-family: Georgia, 'Times New Roman', serif; color: #1e1b4b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background-color: #ffffff; border: 2px solid #581c87; border-radius: 10px; box-shadow: 0 10px 30px rgba(88, 28, 135, 0.1); overflow: hidden;">
          <!-- UiTM Purple Header with Gold Border -->
          <tr>
            <td style="background: #3b0764; color: #ffffff; padding: 30px 25px; text-align: center; border-bottom: 4px solid #d97706;">
              <span style="font-size: 11px; letter-spacing: 1px; color: #fde68a; text-transform: uppercase;">UNIVERSITI TEKNOLOGI MARA</span>
              <h1 style="margin: 6px 0 2px; font-size: 21px; font-weight: bold; color: #fbbf24; letter-spacing: 0.5px;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION</h1>
              <p style="margin: 0; font-size: 12px; color: #e9d5ff;">Cawangan Melaka Kampus Jasin • FSKM & FPA</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 28px;">
              <div style="border-left: 4px solid #7c3aed; background: #faf5ff; padding: 10px 14px; margin-bottom: 20px;">
                <span style="font-size: 11px; font-weight: bold; color: #6b21a8; text-transform: uppercase;">SURAT PENGESAHAN KEAHLIAN RASMI SESI 2026/2027</span>
              </div>

              <h2 style="font-size: 18px; margin: 0 0 12px; color: #3b0764;">Tahniah & Selamat Datang, ${data.fullName}!</h2>
              <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 22px;">
                Sukacita dimaklumkan bahawa permohonan pendaftaran anda sebagai ahli berdaftar persatuan AISA bagi sesi akademik ini telah diluluskan. Di bawah adalah maklumat pendaftaran rasmi anda:
              </p>

              <!-- Formal Academic Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #faf5ff; border: 1.5px solid #d8b4fe; border-left: 6px solid #d97706; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #6b21a8; text-transform: uppercase; font-weight: bold;">NOMBOR KEAHLIAN:</span>
                    <h3 style="margin: 3px 0 14px; font-size: 22px; color: #3b0764; font-weight: bold;">${data.membershipId}</h3>

                    <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 13px;">
                      <tr>
                        <td width="110" style="color: #6b21a8; font-weight: bold;">Nama Penuh:</td>
                        <td style="color: #1e1b4b; font-weight: bold;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b21a8; font-weight: bold;">No. Pelajar:</td>
                        <td style="color: #1e1b4b; font-family: monospace;">${data.studentId}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b21a8; font-weight: bold;">Program:</td>
                        <td style="color: #334155;">${data.program}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b21a8; font-weight: bold;">Semester:</td>
                        <td style="color: #334155;">${data.semester}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b21a8; font-weight: bold;">Tumpuan AI:</td>
                        <td style="color: #6b21a8; font-weight: bold;">${data.aiInterest}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0;">
                Semua hebahan mesyuarat agung, latihan amali, dan persidangan akan dimaklumkan secara berkala ke peti masuk ini.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 18px; background: #faf5ff; border-top: 1px solid #e9d5ff; text-align: center; font-size: 11px; color: #6b21a8;">
              Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM) • UiTM Cawangan Melaka Kampus Jasin<br>
              Hubungi: <a href="mailto:aisaclub.uitmjasin@gmail.com" style="color: #3b0764; font-weight: bold;">aisaclub.uitmjasin@gmail.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// STYLE 6: Cyber Clean Titanium (Modern AI Lab Light)
function renderWelcomeCyberClean(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AISA Membership Pass</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1.5px solid #0284c7; border-radius: 20px; box-shadow: 0 15px 35px rgba(2, 132, 199, 0.1); overflow: hidden;">
          <!-- Titanium Sapphire Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%); padding: 26px 22px; text-align: center; color: #ffffff;">
              <div style="height: 3px; background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8); margin-bottom: 12px; border-radius: 2px;"></div>
              <span style="font-size: 10px; font-weight: 800; color: #38bdf8; letter-spacing: 1.5px;">ARTIFICIAL INTELLIGENCE RESEARCH LAB</span>
              <h1 style="margin: 6px 0 2px; font-size: 20px; font-weight: 900; letter-spacing: 0.5px;">AISA DIGITAL PASSPORT</h1>
              <p style="margin: 0; font-size: 11px; color: #bae6fd;">UiTM Melaka Kampus Jasin // FSKM & FPA</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; color: #0284c7;">AISA-NODE // VERIFIED</span>
                    <h2 style="font-size: 17px; margin: 4px 0 0; color: #0f172a;">Selamat Datang, ${data.fullName}</h2>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; background: #e0f2fe; color: #0284c7; border: 1px solid #7dd3fc; padding: 3px 8px; border-radius: 12px; font-weight: 700;">CLOUD ID ACTIVE</span>
                  </td>
                </tr>
              </table>

              <!-- Tech Pass Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 1px solid #bae6fd; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">MEMBERSHIP TOKEN:</span>
                    <h3 style="margin: 2px 0 14px; font-size: 22px; font-weight: 900; color: #0284c7; font-family: monospace;">${data.membershipId}</h3>

                    <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 12px;">
                      <tr>
                        <td width="90" style="color: #64748b; font-weight: 600;">Student:</td>
                        <td style="color: #0f172a; font-weight: 700;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Matric ID:</td>
                        <td style="color: #0284c7; font-family: monospace; font-weight: 700;">${data.studentId}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Program:</td>
                        <td style="color: #334155;">${data.program}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Semester:</td>
                        <td style="color: #334155;">${data.semester}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">AI Domain:</td>
                        <td style="color: #0284c7; font-weight: 700;">${data.aiInterest}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #475569; line-height: 1.5; margin: 0;">
                Gunakan token keahlian anda untuk akses portal latihan AI dan pendaftaran hackathon rasmi.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 14px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
              AISA Research & Community // <a href="mailto:aisaclub.uitmjasin@gmail.com" style="color: #0284c7; text-decoration: none; font-weight: 700;">aisaclub.uitmjasin@gmail.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// -------------------------------------------------------------
// 2. NEWSLETTER SUBSCRIBER CONFIRMATION (Clean Light)
// -------------------------------------------------------------
export function renderSubscriberEmailHtml(data: { email: string; topic: string }): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pengesahan Langganan Buletin AISA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 550px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); padding: 30px; overflow: hidden;">
          <tr>
            <td>
              <span style="display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 20px; font-size: 11px; font-weight: 700;">AISA UITM JASIN • BULETIN & NOTIS PINTAR</span>
              <h2 style="color: #0f172a; font-size: 19px; margin: 12px 0 10px;">Pengesahan Langganan Berjaya!</h2>
              <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
                Terima kasih! Emel anda (<strong>${data.email}</strong>) kini telah didaftarkan dalam Cloudflare D1 untuk menerima kemas kini bagi topik:
              </p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 10px; margin: 0 0 16px; color: #166534; font-weight: 700; font-size: 13px;">
                📌 Topik Langganan: ${data.topic}
              </div>
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 20px;">
                Anda akan menerima notis pertandingan, hackathon, dan bengkel terbuka terus ke peti masuk ini.
              </p>
              <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center;">
                AISA UiTM Kampus Jasin • <a href="mailto:aisaclub.uitmjasin@gmail.com" style="color: #4338ca; text-decoration: none;">aisaclub.uitmjasin@gmail.com</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// -------------------------------------------------------------
// 3. EXCO BROADCAST CAMPAIGN TEMPLATES (6 DISTINCT STYLES)
// -------------------------------------------------------------
export function renderBroadcastCampaignEmailHtml(campaign: {
  title: string;
  subject: string;
  content: string;
  date?: string;
  time?: string;
  location?: string;
  templateStyle?: EmailDesignStyle;
  senderRole?: string;
  senderName?: string;
}): string {
  const style = campaign.templateStyle || 'minimalist';

  // UiTM Royal
  if (style === 'uitm_royal') {
    return `<!DOCTYPE html>
<html>
<body style="background-color: #faf5ff; font-family: Georgia, serif; color: #1e1b4b; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #581c87; padding: 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(88,28,135,0.08);">
    <div style="text-align: center; border-bottom: 3px solid #d97706; padding-bottom: 14px; margin-bottom: 22px;">
      <h2 style="margin: 0; color: #3b0764; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">UNIVERSITI TEKNOLOGI MARA CAWANGAN MELAKA KAMPUS JASIN</h2>
      <h3 style="margin: 4px 0 0; color: #7c3aed; font-size: 13px;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION (AISA)</h3>
      <p style="margin: 4px 0 0; font-size: 10px; color: #64748b;">Rujukan: AISA/UiTM/2026/MEMO-${Date.now().toString().slice(-4)}</p>
    </div>

    <h3 style="font-size: 16px; color: #3b0764; border-left: 4px solid #d97706; padding-left: 12px; margin-bottom: 16px;">
      ${campaign.title}
    </h3>

    <div style="font-size: 13px; line-height: 1.8; color: #334155; margin-bottom: 20px;">
      ${campaign.content.replace(/\n/g, '<br/>')}
    </div>

    ${campaign.date ? `
    <div style="background-color: #faf5ff; border: 1.5px solid #d8b4fe; padding: 14px 18px; border-radius: 6px; font-size: 12px; margin-bottom: 22px;">
      <strong>Tarikh:</strong> ${campaign.date} | <strong>Masa:</strong> ${campaign.time || '8:30 PM'} | <strong>Tempat:</strong> ${campaign.location || 'Dewan Al-Khawarizmi / GMeet'}
    </div>
    ` : ''}

    <div style="margin-top: 25px; font-size: 12px; border-top: 1px solid #f3e8ff; padding-top: 15px;">
      <p style="margin: 0; font-weight: bold; color: #3b0764;">"USAHA, TAKWA, MULIA"</p>
      <p style="margin: 10px 0 0; color: #475569;">Yang Menjalankan Amanah,</p>
      <p style="margin: 4px 0 0; font-weight: bold; color: #1e1b4b;">${campaign.senderName || 'Barisan Majlis Tertinggi AISA'}</p>
      <p style="margin: 0; color: #6b21a8;">${campaign.senderRole || 'AISA UiTM Melaka Kampus Jasin'}</p>
    </div>
  </div>
</body>
</html>`;
  }

  // Neo-Brutalism
  if (style === 'neobrutalism') {
    return `<!DOCTYPE html>
<html>
<body style="background-color: #fef08a; font-family: 'Courier New', Courier, monospace; color: #000000; padding: 30px 15px;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 3px solid #000000; box-shadow: 7px 7px 0px #000000; border-radius: 10px; overflow: hidden;">
    <div style="background: #000000; color: #facc15; padding: 20px; text-align: center; border-bottom: 3px solid #000000;">
      <div style="font-size: 11px; font-weight: 900; background: #38bdf8; color: #000000; display: inline-block; padding: 2px 8px; border: 2px solid #000000;">OFFICIAL BROADCAST</div>
      <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 900;">AISA // NOTIS HEBAHAN</h1>
    </div>
    <div style="padding: 24px;">
      <h2 style="font-size: 17px; margin: 0 0 14px; font-weight: 900;">${campaign.title}</h2>
      <div style="font-size: 13px; line-height: 1.7; color: #000000; margin-bottom: 20px;">
        ${campaign.content.replace(/\n/g, '<br/>')}
      </div>
      ${campaign.date ? `
      <div style="background: #e0f2fe; border: 2px solid #000000; box-shadow: 4px 4px 0px #000000; padding: 12px 14px; font-size: 12px; font-weight: bold; margin-bottom: 20px;">
        JADUAL: ${campaign.date} (${campaign.time || ''}) @ ${campaign.location || 'Kampus Jasin / Online'}
      </div>
      ` : ''}
      <div style="border-top: 2px solid #000000; padding-top: 14px; font-size: 11px;">
        DIHANTAR OLEH: <strong>${campaign.senderRole || 'EXCO AISA'}</strong>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // Skeuomorphism (Tactile Lanyard Memo)
  if (style === 'skeuomorphism') {
    return `<!DOCTYPE html>
<html>
<body style="background-color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; padding: 35px 15px;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-bottom: 4px solid #64748b; border-radius: 18px; box-shadow: 0 18px 40px rgba(0,0,0,0.14); overflow: hidden;">
    <div style="background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%); padding: 22px; text-align: center; color: #ffffff; border-bottom: 3px solid #f59e0b;">
      <span style="font-size: 10px; letter-spacing: 2px; color: #fde68a; font-weight: 800;">AISA OFFICIAL BULLETIN</span>
      <h2 style="margin: 4px 0 0; font-size: 19px; font-weight: 900;">${campaign.title}</h2>
    </div>
    <div style="padding: 26px;">
      <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 20px;">
        ${campaign.content.replace(/\n/g, '<br/>')}
      </div>
      ${campaign.date ? `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #4338ca; padding: 14px; border-radius: 8px; font-size: 12px; margin-bottom: 20px;">
        <strong style="color: #4338ca;">📅 Tarikh:</strong> ${campaign.date} | <strong>⏰ Masa:</strong> ${campaign.time || '8:30 PM'}<br>
        <strong>📍 Tempat:</strong> ${campaign.location || 'Dewan Al-Khawarizmi & Online'}
      </div>
      ` : ''}
      <div style="height: 10px; background: linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ec4899); border-radius: 4px; opacity: 0.8; margin-bottom: 15px;"></div>
      <p style="margin: 0; font-size: 11px; color: #64748b; text-align: center;">
        Dihantar oleh: ${campaign.senderRole || 'Barisan Majlis Tertinggi AISA'} • UiTM Melaka Kampus Jasin
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  // Glassmorphism (Frosted Glass Cyber)
  if (style === 'glassmorphism') {
    return `<!DOCTYPE html>
<html>
<body style="background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%); font-family: -apple-system, sans-serif; color: #0f172a; padding: 30px 15px;">
  <div style="max-width: 580px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); border: 2px solid #c7d2fe; border-radius: 20px; box-shadow: 0 15px 35px rgba(99, 102, 241, 0.12); overflow: hidden;">
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%); padding: 26px; text-align: center; color: #ffffff;">
      <span style="font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.25); padding: 3px 10px; border-radius: 12px; letter-spacing: 1px;">HEBAHAN RASMI AISA</span>
      <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 900;">${campaign.title}</h1>
    </div>
    <div style="padding: 26px;">
      <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 20px;">
        ${campaign.content.replace(/\n/g, '<br/>')}
      </div>
      ${campaign.date ? `
      <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ecfeff 100%); border: 1.5px solid #a5b4fc; border-radius: 12px; padding: 14px; font-size: 12px; margin-bottom: 20px; color: #1e1b4b;">
        <strong>📅 Tarikh:</strong> ${campaign.date} | <strong>⏰ Masa:</strong> ${campaign.time || '8:30 PM'}<br>
        <strong>📍 Tempat:</strong> ${campaign.location || 'Dewan Seminar / GMeet'}
      </div>
      ` : ''}
      <p style="margin: 0; font-size: 11px; color: #64748b; text-align: center;">
        AISA UiTM Melaka Kampus Jasin // ${campaign.senderRole || 'Biro Penerbitan & Publisiti'}
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  // Cyber Clean Titanium
  if (style === 'cyber_clean') {
    return `<!DOCTYPE html>
<html>
<body style="background-color: #f1f5f9; font-family: -apple-system, sans-serif; color: #0f172a; padding: 30px 15px;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1.5px solid #0284c7; border-radius: 16px; box-shadow: 0 15px 35px rgba(2, 132, 199, 0.1); overflow: hidden;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%); padding: 24px; text-align: center; color: #ffffff;">
      <div style="height: 3px; background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8); margin-bottom: 10px; border-radius: 2px;"></div>
      <span style="font-size: 10px; font-weight: 800; color: #38bdf8; letter-spacing: 1.5px;">AISA // RESEARCH LAB NOTIFICATION</span>
      <h1 style="margin: 6px 0 0; font-size: 19px; font-weight: 900;">${campaign.title}</h1>
    </div>
    <div style="padding: 26px;">
      <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 20px;">
        ${campaign.content.replace(/\n/g, '<br/>')}
      </div>
      ${campaign.date ? `
      <div style="background: #f8fafc; border: 1px solid #bae6fd; border-radius: 10px; padding: 14px; font-size: 12px; margin-bottom: 20px; color: #0f172a;">
        <strong style="color: #0284c7;">Jadual:</strong> ${campaign.date} (${campaign.time || '10:00 AM'})<br>
        <strong style="color: #0284c7;">Lokasi:</strong> ${campaign.location || 'Dewan Al-Khawarizmi / Online'}
      </div>
      ` : ''}
      <p style="margin: 0; font-size: 11px; color: #64748b; text-align: center;">
        AISA UiTM Melaka Kampus Jasin // ${campaign.senderRole || 'Biro Akademik & Teknikal AI'}
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  // Default: Minimalist Academic
  return `<!DOCTYPE html>
<html>
<body style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; padding: 30px 15px;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.05); overflow: hidden;">
    <div style="height: 5px; background: linear-gradient(90deg, #4f46e5, #06b6d4);"></div>
    <div style="padding: 28px 28px 20px; border-bottom: 1px solid #f1f5f9;">
      <span style="font-size: 11px; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 3px 10px; border-radius: 20px;">HEBAHAN PERSATUAN</span>
      <h1 style="margin: 10px 0 0; font-size: 19px; font-weight: 800; color: #0f172a;">${campaign.title}</h1>
      <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">AISA UiTM Melaka Kampus Jasin • FSKM & FPA</p>
    </div>
    <div style="padding: 24px 28px;">
      <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 20px;">
        ${campaign.content.replace(/\n/g, '<br/>')}
      </div>
      ${campaign.date ? `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 12px; margin-bottom: 20px; color: #0f172a;">
        <strong>📅 Tarikh:</strong> ${campaign.date} | <strong>⏰ Masa:</strong> ${campaign.time || '8:30 PM'}<br>
        <strong>📍 Tempat:</strong> ${campaign.location || 'Dewan Seminar / GMeet'}
      </div>
      ` : ''}
      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 12px; color: #64748b;">
        Dihantar oleh: <strong style="color: #0f172a;">${campaign.senderName || 'Barisan Exco AISA'}</strong> (${campaign.senderRole || 'AISA UiTM Jasin'})
      </div>
    </div>
  </div>
</body>
</html>`;
}
