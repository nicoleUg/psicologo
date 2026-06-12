export function isValidMobilePhone(phone: string): boolean {
  const normalized = phone.replace(/\s/g, '');
  const phoneRegex = /^\+591[67]\d{7}$/;
  return phoneRegex.test(normalized);
}