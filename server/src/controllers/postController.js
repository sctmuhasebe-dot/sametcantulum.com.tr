// server/src/controllers/postController.js
import pool from '../config/db.js';
import { postSchema } from '../schemas/postSchemas.js';

// Tüm yazıları getir (Liste görünümü için ağır 'content' alanı hariç tutuldu)
export const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, slug, excerpt, category, created_at, updated_at FROM posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Yazılar çekilirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Slug'a göre tek yazı getir (Detay sayfasında tam içeriğe ihtiyaç duyulduğu için content dahil edilir)
export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, title, slug, content, category, excerpt, created_at, updated_at FROM posts WHERE slug = $1',
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Yazı detayı çekilirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yeni yazı oluştur (Admin)
export const createPost = async (req, res) => {
  const validationResult = postSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Geçersiz veri girişi.',
      errors: validationResult.error.errors.map(err => err.message)
    });
  }

  const { title, slug, content, category, excerpt } = validationResult.data;

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, slug, content, category, excerpt) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, slug, content, category, excerpt, created_at, updated_at',
      [title, slug, content, category || 'Genel', excerpt || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Yazı eklenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası', detail: error.message });
  }
};

// Yazı güncelle (Admin)
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const validationResult = postSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Geçersiz veri girişi.',
      errors: validationResult.error.errors.map(err => err.message)
    });
  }

  const { title, slug, content, category, excerpt } = validationResult.data;

  try {
    const result = await pool.query(
      'UPDATE posts SET title = $1, slug = $2, content = $3, category = $4, excerpt = $5 WHERE id = $6 RETURNING id, title, slug, content, category, excerpt, created_at, updated_at',
      [title, slug, content, category || 'Genel', excerpt || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Güncellenecek yazı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Yazı güncellenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası', detail: error.message });
  }
};

// Yazı sil (Admin)
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Silinecek yazı bulunamadı' });
    }
    res.json({ message: 'Yazı başarıyla silindi' });
  } catch (error) {
    console.error('Yazı silinirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};