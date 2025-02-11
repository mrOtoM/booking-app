export enum DateFormatType {
  UNDERSCORE_DMY = 'DD_MM_YYYY',
  UNDERSCORE_MY = 'MM_YYYY',
  DOT_DMY = 'DD.MM.YYYY',
}

export function formatDate(dateStr: string, type: DateFormatType): string {
  const parts = dateStr.split(/[-_.]/);
  if (parts.length !== 3) {
    return dateStr;
  }

  const [day, month, year] = parts.map(Number);

  const dayStr = String(day).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);

  if (type === DateFormatType.UNDERSCORE_MY) {
    return `${monthStr}_${yearStr}`;
  }

  if (type === DateFormatType.UNDERSCORE_DMY) {
    return `${dayStr}_${monthStr}_${yearStr}`;
  }

  if (type === DateFormatType.DOT_DMY) {
    return `${dayStr}.${monthStr}.${yearStr}`;
  }

  return '';
}
