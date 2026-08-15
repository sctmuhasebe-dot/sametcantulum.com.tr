/**
 * Türkçe karakterleri normalize ederek metni URL uyumlu (slug) formata dönüştürür.
 * @param text Dönüştürülecek ham metin
 * @returns SEO dostu slug string
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/[^a-z0-9 -]/g, '') // Harf, rakam, boşluk ve tire dışındakileri temizle
    .replace(/\s+/g, '-')       // Boşlukları tire ile değiştir
    .replace(/-+/g, '-');       // Art arda gelen tireleri teke düşür
}

/**
 * Tarih nesnesini veya stringini okunabilir TR formatına (GG.AA.YYYY) çevirir.
 */
export function formatDate(dateInput: string | Date): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}