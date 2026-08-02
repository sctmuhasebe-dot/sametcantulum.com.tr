import express from 'express';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Genel erişime açık rotalar
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Korumalı (Yalnızca giriş yapmış kullanıcılar) rotalar
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;