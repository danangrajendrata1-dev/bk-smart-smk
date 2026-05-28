export function buildWaLink(number?: string | null, message?: string | null) {
  if (!number) return null;
  let digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  }
  if (!digits.startsWith("62")) {
    digits = `62${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message ?? "")}`;
}
