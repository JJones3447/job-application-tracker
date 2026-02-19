export default function mapInterviewErrors(details = []) {
  const fieldErrors = {};

  details.forEach(msg => {
    const lower = msg.toLowerCase();

    if (lower.includes('interview date')) {
      fieldErrors.interviewDate = msg;
    } else if (lower.includes('type')) {
      fieldErrors.interviewType = msg;
    } else if (lower.includes('result')) {
      fieldErrors.result = msg;
    } else if (lower.includes('notes')) {
      fieldErrors.interviewNotes = msg;
    } else {
      fieldErrors.general = msg;
    }
  });

  return fieldErrors;
}