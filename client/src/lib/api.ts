// Tüm Yazıları veya Kategoriye Göre Yazıları Getir (Ana Fonksiyon) - Hata Yönetimiyle Güncellendi
export async function fetchPosts(category?: string): Promise<{ data: any[]; error: string | null }> {
  try {
    const endpoint = category 
      ? `${API_URL}/posts?category=${encodeURIComponent(category)}`
      : `${API_URL}/posts`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      console.error(`[API Error] Posts çekilemedi. Status: ${response.status}`);
      return { data: [], error: 'İçerikler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Yazılar çekilirken ağ/sunucu hatası oluştu:', error);
    return { data: [], error: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.' };
  }
}