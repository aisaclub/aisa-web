// Reusable Malay date formatter & Google Calendar generator utility
// Automatically extracts Hari/Day, Tarikh, Bulan (Huruf), dan Tahun from any date string

export const DAYS_MELAYU = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'] as const;

export const MONTHS_MELAYU = [
  'Januari',
  'Februari',
  'Mac',
  'April',
  'Mei',
  'Jun',
  'Julai',
  'Ogos',
  'September',
  'Oktober',
  'November',
  'Disember',
] as const;

export interface FormattedDateMalay {
  dayName: string;      // cth: Jumaat
  dayNumber: string;    // cth: 14
  monthName: string;    // cth: November
  year: string;         // cth: 2026
  fullFormatted: string;// cth: Jumaat, 14 November 2026
  shortFormatted: string;// cth: 14 Nov 2026
}

export function formatMalayDate(dateInput?: string): FormattedDateMalay {
  if (!dateInput || !dateInput.trim()) {
    return {
      dayName: 'Tarikh Belum Dipilih',
      dayNumber: '--',
      monthName: '--',
      year: '----',
      fullFormatted: 'Tarikh belum ditetapkan',
      shortFormatted: '--',
    };
  }

  // Handle standard YYYY-MM-DD or ISO strings
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) {
    return {
      dayName: '',
      dayNumber: '',
      monthName: '',
      year: '',
      fullFormatted: dateInput,
      shortFormatted: dateInput,
    };
  }

  const dayName = DAYS_MELAYU[dateObj.getDay()];
  const dayNumber = dateObj.getDate().toString();
  const monthName = MONTHS_MELAYU[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString();
  const shortMonth = monthName.substring(0, 3);

  return {
    dayName,
    dayNumber,
    monthName,
    year,
    fullFormatted: `${dayName}, ${dayNumber} ${monthName} ${year}`,
    shortFormatted: `${dayNumber} ${shortMonth} ${year}`,
  };
}

// Generate Google Calendar Link for Event
export function generateGoogleCalendarUrl(options: {
  title: string;
  description: string;
  location?: string;
  startDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
}): string {
  const { title, description, location = 'UiTM Cawangan Melaka Kampus Jasin', startDate, startTime = '09:00' } = options;

  if (!startDate) return 'https://calendar.google.com';

  const cleanDate = startDate.replace(/-/g, '');
  const cleanTime = startTime.replace(/:/g, '') + '00';
  
  // Default 2 hour duration
  const startIso = `${cleanDate}T${cleanTime}`;
  
  // Calculate end time
  const [h, m] = startTime.split(':').map(Number);
  const endHour = (h + 2) % 24;
  const endHourStr = (endHour < 10 ? '0' : '') + endHour;
  const endIso = `${cleanDate}T${endHourStr}${m < 10 ? '0' : ''}${m || 0}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startIso}/${endIso}`,
    details: description,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
