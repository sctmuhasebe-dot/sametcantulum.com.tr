// client/src/lib/api.ts

// API URL'sinin sonunda fazladan / veya /api kalmamasını garantiye alıyoruz
const RAW_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000/api';
export const API_URL = RAW_URL.replace(/\/+$/, ''); // 🚀 Dışarı aktarıldı

// 🔒 Tarayıcılar arası çerezlerin (httpOnly cookie) güvenle taşınması için şarttır
const defaultOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Giriş İsteği (Login)
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    ...defaultOptions,
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Giriş yapılırken bir hata oluştu.');
  }

  if (typeof window !== 'undefined' && data.user) {
    localStorage.setItem('adminUser', JSON.stringify(data.user));
  }

  return data;
}

// Oturum Açılmış mı Kontrolü (Client tarafı temel kontrol)
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('adminUser');
}

// Çıkış Yap (Logout)
export async function logoutUser() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      ...defaultOptions,
    });
  } catch (error) {
    console.error('Çıkış yapılırken ağ hatası:', error);
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminUser');
    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
    window.location.href = '/admin/login';
  }
}

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

// Hata alan sayfalar için getPosts alias'ı
export async function getPosts(category?: string) {
  const result = await fetchPosts(category);
  return result.data;
}

// Tek Bir Yazıyı Slug İle Getir (Detay Sayfası İçin)
export async function fetchPostBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/posts/${slug}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Yazı bulunamadı (Status: ${response.status})`);
    }

    return data;
  } catch (error) {
    console.error(`Post (${slug}) çekilirken hata:`, error);
    return null;
  }
}

// Yeni Yazı Ekle (Cookie Korumalı)
export async function createPost(postData: any) {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    ...defaultOptions,
    body: JSON.stringify(postData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Yazı eklenirken bir hata oluştu.');
  return data;
}

// Yazı Güncelle (Cookie Korumalı)
export async function updatePost(id: string | number, postData: any) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    ...defaultOptions,
    body: JSON.stringify(postData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Yazı güncellenirken bir hata oluştu.');
  return data;
}

// Yazı Sil (Cookie Korumalı)
export async function deletePost(id: string | number) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    ...defaultOptions,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Yazı silinemedi.');
  }
  return true;
}