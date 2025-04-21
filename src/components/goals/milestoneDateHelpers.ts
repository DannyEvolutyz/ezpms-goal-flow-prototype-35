
export function parseMilestoneTargetDate(date: unknown): Date | undefined {
  if (!date) return undefined;
  if (date instanceof Date) return date;
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.valueOf()) ? undefined : parsed;
  }
  return undefined;
}
