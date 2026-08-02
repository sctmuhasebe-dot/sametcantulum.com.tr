var API_URL = "http://localhost:5000/api".replace(/\/+$/, "");
async function fetchPosts(category) {
	try {
		const endpoint = category ? `${API_URL}/posts?category=${encodeURIComponent(category)}` : `${API_URL}/posts`;
		const response = await fetch(endpoint);
		if (!response.ok) {
			console.error(`[API Error] Posts çekilemedi. Status: ${response.status}`);
			return [];
		}
		return await response.json();
	} catch (error) {
		console.error("Yazılar çekilirken ağ/sunucu hatası oluştu:", error);
		return [];
	}
}
async function getPosts(category) {
	return fetchPosts(category);
}
async function fetchPostBySlug(slug) {
	try {
		const response = await fetch(`${API_URL}/posts/${slug}`);
		const data = await response.json();
		if (!response.ok) throw new Error(data.message || `Yazı bulunamadı (Status: ${response.status})`);
		return data;
	} catch (error) {
		console.error(`Post (${slug}) çekilirken hata:`, error);
		return null;
	}
}
//#endregion
export { getPosts as i, fetchPostBySlug as n, fetchPosts as r, API_URL as t };
