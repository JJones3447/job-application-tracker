export const formatDate = dateString => {
   if (!dateString || typeof dateString !== 'string') return '';

  const dateOnly = dateString.slice(0, 10);
  const parts = dateOnly.split('-');

  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  return `${month}/${day}/${year}`;
};

export const formatDateTime = isoString => {
  if (!isoString) return '';

  const date = new Date(isoString);

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(today.getDate()).padStart(2, '0')}`;
};