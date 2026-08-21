const MONTH_MAP = {
  jan: 1, januari: 1, january: 1,
  feb: 2, februari: 2, february: 2,
  mar: 3, maret: 3, march: 3,
  apr: 4, april: 4,
  mei: 5, may: 5,
  jun: 6, juni: 6, june: 6,
  jul: 7, juli: 7, july: 7,
  agu: 8, agt: 8, agustus: 8, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oct: 10, oktober: 10, october: 10,
  nov: 11, nop: 11, november: 11,
  des: 12, dec: 12, desember: 12, december: 12,
};

export function parseDateDetails(str) {
  if (!str) return null;
  const s = str.trim().toLowerCase();
  const parts = s.split(/[\s,/-]+/);
  let month = 0;
  let year = 0;

  for (const p of parts) {
    if (/^\d{4}$/.test(p)) {
      year = parseInt(p, 10);
    } else if (MONTH_MAP[p] !== undefined) {
      month = MONTH_MAP[p];
    } else if (/^\d{1,2}$/.test(p)) {
      const num = parseInt(p, 10);
      if (num >= 1 && num <= 12 && month === 0) {
        month = num;
      }
    }
  }

  if (year === 0 && month === 0) return null;
  return { year, month: month || 1 };
}

export function parseSingleDate(str, isEnd = false) {
  if (!str) return 0;
  const s = str.trim().toLowerCase();
  if (['present', 'sekarang', 'saat ini', 'now', 'current'].includes(s)) {
    return 999999; // Represents ongoing / present date (highest priority)
  }

  const details = parseDateDetails(str);
  if (!details || !details.year) return 0;

  let { year, month } = details;
  if (isEnd && !month) {
    month = 12;
  }

  return year * 100 + (month || 1);
}

export function parsePeriod(periodStr) {
  if (!periodStr) return { start: 0, end: 0 };
  const raw = String(periodStr).trim();

  const splitMatch = raw.split(/\s*(?:-|–|—|to|s\/d|sd)\s*/i);

  if (splitMatch.length === 1) {
    const single = parseSingleDate(splitMatch[0], true);
    return { start: single, end: single };
  } else {
    let startPart = splitMatch[0];
    let endPart = splitMatch[1];

    if (!/\d{4}/.test(startPart) && /\d{4}/.test(endPart)) {
      const yearMatch = endPart.match(/\d{4}/);
      if (yearMatch) {
        startPart = `${startPart} ${yearMatch[0]}`;
      }
    }

    const start = parseSingleDate(startPart, false);
    const end = parseSingleDate(endPart, true);
    return { start, end };
  }
}

export function sortProjectsByEndDate(projects) {
  if (!Array.isArray(projects)) return [];
  return [...projects].sort((a, b) => {
    const periodA = parsePeriod(a.period);
    const periodB = parsePeriod(b.period);

    // Primary: End date descending (latest/present first)
    if (periodB.end !== periodA.end) {
      return periodB.end - periodA.end;
    }
    // Secondary: Start date descending (most recent start first)
    if (periodB.start !== periodA.start) {
      return periodB.start - periodA.start;
    }
    // Tertiary: Order ascending
    return (a.order || 0) - (b.order || 0);
  });
}

/**
 * Format total months into human-friendly duration (e.g. "1 mo", "2 mos", "1 yr", "1 yr 2 mos")
 */
export function formatDuration(totalMonths) {
  if (totalMonths <= 0) totalMonths = 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return months === 1 ? '1 mo' : `${months} mos`;
  }

  const yrStr = years === 1 ? '1 yr' : `${years} yrs`;
  if (months === 0) {
    return yrStr;
  }
  const moStr = months === 1 ? '1 mo' : `${months} mos`;
  return `${yrStr} ${moStr}`;
}

/**
 * Calculates dynamic duration for experience dates.
 * If date contains "Present" / "Sekarang" / "Saat ini", calculates real-time counting up to current month.
 * If closed date (e.g. "Jan 2026 - Jun 2026"), calculates duration or uses fallbackDuration.
 */
export function getExperienceDuration(dateStr, fallbackDuration) {
  if (!dateStr) return fallbackDuration || '';
  const raw = String(dateStr).trim();
  const isPresent = /\b(present|sekarang|saat ini|now|current)\b/i.test(raw);

  const splitMatch = raw.split(/\s*(?:-|–|—|to|s\/d|sd)\s*/i);

  if (splitMatch.length < 2 && !isPresent) {
    return fallbackDuration || '1 mo';
  }

  let startPart = splitMatch[0];
  let startObj = parseDateDetails(startPart);

  if (!startObj || !startObj.year) {
    return fallbackDuration || '';
  }

  let endYear, endMonth;
  if (isPresent) {
    const now = new Date();
    endYear = now.getFullYear();
    endMonth = now.getMonth() + 1; // 1-12
  } else {
    let endPart = splitMatch[1];
    if (!/\d{4}/.test(startPart) && /\d{4}/.test(endPart)) {
      const yearMatch = endPart.match(/\d{4}/);
      if (yearMatch) {
        startObj.year = parseInt(yearMatch[0], 10);
      }
    }
    const endObj = parseDateDetails(endPart);
    if (!endObj || !endObj.year) {
      return fallbackDuration || '';
    }
    endYear = endObj.year;
    endMonth = endObj.month || 12;
  }

  const diffMonths = (endYear - startObj.year) * 12 + (endMonth - startObj.month) + 1;
  const totalMonths = Math.max(1, diffMonths);
  return formatDuration(totalMonths);
}

/**
 * Sort experiences by date (Present / latest end date first)
 */
export function sortExperiencesByDate(experiences) {
  if (!Array.isArray(experiences)) return [];
  return [...experiences].sort((a, b) => {
    const periodA = parsePeriod(a.date || a.period);
    const periodB = parsePeriod(b.date || b.period);

    // Primary: End date descending (Present first)
    if (periodB.end !== periodA.end) {
      return periodB.end - periodA.end;
    }
    // Secondary: Start date descending
    if (periodB.start !== periodA.start) {
      return periodB.start - periodA.start;
    }
    // Tertiary: Order ascending
    return (a.order || 0) - (b.order || 0);
  });
}

const SHORT_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Converts "YYYY-MM" (e.g. "2026-07") to "Jul 2026"
 */
export function monthValueToDateStr(val) {
  if (!val) return '';
  const [year, month] = val.split('-');
  const mIndex = parseInt(month, 10) - 1;
  if (mIndex >= 0 && mIndex < 12) {
    return `${SHORT_MONTH_NAMES[mIndex]} ${year}`;
  }
  return val;
}

/**
 * Converts "Jul 2026" or "Juli 2026" to "YYYY-MM" (e.g. "2026-07")
 */
export function dateStrToMonthValue(str) {
  const details = parseDateDetails(str);
  if (!details || !details.year || !details.month) return '';
  const y = details.year;
  const m = String(details.month).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Parse an experience date string (e.g. "Jul 2026 - Present", "Jan 2026 - Jun 2026", "Jun 2026") into form state
 */
export function parseExperienceDateToForm(dateStr) {
  if (!dateStr) return { startMonth: '', isPresent: false, endMonth: '' };
  const isPresent = /\b(present|sekarang|saat ini|now|current)\b/i.test(dateStr);
  const parts = dateStr.split(/\s*(?:-|–|—|to|s\/d|sd)\s*/i);
  const startMonth = dateStrToMonthValue(parts[0] || '');
  let endMonth = '';
  if (!isPresent && parts.length > 1) {
    endMonth = dateStrToMonthValue(parts[1]);
  } else if (!isPresent) {
    endMonth = startMonth;
  }
  return { startMonth, isPresent, endMonth };
}

/**
 * Build a date string from startMonth ("2026-07"), endMonth ("2026-08"), and isPresent boolean
 */
export function buildExperienceDateStr(startMonth, endMonth, isPresent) {
  if (!startMonth) return '';
  const startStr = monthValueToDateStr(startMonth);
  if (isPresent) {
    return `${startStr} - Present`;
  }
  if (!endMonth || startMonth === endMonth) {
    return startStr;
  }
  const endStr = monthValueToDateStr(endMonth);
  return `${startStr} - ${endStr}`;
}


