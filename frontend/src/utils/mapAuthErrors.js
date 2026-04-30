export default function mapAuthErrors(details = []) {
  const fieldErrors = {};

  details.forEach(message => {
    const lower = message.toLowerCase();

    if (lower.includes('name')) {
      fieldErrors.name = message;
      return;
    }
    if (lower.includes('email')) {
      fieldErrors.email = message;
      return;
    }
    if (lower.includes('password')) {
      fieldErrors.password = message;
      return;
    }

    fieldErrors.general = message;
  });

  return fieldErrors;
}
