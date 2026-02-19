export default function mapAuthErrors(details = []) {
  const fieldErrors = {};

  details.forEach(msg => {
    const lower = msg.toLowerCase();

    if (lower.includes('name')) {
      fieldErrors.name = msg;
    } else if (lower.includes('email')) {
      fieldErrors.email = msg;
    } else if (lower.includes('password')) {
      fieldErrors.password = msg;
    } else {
      fieldErrors.general = msg;
    }
  });

  return fieldErrors;
}
