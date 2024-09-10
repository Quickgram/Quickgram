export function convertTimestampToReadableFormatForAnnouncements(
  timestamp: string
): string {
  const parsedTimestamp = parseInt(timestamp, 10);
  if (isNaN(parsedTimestamp)) {
    return "N/A";
  }

  const date = new Date(parsedTimestamp);
  if (isNaN(date.getTime())) {
    return "N/A";
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: userTimezone,
  };
  return date.toLocaleString("en-GB", options).replace(",", "");
}
