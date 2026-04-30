export default function mapInterviewErrors(details = []) {
  const fieldErrors = {};

  details.forEach(message => {
    const lower = message.toLowerCase();

    if (lower.includes('interview date')) {
      fieldErrors.interviewDate = message;
      return;
    }
    if (lower.includes('type')) {
      fieldErrors.interviewType = message;
      return;
    }
    if (lower.includes('result')) {
      fieldErrors.result = message;
      return;
    }
    if (lower.includes('notes')) {
      fieldErrors.interviewNotes = message;
      return;
    }

    fieldErrors.general = message;
  });

  return fieldErrors;
}