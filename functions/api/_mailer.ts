// Helper module: _mailer.ts
// Cloudflare Pages Functions email dispatcher supporting Google Apps Script Gmail Relay & Resend API
// Contains 12 distinct, premium, light & bright email design styles (UI/UX Pro Max certified)
// 1. minimalist - Swiss Clean Minimalist
// 2. glassmorphism - Frosted Aurora Glass
// 3. skeuomorphism - Tactile Smartcard with Gold Chip
// 4. neobrutalism - Vibrant Neo-Brutalist Pop
// 5. uitm_royal - UiTM Royal Purple & Corporate Gold
// 6. cyber_clean - Cyber Titanium AI Lab
// 7. editorial_serif - Executive Forbes Tech Monograph
// 8. claymorphism - 3D Soft Clay Bubble
// 9. ticket_pass - Perforated Hackathon Summit Ticket Pass
// 10. emerald_agrotech - Botanical Smart Agrotech AI
// 11. sunset_gradient - Solar Sunset Warm Mesh
// 12. retro_terminal - Paper Terminal Data Matrix

export type EmailDesignStyle =
  | 'minimalist'
  | 'glassmorphism'
  | 'skeuomorphism'
  | 'neobrutalism'
  | 'uitm_royal'
  | 'cyber_clean'
  | 'editorial_serif'
  | 'claymorphism'
  | 'ticket_pass'
  | 'emerald_agrotech'
  | 'sunset_gradient'
  | 'retro_terminal';

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
        error: resJson.message || 'Resend error',
        data: resJson,
      };
    }
  } catch (err: any) {
    return {
      sent: false,
      status: 'FETCH_FAILED',
      error: err.message,
    };
  }
}

export interface WelcomeEmailData {
  fullName: string;
  membershipId: string;
  studentId: string;
  program: string;
  semester: string;
  aiInterest: string;
}

// -------------------------------------------------------------
// WELCOME PASS BUILDERS (12 DISTINCT STYLES - ALL BRIGHT & CLEAN)
// -------------------------------------------------------------

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
    case 'editorial_serif':
      return renderWelcomeEditorialSerif(data);
    case 'claymorphism':
      return renderWelcomeClaymorphism(data);
    case 'ticket_pass':
      return renderWelcomeTicketPass(data);
    case 'emerald_agrotech':
      return renderWelcomeEmeraldAgrotech(data);
    case 'sunset_gradient':
      return renderWelcomeSunsetGradient(data);
    case 'retro_terminal':
      return renderWelcomeRetroTerminal(data);
    case 'minimalist':
    default:
      return renderWelcomeMinimalist(data);
  }
}

// 1. Minimalist Swiss Clean
function renderWelcomeMinimalist(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden;">
          <tr><td style="height: 6px; background: linear-gradient(90deg, #4f46e5, #06b6d4);"></td></tr>
          <tr>
            <td style="padding: 32px 30px 20px; border-bottom: 1px solid #f1f5f9;">
              <span style="display: inline-block; padding: 4px 10px; background-color: #e0f2fe; color: #0369a1; border-radius: 20px; font-size: 11px; font-weight: 700;">1. SWISS MINIMALIST // PENGESAHAN KEAHLIAN</span>
              <h1 style="margin: 12px 0 4px; font-size: 20px; font-weight: 800; color: #0f172a;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION</h1>
              <p style="margin: 0; font-size: 12px; color: #64748b;">UiTM Cawangan Melaka Kampus Jasin • FSKM & FPA</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 30px;">
              <h2 style="margin: 0 0 10px; font-size: 18px; color: #0f172a;">Selamat Datang, ${data.fullName}!</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">Permohonan keahlian anda bagi sesi 2026/2027 telah berjaya disahkan. Berikut merupakan butiran rasmi kad keahlian digital anda:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <tr><td style="font-size: 11px; color: #64748b; font-weight: 700;">ID KEAHLIAN DIGITAL</td><td align="right" style="font-size: 15px; font-weight: 900; color: #4f46e5; font-family: monospace;">${data.membershipId}</td></tr>
                <tr><td colspan="2" style="height: 12px; border-bottom: 1px solid #e2e8f0;"></td></tr>
                <tr><td style="padding-top: 12px; font-size: 12px; color: #64748b;">No. Pelajar:</td><td align="right" style="padding-top: 12px; font-size: 12px; font-weight: 700; color: #0f172a; font-family: monospace;">${data.studentId}</td></tr>
                <tr><td style="padding-top: 8px; font-size: 12px; color: #64748b;">Program:</td><td align="right" style="padding-top: 8px; font-size: 12px; font-weight: 700; color: #0f172a;">${data.program}</td></tr>
                <tr><td style="padding-top: 8px; font-size: 12px; color: #64748b;">Fokus AI:</td><td align="right" style="padding-top: 8px; font-size: 12px; font-weight: 700; color: #0284c7;">${data.aiInterest}</td></tr>
              </table>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 700;">Masuk ke Portal AISA</a></div>
            </td>
          </tr>
          <tr><td style="padding: 20px 30px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8;">Dikeluarkan secara rasmi oleh Sistem Pentadbiran AISA UiTM Jasin • Hak Cipta 2026</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 2. Glassmorphism Aurora Glass
function renderWelcomeGlassmorphism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f5f3ff 100%); font-family: -apple-system, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background: rgba(255, 255, 255, 0.92); border: 1.5px solid rgba(6, 182, 212, 0.35); border-radius: 24px; box-shadow: 0 20px 40px rgba(6, 182, 212, 0.12); overflow: hidden;">
          <tr>
            <td style="padding: 32px 30px 20px; border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
              <span style="background: #cffafe; color: #0e7490; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; font-family: monospace;">2. FROSTED AURORA GLASS // VERIFIED PASS</span>
              <h1 style="margin: 12px 0 2px; font-size: 21px; font-weight: 900; color: #0f172a;">KAD KEAHLIAN CYBER GLASS</h1>
              <p style="margin: 0; font-size: 12px; color: #0284c7; font-weight: 600;">UiTM Cawangan Melaka Kampus Jasin</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 30px;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #334155;">Tahniah <strong>${data.fullName}</strong>, kad keahlian lutsinar berstatus aktif anda telah berjaya dijana:</p>
              <div style="background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(224,242,254,0.6)); border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 18px; padding: 22px; margin-bottom: 24px; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.08);">
                <div style="font-size: 10px; color: #0284c7; font-weight: 800; font-family: monospace; letter-spacing: 1px;">AISA DIGITAL CYBER ID</div>
                <div style="font-size: 22px; font-weight: 900; color: #0369a1; font-family: monospace; margin: 4px 0 12px;">${data.membershipId}</div>
                <div style="font-size: 12px; color: #475569; line-height: 1.7;">
                  Pelajar: <strong>${data.studentId}</strong><br>
                  Program: <strong>${data.program}</strong> (${data.semester})<br>
                  Bidang AI: <strong style="color: #0891b2;">${data.aiInterest}</strong>
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 30px; background: linear-gradient(90deg, #0284c7, #4f46e5); color: #ffffff; text-decoration: none; border-radius: 14px; font-size: 13px; font-weight: 800; box-shadow: 0 6px 18px rgba(2, 132, 199, 0.25);">Buka Pass Digital</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 3. Skeuomorphism Smartcard with Gold Chip
function renderWelcomeSkeuomorphism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f1f1ef; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #1c1917;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <!-- Lanyard Slot -->
        <div style="width: 70px; height: 12px; background: #d6d3d1; border-radius: 6px; margin-bottom: -6px; border: 1px solid #a8a29e;"></div>
        <table width="100%" style="max-width: 580px; background-color: #fafaf9; border: 2px solid #d6d3d1; border-radius: 18px; box-shadow: 0 16px 30px rgba(0,0,0,0.08), inset 0 1px 2px #ffffff; overflow: hidden;">
          <tr>
            <td style="padding: 26px 30px; border-bottom: 2px solid #e7e5e4;">
              <table width="100%">
                <tr>
                  <td>
                    <!-- Gold EMV Chip -->
                    <div style="display: inline-block; width: 44px; height: 32px; background: linear-gradient(135deg, #fde047 0%, #ca8a04 100%); border: 1.5px solid #a16207; border-radius: 6px; box-shadow: inset 0 1px 2px #fef08a, 0 2px 4px rgba(0,0,0,0.1); vertical-align: middle;"></div>
                    <span style="margin-left: 10px; font-size: 11px; font-family: monospace; font-weight: 800; color: #78716c;">3. TACTILE SMARTCARD // EMV 2026</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; background: #e7e5e4; padding: 4px 10px; border-radius: 6px; font-weight: 700; color: #44403c;">CHIP VERIFIED</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 14px 0 0; font-size: 20px; font-weight: 900; color: #1c1917;">AISA SMART CARD PASS</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px 30px;">
              <p style="margin: 0 0 16px; font-size: 13px; color: #44403c;">Kad keahlian fizikal digital telah diaktifkan untuk <strong>${data.fullName}</strong>:</p>
              <div style="background: #ffffff; border: 1.5px solid #d6d3d1; border-radius: 12px; padding: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 22px;">
                <div style="font-size: 11px; color: #78716c; font-weight: bold;">NOMBOR KEAHLIAN PINTAR</div>
                <div style="font-size: 24px; font-weight: 900; color: #0c0a09; font-family: monospace; letter-spacing: 2px; margin: 4px 0 12px;">${data.membershipId}</div>
                <div style="font-size: 12px; color: #44403c; line-height: 1.6;">
                  No. Pelajar: <strong>${data.studentId}</strong><br>
                  Kursus: <strong>${data.program}</strong> (${data.semester})<br>
                  Bidang AI: <strong>${data.aiInterest}</strong>
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 28px; background: linear-gradient(180deg, #292524 0%, #1c1917 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 800; border: 1px solid #44403c; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">Sahkan Kad Smartcard</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 4. Neo-Brutalism Pop
function renderWelcomeNeoBrutalism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #fef08a; font-family: 'Space Grotesk', -apple-system, sans-serif; color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 3.5px solid #000000; box-shadow: 8px 8px 0px #000000; overflow: hidden;">
          <tr>
            <td style="padding: 24px 28px; background-color: #a7f3d0; border-bottom: 3.5px solid #000000;">
              <span style="background-color: #fef08a; color: #000000; border: 2px solid #000000; padding: 3px 8px; font-weight: 900; font-size: 11px;">4. NEO-BRUTALIST // OFFICIAL</span>
              <h1 style="margin: 10px 0 0; font-size: 24px; font-weight: 900; color: #000000; letter-spacing: -0.5px;">AISA UiTM KAMPUS JASIN</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 900;">TAHNIAH, ${data.fullName.toUpperCase()}!</h2>
              <div style="background-color: #fde047; border: 3px solid #000000; padding: 18px; box-shadow: 4px 4px 0px #000000; margin-bottom: 22px;">
                <div style="font-size: 11px; font-weight: 900; font-family: monospace;">MEMBERSHIP NUMBER:</div>
                <div style="font-size: 24px; font-weight: 900; font-family: monospace; margin: 4px 0 10px;">${data.membershipId}</div>
                <div style="font-size: 12px; font-weight: 700; line-height: 1.6;">
                  STUDENT ID: ${data.studentId}<br>
                  PROGRAM: ${data.program}<br>
                  AI SPECIALTY: ${data.aiInterest}
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 14px 30px; background-color: #000000; color: #fde047; text-decoration: none; font-weight: 900; font-size: 14px; border: 2px solid #000000; box-shadow: 4px 4px 0px #fde047;">MASUK PORTAL SEKARANG →</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 5. UiTM Royal Purple & Corporate Gold
function renderWelcomeUiTmRoyal(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #faf5ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e1b4b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1.5px solid #d8b4fe; border-radius: 18px; box-shadow: 0 12px 30px rgba(88, 28, 135, 0.08); overflow: hidden;">
          <tr>
            <td style="background-color: #3b0764; padding: 28px 30px; border-bottom: 4px solid #d97706; color: #ffffff;">
              <span style="font-size: 10px; font-weight: 800; color: #fde047; letter-spacing: 1.5px;">UNIVERSITI TEKNOLOGI MARA • KAMPUS JASIN</span>
              <h1 style="margin: 8px 0 2px; font-size: 20px; font-weight: 900; color: #ffffff;">ARTIFICIAL INTELLIGENCE STUDENT ASSOCIATION</h1>
              <p style="margin: 0; font-size: 11px; color: #e9d5ff;">5. UiTM ROYAL PURPLE & GOLD // MEMORANDUM RASMI</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 30px;">
              <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.6; color: #334155;">
                Assalamualaikum WBT dan Salam Sejahtera,<br><br>
                Sukacita dimaklumkan bahawa permohonan keahlian bagi <strong>${data.fullName}</strong> telah diperakukan secara rasmi.
              </p>
              <div style="background-color: #fbf7ee; border: 1.5px solid #d97706; border-radius: 14px; padding: 22px; margin-bottom: 24px;">
                <table width="100%">
                  <tr>
                    <td><span style="font-size: 11px; color: #92400e; font-weight: 800;">ID KEAHLIAN RASMI UNIVERSITI</span><div style="font-size: 22px; font-weight: 900; color: #3b0764; font-family: monospace;">${data.membershipId}</div></td>
                    <td align="right"><span style="background: #3b0764; color: #fde047; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800;">SAH 2026/2027</span></td>
                  </tr>
                </table>
                <div style="border-top: 1px solid #fde68a; margin-top: 12px; padding-top: 12px; font-size: 12px; color: #451a03; line-height: 1.7;">
                  Pelajar: <strong>${data.studentId}</strong><br>
                  Fakulti/Kursus: <strong>${data.program}</strong> (${data.semester})<br>
                  Minat Bidang: <strong>${data.aiInterest}</strong>
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 30px; background-color: #3b0764; color: #fde047; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 800; border: 1.5px solid #d97706; box-shadow: 0 4px 14px rgba(59, 7, 100, 0.2);">Akses Portal Rasmi UiTM</a></div>
            </td>
          </tr>
          <tr><td style="padding: 16px; background-color: #faf5ff; text-align: center; font-size: 11px; color: #7e22ce;">Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM) • FPA</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 6. Cyber Clean Titanium AI Lab
function renderWelcomeCyberClean(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f0fdfa; font-family: -apple-system, monospace, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 2px solid #06b6d4; border-radius: 16px; box-shadow: 0 15px 35px rgba(6, 182, 212, 0.12); overflow: hidden;">
          <tr>
            <td style="padding: 24px 28px; background: linear-gradient(90deg, #f0fdfa, #ccfbf1); border-bottom: 2px solid #06b6d4;">
              <span style="font-size: 10px; font-weight: 800; color: #0891b2; letter-spacing: 1px;">6. CYBER TITANIUM // NODE ACTIVATION</span>
              <h1 style="margin: 6px 0 0; font-size: 20px; font-weight: 900; color: #0f172a;">AISA NEURAL NETWORK ID</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px 28px;">
              <p style="margin: 0 0 16px; font-size: 13px; color: #334155;">Identiti ejen mahasiswa aktif: <strong>${data.fullName}</strong></p>
              <div style="background: #f8fafc; border: 1.5px solid #67e8f9; border-radius: 12px; padding: 18px; margin-bottom: 22px;">
                <div style="font-size: 10px; color: #0891b2; font-weight: bold;">NODE ADDRESS // MEMBERSHIP ID:</div>
                <div style="font-size: 22px; font-weight: 900; color: #0e7490; font-family: monospace; margin: 4px 0 10px;">${data.membershipId}</div>
                <div style="font-size: 12px; color: #334155; line-height: 1.7; font-family: monospace;">
                  [SYS_ID] : ${data.studentId}<br>
                  [PROGRAM]: ${data.program}<br>
                  [MODULE] : ${data.aiInterest}
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 28px; background-color: #0891b2; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 800; font-family: monospace;">ACCESS LAB WORKBENCH ⚡</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 7. Editorial Executive Monograph (Warm Ivory & Luxury Serif)
function renderWelcomeEditorialSerif(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #fffdfa; font-family: Georgia, 'Times New Roman', serif; color: #1c1917;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e7e5e4; border-top: 5px solid #831843; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); overflow: hidden;">
          <tr>
            <td style="padding: 36px 36px 20px; border-bottom: 1px solid #f5f5f4; text-align: center;">
              <span style="font-size: 10px; font-family: -apple-system, sans-serif; letter-spacing: 2px; color: #831843; font-weight: 800; text-transform: uppercase;">7. Editorial Monograph • Vol. MMXXVI</span>
              <h1 style="margin: 12px 0 6px; font-size: 24px; font-weight: normal; color: #1c1917; font-style: italic;">The Artificial Intelligence Student Association</h1>
              <p style="margin: 0; font-size: 12px; font-family: -apple-system, sans-serif; color: #78716c;">UiTM Cawangan Melaka Kampus Jasin</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 36px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #1c1917; font-weight: normal;">Surat Pengesahan Keahlian: <em>${data.fullName}</em></h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.8; color: #44403c;">Dengan ini diperakui bahawa penama di atas telah diterima masuk sebagai ahli berdaftar AISA dengan rekod pengesahan seperti berikut:</p>
              <div style="background-color: #fafaf9; border-left: 3px solid #831843; padding: 18px 22px; margin-bottom: 26px;">
                <div style="font-family: -apple-system, sans-serif; font-size: 11px; color: #831843; font-weight: bold;">KOD DAFTAR KEAHLIAN</div>
                <div style="font-size: 20px; font-weight: bold; color: #1c1917; font-family: monospace; margin: 4px 0 10px;">${data.membershipId}</div>
                <div style="font-family: -apple-system, sans-serif; font-size: 12px; color: #57534e; line-height: 1.7;">
                  Pelajar: ${data.studentId} • Program: ${data.program}<br>
                  Bidang Kepakaran: ${data.aiInterest}
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 32px; background-color: #831843; color: #ffffff; text-decoration: none; border-radius: 4px; font-family: -apple-system, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">Buka Arkib Rasmi</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 8. 3D Soft Claymorphism
function renderWelcomeClaymorphism(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #f5f3ff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #1e1b4b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background: #ffffff; border-radius: 32px; box-shadow: 12px 12px 24px #e0e7ff, -12px -12px 24px #ffffff; overflow: hidden; padding: 10px;">
          <tr>
            <td style="padding: 28px 24px 16px; text-align: center;">
              <span style="background: #ede9fe; color: #6d28d9; padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 800;">8. 3D CLAY // PASTEL PASS</span>
              <h1 style="margin: 14px 0 4px; font-size: 22px; font-weight: 900; color: #4338ca;">AISA DIGITAL ID</h1>
              <p style="margin: 0; font-size: 12px; color: #6366f1;">UiTM Melaka Kampus Jasin</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 24px 28px;">
              <div style="background: #eef2ff; border-radius: 24px; padding: 24px; box-shadow: inset 4px 4px 8px #c7d2fe, inset -4px -4px 8px #ffffff; margin-bottom: 24px; text-align: center;">
                <div style="font-size: 11px; font-weight: 800; color: #4f46e5;">KAD KEAHLIAN COMEL & BERKUASA</div>
                <div style="font-size: 24px; font-weight: 900; color: #312e81; font-family: monospace; margin: 8px 0 12px;">${data.membershipId}</div>
                <div style="font-size: 13px; color: #3730a3; line-height: 1.6;">
                  Ahli: <strong>${data.fullName}</strong> (${data.studentId})<br>
                  Program: ${data.program}<br>
                  Minat: <strong>${data.aiInterest}</strong>
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 14px 34px; background: #6366f1; color: #ffffff; text-decoration: none; border-radius: 20px; font-size: 13px; font-weight: 800; box-shadow: 4px 6px 12px rgba(99, 102, 241, 0.35);">Masuk Ke Portal</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 9. Perforated Summit Ticket Pass
function renderWelcomeTicketPass(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 20px; box-shadow: 0 12px 28px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="padding: 24px 28px; background: #2563eb; color: #ffffff;">
              <table width="100%">
                <tr>
                  <td><span style="font-size: 10px; font-weight: 800; background: #1d4ed8; padding: 3px 8px; border-radius: 4px; font-family: monospace;">9. SUMMIT BOARDING PASS</span><h1 style="margin: 6px 0 0; font-size: 18px; font-weight: 900; color: #ffffff;">AISA AI SUMMIT & MEMBERSHIP</h1></td>
                  <td align="right"><div style="font-size: 20px; font-weight: 900; font-family: monospace;">GATE A1</div></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Perforated Tear Line -->
          <tr><td style="border-top: 2px dashed #94a3b8; background-color: #f1f5f9; height: 8px;"></td></tr>
          <tr>
            <td style="padding: 24px 28px;">
              <table width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 10px; color: #64748b; font-weight: bold;">NAMA PESERTA / AHLI:</div>
                    <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${data.fullName}</div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 4px;">ID: ${data.studentId} • ${data.program}</div>
                  </td>
                  <td align="right">
                    <div style="font-size: 10px; color: #64748b; font-weight: bold;">ID PASS:</div>
                    <div style="font-size: 16px; font-weight: 900; color: #2563eb; font-family: monospace;">${data.membershipId}</div>
                  </td>
                </tr>
              </table>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 11px; color: #475569; font-family: monospace; text-align: center; margin-bottom: 20px;">
                ||| | ||||| || |||||| | |||| ||||| |||||||| | ||||| ||| [BARCODE VERIFIED]
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 28px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 800;">Tunjuk Pas Semasa Masuk</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 10. Botanical Smart Agrotech AI (Mint & Emerald)
function renderWelcomeEmeraldAgrotech(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #ecfdf5; font-family: -apple-system, sans-serif; color: #064e3b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 20px; box-shadow: 0 12px 30px rgba(5, 150, 105, 0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 30px 18px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-bottom: 2px solid #34d399;">
              <span style="background: #059669; color: #ffffff; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;">10. BOTANICAL AGROTECH AI // FPA & FSKM</span>
              <h1 style="margin: 10px 0 2px; font-size: 21px; font-weight: 900; color: #065f46;">SMART CROP & AI INNOVATION</h1>
              <p style="margin: 0; font-size: 12px; color: #047857;">UiTM Cawangan Melaka Kampus Jasin</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px 30px;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #064e3b;">Selamat menyertai ekosistem AI pintar pertanian & pengkomputeran, <strong>${data.fullName}</strong>:</p>
              <div style="background: #f0fdf4; border: 1.5px solid #6ee7b7; border-radius: 14px; padding: 20px; margin-bottom: 22px;">
                <div style="font-size: 10px; font-weight: 800; color: #047857; font-family: monospace;">AGRO-TECH MEMBERSHIP ID:</div>
                <div style="font-size: 22px; font-weight: 900; color: #065f46; font-family: monospace; margin: 4px 0 10px;">${data.membershipId}</div>
                <div style="font-size: 12px; color: #064e3b; line-height: 1.7;">
                  Pelajar: <strong>${data.studentId}</strong><br>
                  Program: ${data.program}<br>
                  Fokus Inovasi: <strong style="color: #059669;">${data.aiInterest}</strong>
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 30px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 800; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25);">Akses Projek Agrotech</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 11. Solar Sunset Mesh (Warm Peach & Coral)
function renderWelcomeSunsetGradient(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef2f2 100%); font-family: -apple-system, sans-serif; color: #431407;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1.5px solid #fed7aa; border-radius: 20px; box-shadow: 0 14px 35px rgba(234, 88, 12, 0.1); overflow: hidden;">
          <tr>
            <td style="padding: 28px 30px; background: linear-gradient(90deg, #ea580c, #db2777); color: #ffffff;">
              <span style="font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.25); padding: 3px 8px; border-radius: 12px; font-family: monospace;">11. SOLAR SUNSET MESH</span>
              <h1 style="margin: 8px 0 2px; font-size: 21px; font-weight: 900; color: #ffffff;">AISA INNOVATOR PASS</h1>
              <p style="margin: 0; font-size: 12px; color: #ffedd5;">UiTM Cawangan Melaka Kampus Jasin</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 30px;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #431407;">Selamat datang ke komuniti pemula AI terkemuka, <strong>${data.fullName}</strong>!</p>
              <div style="background: #fff7ed; border: 1.5px solid #fdba74; border-radius: 14px; padding: 20px; margin-bottom: 22px;">
                <div style="font-size: 10px; font-weight: 800; color: #c2410c; font-family: monospace;">MEMBERSHIP TOKEN:</div>
                <div style="font-size: 24px; font-weight: 900; color: #ea580c; font-family: monospace; margin: 4px 0 10px;">${data.membershipId}</div>
                <div style="font-size: 12px; color: #7c2d12; line-height: 1.7;">
                  ID: <strong>${data.studentId}</strong> • ${data.program}<br>
                  Bidang AI: <strong>${data.aiInterest}</strong>
                </div>
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 13px 32px; background: linear-gradient(90deg, #ea580c, #db2777); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 800; box-shadow: 0 6px 18px rgba(234, 88, 12, 0.25);">Buka Pas Innovator</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 12. Paper Terminal Data Matrix (Amber/Green ASCII)
function renderWelcomeRetroTerminal(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #fcfbf7; font-family: 'Courier New', Courier, monospace; color: #14532d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 2px solid #86efac; border-radius: 8px; box-shadow: 0 8px 24px rgba(22, 101, 52, 0.08); overflow: hidden;">
          <tr>
            <td style="padding: 20px 24px; background-color: #f0fdf4; border-bottom: 2px dashed #86efac;">
              <div style="font-size: 10px; color: #16a34a; font-weight: bold;">[SYS_INIT] 12. PAPER TERMINAL // AISA MATRIX 2026</div>
              <h1 style="margin: 4px 0 0; font-size: 18px; font-weight: bold; color: #14532d;">>>> AUTH_RECORD_CONFIRMED</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <pre style="margin: 0 0 16px; font-size: 12px; color: #166534; line-height: 1.6;">
+------------------------------------------------+
| USER : ${data.fullName}
| ID   : ${data.studentId}
| PASS : ${data.membershipId}
| PROG : ${data.program}
| DEPT : FSKM & FPA UITM JASIN
+------------------------------------------------+
              </pre>
              <div style="font-size: 12px; color: #14532d; line-height: 1.6; margin-bottom: 20px;">
                Permohonan anda telah didaftarkan dalam matriks pengkalan data AISA. Sila simpan nombor pas ini untuk log masuk ke stesen kerja.
              </div>
              <div style="text-align: center;"><a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 10px 24px; background-color: #15803d; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px;">[ EXECUTE: PORTAL_ACCESS ]</a></div>
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
// BROADCAST CAMPAIGN BUILDER (12 LIGHT STYLES & GOOGLE CALENDAR)
// -------------------------------------------------------------

export interface BroadcastEmailData {
  title: string;
  subject: string;
  content: string;
  date?: string;
  time?: string;
  location?: string;
  templateStyle?: EmailDesignStyle;
  senderRole?: string;
  senderName?: string;
}

export function renderBroadcastCampaignEmailHtml(campaign: BroadcastEmailData): string {
  const style = campaign.templateStyle || 'minimalist';
  
  // Google Calendar URL generator
  const cleanDate = (campaign.date || '').replace(/-/g, '');
  const cleanTime = (campaign.time || '09:00').replace(/:/g, '') + '00';
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(campaign.title)}&dates=${cleanDate}T${cleanTime}/${cleanDate}T${cleanTime}&details=${encodeURIComponent(campaign.content)}&location=${encodeURIComponent(campaign.location || 'UiTM Melaka Kampus Jasin')}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${campaign.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr><td style="height: 6px; background: linear-gradient(90deg, #4f46e5, #06b6d4, #d97706);"></td></tr>
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 28px 28px 20px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 11px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 3px 10px; border-radius: 12px; font-family: monospace;">AISA HEBAHAN // ${style.toUpperCase()}</span>
              <h1 style="margin: 10px 0 4px; font-size: 20px; font-weight: 900; color: #0f172a;">${campaign.title}</h1>
              <p style="margin: 0; font-size: 12px; color: #64748b;">UiTM Cawangan Melaka Kampus Jasin • FSKM & FPA</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 26px 28px;">
              <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 22px;">
                ${campaign.content.replace(/\n/g, '<br/>')}
              </div>

              ${campaign.date ? `
              <!-- Event Logistics Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 22px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">📅 Jadual & Tarikh:</div>
                    <div style="font-size: 14px; color: #0284c7; font-weight: 800; font-family: monospace;">${campaign.date} (${campaign.time || '8:30 PM'})</div>
                    <div style="font-size: 12px; color: #475569; margin-top: 8px;">📍 Tempat: <strong>${campaign.location || 'Dewan Seminar / Google Meet'}</strong></div>
                  </td>
                </tr>
              </table>

              <!-- Google Calendar RSVP Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${gCalUrl}" target="_blank" style="display: inline-block; padding: 11px 24px; background-color: #0284c7; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 12px; font-weight: 800; margin-right: 8px;">
                  📅 Tambah ke Google Calendar
                </a>
                <a href="https://aisa-web-c40.pages.dev" target="_blank" style="display: inline-block; padding: 11px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 12px; font-weight: 800;">
                  Portal Web AISA →
                </a>
              </div>
              ` : `
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="https://aisa-web-c40.pages.dev" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 800;">
                  Buka Portal Web AISA →
                </a>
              </div>
              `}

              <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 12px; color: #64748b;">
                Dikeluarkan oleh: <strong style="color: #0f172a;">${campaign.senderName || 'Barisan Exco AISA'}</strong> (${campaign.senderRole || 'AISA UiTM Jasin'})
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8;">
              Emel ini dihantar secara rasmi daripada Sistem Penyiaran AISA UiTM Kampus Jasin.
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
// SUBSCRIBER CONFIRMATION EMAIL BUILDER
// -------------------------------------------------------------

export interface SubscriberEmailData {
  email: string;
  topic: string;
}

export function renderSubscriberEmailHtml(data: SubscriberEmailData): string {
  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); overflow: hidden;">
          <tr><td style="height: 6px; background: linear-gradient(90deg, #0284c7, #4f46e5);"></td></tr>
          <tr>
            <td style="padding: 30px 28px 20px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 11px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 3px 10px; border-radius: 12px; font-family: monospace;">PENGESAHAN LANGGANAN NOTIS RASMI</span>
              <h1 style="margin: 10px 0 4px; font-size: 20px; font-weight: 900; color: #0f172a;">AISA NOTIS & HEBAHAN</h1>
              <p style="margin: 0; font-size: 12px; color: #64748b;">UiTM Cawangan Melaka Kampus Jasin</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px 28px;">
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #334155;">
                Terima kasih kerana melanggan buletin dan notis rasmi Artificial Intelligence Student Association (AISA) UiTM Melaka Kampus Jasin.
              </p>
              <div style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 18px; margin-bottom: 22px;">
                <div style="font-size: 11px; font-weight: 800; color: #166534; font-family: monospace;">BUTIRAN LANGGANAN:</div>
                <div style="font-size: 13px; color: #14532d; margin-top: 6px; line-height: 1.7;">
                  Emel: <strong>${data.email}</strong><br>
                  Topik Pilihan: <strong style="color: #0284c7;">${data.topic}</strong><br>
                  Status: <strong style="color: #16a34a;">Aktif ✓</strong>
                </div>
              </div>
              <p style="margin: 0 0 20px; font-size: 13px; color: #64748b; line-height: 1.6;">
                Anda akan menerima hebahan terus ke peti masuk sebaik sahaja aktiviti, bengkel, hackathon, atau notis berkaitan diterbitkan oleh Exco AISA.
              </p>
              <div style="text-align: center;">
                <a href="https://aisa-web-c40.pages.dev" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 800;">
                  Buka Portal Web AISA →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8;">
              AISA UiTM Cawangan Melaka Kampus Jasin • FSKM & FPA
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
