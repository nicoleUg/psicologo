export function isValidMobilePhone(phone: string): boolean {
  const normalized = phone.replace(/\s/g, '');
  const phoneRegex = /^\+591[67]\d{7}$/;
  return phoneRegex.test(normalized);
}
export function isValidFullName(name: string): boolean {
  if (!name) return false;
  const words = name.trim().split(/\s+/);
  return words.length >= 2;
}