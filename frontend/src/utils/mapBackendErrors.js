export default function mapBackendErrors(details = []) {
  const fieldErrors = {};

  details.forEach(msg => {
    const lower = msg.toLowerCase();

    if (lower.includes('company')) {
      fieldErrors.companyName = msg;
    } else if (lower.includes('job title')) {
      fieldErrors.jobTitle = msg;
    } else if (lower.includes('salary')) {
      fieldErrors.listedSalary = msg;
    } else if (lower.includes('location')) {
      fieldErrors.location = msg;
    } else if (lower.includes('technologies')) {
      fieldErrors.technologies = msg;
    } else if (lower.includes('url')) {
      fieldErrors.jobURL = msg;
    } else if (lower.includes('status')) {
      fieldErrors.status = msg;
    } else if (lower.includes('application date')) {
      fieldErrors.applicationDate = msg;
    } else {
      fieldErrors.general = msg;
    }
  });

  return fieldErrors;
}
