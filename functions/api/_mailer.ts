// Helper module: _mailer.ts
// Cloudflare Pages Functions email dispatcher with Resend API support & beautiful responsive HTML templates

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  apiKey?: string;
  fromName?: string;
}

export async function sendRealEmail({
  to,
  subject,
  html,
  apiKey,
  fromName = 'AISA UiTM Melaka Jasin',
}: SendEmailOptions): Promise<{ sent: boolean; status: string; data?: any; error?: string }> {
  // Read apiKey passed from Cloudflare Pages context.env.RESEND_API_KEY
  const effectiveKey = apiKey && apiKey.trim() !== '' ? apiKey.trim() : null;

  if (!effectiveKey) {
    return {
      sent: false,
      status: 'LOGGED_TO_D1_ONLY',
      data: { message: 'Emel direkodkan ke D1 database. Tambah RESEND_API_KEY di Cloudflare Pages > Settings > Environment variables untuk penghantaran emel sebenar.' },
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <onboarding@resend.dev>`,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const resJson = await response.json();
    if (response.ok) {
      return { sent: true, status: 'DELIVERED', data: resJson };
    } else {
      return { sent: false, status: 'API_ERROR', error: JSON.stringify(resJson) };
    }
  } catch (err: any) {
    return { sent: false, status: 'NETWORK_ERROR', error: err.message };
  }
}

// 1. Template: Welcome & Membership Pass Email (HTML)
export function renderWelcomeEmailHtml(data: {
  fullName: string;
  membershipId: string;
  studentId: string;
  program: string;
  semester: string;
  aiInterest: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kad Keahlian AISA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" style="max-width: 600px; background-color: #0f172a; border: 1px solid #312e81; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4338ca, #06b6d4); padding: 30px 25px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION</h1>
              <p style="margin: 6px 0 0; color: #e0e7ff; font-size: 13px; font-weight: 600;">UiTM CAWANGAN MELAKA KAMPUS JASIN • FSKM & FPA</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 25px;">
              <div style="background-color: #1e1b4b; border-left: 4px solid #38bdf8; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px;">
                <span style="color: #38bdf8; font-size: 11px; font-weight: bold; text-transform: uppercase;">PENGESAHAN PENDAFTARAN AHLI SESI 2026/2027</span>
              </div>

              <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 12px;">Tahniah & Selamat Datang, ${data.fullName}!</h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Permohonan pendaftaran anda sebagai ahli rasmi persatuan <strong>Artificial Intelligence Student Association (AISA)</strong> telah berjaya direkodkan. Berikut adalah butiran kad keahlian digital anda:
              </p>

              <!-- Digital Pass Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(145deg, #020617, #1e1b4b); border: 1px solid #4338ca; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase;">NO. KEAHLIAN RASMI:</span>
                    <h3 style="color: #38bdf8; font-size: 22px; font-weight: 900; margin: 4px 0 15px; letter-spacing: 1px;">${data.membershipId}</h3>
                    <table width="100%" cellpadding="4" cellspacing="0">
                      <tr>
                        <td style="color: #94a3b8; font-size: 12px; width: 120px;">Nama Penuh:</td>
                        <td style="color: #ffffff; font-size: 12px; font-weight: bold;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 12px;">No. Pelajar:</td>
                        <td style="color: #ffffff; font-size: 12px; font-family: monospace;">${data.studentId}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 12px;">Program:</td>
                        <td style="color: #ffffff; font-size: 12px;">${data.program}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 12px;">Semester:</td>
                        <td style="color: #ffffff; font-size: 12px;">${data.semester}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 12px;">Tumpuan AI:</td>
                        <td style="color: #a5b4fc; font-size: 12px; font-weight: bold;">${data.aiInterest}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                Sebarang hebahan mesyuarat agung, latihan hackathon intensif, dan sesi makmal superkomputer akan dimaklumkan secara automatik ke emel ini.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #020617; border-top: 1px solid #1e293b; padding: 20px 25px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 11px;">
                Emel ini dihantar secara automatik oleh Cloudflare Edge Functions • AISA UiTM Kampus Jasin, 77300 Merlimau, Melaka.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// 2. Template: Newsletter Subscriber Confirmation (HTML)
export function renderSubscriberEmailHtml(data: { email: string; topic: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pengesahan Langganan Buletin AISA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="550" style="max-width: 550px; background-color: #0f172a; border: 1px solid #06b6d4; border-radius: 16px; padding: 25px;">
          <tr>
            <td>
              <span style="color: #06b6d4; font-size: 11px; font-weight: bold; letter-spacing: 1px;">AISA UITM JASIN • BULETIN & NOTIS PINTAR</span>
              <h2 style="color: #ffffff; font-size: 18px; margin: 8px 0 12px;">Pengesahan Langganan Berjaya!</h2>
              <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                Terima kasih! Emel anda (<strong>${data.email}</strong>) kini telah didaftarkan dalam Cloudflare D1 untuk menerima kemas kini bagi topik:
              </p>
              <div style="background-color: #020617; border: 1px solid #1e293b; padding: 12px; border-radius: 8px; margin: 15px 0; color: #38bdf8; font-weight: bold; font-size: 13px;">
                📌 Topik: ${data.topic}
              </div>
              <p style="color: #94a3b8; font-size: 12px;">
                Anda akan menerima notis pertandingan, hackathon, dan bengkel terbuka terus ke peti masuk ini.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// 3. Template: Exco Broadcast Campaign Email (Supports 3 Designs)
export function renderBroadcastCampaignEmailHtml(campaign: {
  title: string;
  subject: string;
  content: string;
  date?: string;
  time?: string;
  location?: string;
  templateStyle?: 'uitm_official' | 'tech_summit' | 'urgent_alert';
  senderRole?: string;
  senderName?: string;
}): string {
  const style = campaign.templateStyle || 'tech_summit';

  // UiTM Royal Official Memorandum
  if (style === 'uitm_official') {
    return `
<!DOCTYPE html>
<html>
<body style="background-color: #f8fafc; font-family: serif; color: #1e293b; padding: 30px;">
  <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border: 2px solid #3b0764; padding: 35px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="text-align: center; border-bottom: 2px solid #3b0764; padding-bottom: 15px; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #3b0764; font-size: 18px; text-transform: uppercase;">UNIVERSITI TEKNOLOGI MARA CAWANGAN MELAKA KAMPUS JASIN</h2>
      <h3 style="margin: 4px 0 0; color: #6b21a8; font-size: 14px;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION (AISA)</h3>
      <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">Ruj: AISA/UiTM/2026/MEMO-${Date.now().toString().slice(-4)}</p>
    </div>

    <h3 style="font-size: 16px; color: #0f172a; border-left: 4px solid #3b0764; padding-left: 10px; margin-bottom: 15px;">
      ${campaign.title}
    </h3>

    <div style="font-size: 13px; line-height: 1.8; color: #334155; margin-bottom: 20px;">
      ${campaign.content.replace(/\n/g, '<br/>')}
    </div>

    ${campaign.date ? `
    <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; padding: 12px 16px; border-radius: 6px; font-size: 12px; margin-bottom: 20px;">
      <strong>Tarikh:</strong> ${campaign.date} | <strong>Masa:</strong> ${campaign.time || '10:00 AM'} | <strong>Tempat:</strong> ${campaign.location || 'Dewan Seminar / GMeet'}
    </div>
    ` : ''}

    <div style="margin-top: 30px; font-size: 12px;">
      <p style="margin: 0; font-weight: bold;">"USAHA, TAKWA, MULIA"</p>
      <p style="margin: 15px 0 0; color: #475569;">Yang Menjalankan Amanah,</p>
      <p style="margin: 4px 0 0; font-weight: bold; color: #1e1b4b;">${campaign.senderName || 'Barisan Majlis Tertinggi'}</p>
      <p style="margin: 0; color: #64748b;">${campaign.senderRole || 'AISA UiTM Melaka Kampus Jasin'}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Minimalist Urgent Alert
  if (style === 'urgent_alert') {
    return `
<!DOCTYPE html>
<html>
<body style="background-color: #020617; font-family: monospace; color: #f8fafc; padding: 25px;">
  <div style="max-width: 550px; margin: 0 auto; background: #0f172a; border: 1px solid #ef4444; padding: 25px; border-radius: 12px;">
    <div style="color: #ef4444; font-weight: bold; font-size: 12px; margin-bottom: 8px;">[PERINGATAN SEGERA / URGENT NOTIS]</div>
    <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 15px;">${campaign.title}</h2>
    <div style="font-size: 13px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
      ${campaign.content.replace(/\n/g, '<br/>')}
    </div>
    ${campaign.date ? `<div style="background: #1e293b; padding: 10px; font-size: 12px; color: #38bdf8;">Jadual: ${campaign.date} (${campaign.time || ''}) @ ${campaign.location || ''}</div>` : ''}
    <p style="color: #64748b; font-size: 11px; margin-top: 20px;">Dihantar oleh: ${campaign.senderRole || 'Exco AISA'}</p>
  </div>
</body>
</html>
    `;
  }

  // Default: Tech Summit Modern Card
  return `
<!DOCTYPE html>
<html>
<body style="background-color: #0b0f19; font-family: -apple-system, sans-serif; color: #f8fafc; padding: 25px;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #38bdf8; padding: 30px; border-radius: 16px;">
    <span style="color: #38bdf8; font-size: 11px; font-weight: bold; letter-spacing: 1px;">AISA LIVE EVENT BROADCAST</span>
    <h1 style="color: #ffffff; font-size: 22px; margin: 8px 0 15px;">${campaign.title}</h1>
    <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
      ${campaign.content.replace(/\n/g, '<br/>')}
    </div>
    ${campaign.date ? `
    <div style="background: linear-gradient(135deg, #1e1b4b, #0f172a); border: 1px solid #4f46e5; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
      <p style="margin: 0; color: #38bdf8; font-weight: bold; font-size: 13px;">📅 ${campaign.date} • ⏰ ${campaign.time || '8:30 PM'}</p>
      <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">📍 ${campaign.location || 'Dewan Al-Khawarizmi & Online'}</p>
    </div>
    ` : ''}
    <p style="color: #64748b; font-size: 11px; margin-top: 25px;">AISA UiTM Melaka Kampus Jasin • Edge Mail Delivery</p>
  </div>
</body>
</html>
  `;
}
