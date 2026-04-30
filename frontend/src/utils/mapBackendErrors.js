export default function mapBackendErrors(details = []) {
  const fieldErrors = {};

  details.forEach(message => {
    const lower = message.toLowerCase();

    if (lower.includes('company')) {
      fieldErrors.companyName = message;
      return;
    }
    if (lower.includes('job title')) {
      fieldErrors.jobTitle = message;
      return;
    }
    if (lower.includes('salary')) {
      fieldErrors.listedSalary = message;
      return;
    }
    if (lower.includes('location')) {
      fieldErrors.location = message;
      return;
    }
    if (lower.includes('technologies')) {
      fieldErrors.technologies = message;
      return;
    }
    if (lower.includes('url')) {
      fieldErrors.jobURL = message;
      return;
    }
    if (lower.includes('application date')) {
      fieldErrors.applicationDate = message;
      return;
    }
    if (lower.includes('status')) {
      fieldErrors.status = message;
      return;
    }
    if (lower.includes('notes')) {
      fieldErrors.notes = message;
      return;
    }

    fieldErrors.general = message;
  });

  return fieldErrors;
}