import * as NewsService from "../services/news.service.js";
import {
  getAllPublishedNews,
  getNewsBySlug,
} from "../services/news.service.js";

export const createNews = async (req, res) => {
  try {
    const news = await NewsService.createNews(req.body);
    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create news failed" });
  }
};

// GET /api/news
export const getAllNews = async (req, res) => {
  try {
    const news = await getAllPublishedNews();
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách tin tức" });
  }
};

// GET /api/news/:slug
export const getNewsDetail = async (req, res) => {
  try {
    const post = await getNewsBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy bài viết" });
  }
};