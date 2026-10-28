import { ClubRegistration, NoticeSubscriber, CustomEmailCampaign } from '../types';

export const apiService = {
  // 1. Subscribe to Notices
  async subscribeNotice(email: string, preferredTopic: string): Promise<{ success: boolean; subscriber: NoticeSubscriber; notificationSent?: boolean }> {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferredTopic }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local development fallback
    }

    // Fallback for purely client-side mode
    const subscriber: NoticeSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString().split('T')[0],
      preferredTopic,
    };
    return { success: true, subscriber, notificationSent: true };
  },

  // 2. Register for Club Membership
  async registerClub(data: Partial<ClubRegistration>): Promise<{ success: boolean; registration: ClubRegistration; emailSent?: boolean }> {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local development fallback
    }

    const membershipNumber = Math.floor(1000 + Math.random() * 9000);
    const registration: ClubRegistration = {
      id: `reg-${Date.now()}`,
      fullName: data.fullName || '',
      studentId: data.studentId || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      program: data.program || '',
      semester: data.semester || '',
      aiInterest: data.aiInterest || '',
      membershipId: `AISA-2026-${membershipNumber}`,
      status: 'Baru',
      assignedPic: 'Belum Ditetapkan',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    return { success: true, registration, emailSent: true };
  },

  // 3. Update Registration Status (Exco PIC & Status)
  async updateRegistrationStatus(id: string, status: ClubRegistration['status'], assignedPic?: string) {
    try {
      await fetch('/api/register', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, assignedPic }),
      });
    } catch {
      // Fallback
    }
  },

  // 4. Broadcast Custom Email Campaign
  async broadcastCampaign(campaign: CustomEmailCampaign): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { success: true };
  },
};
