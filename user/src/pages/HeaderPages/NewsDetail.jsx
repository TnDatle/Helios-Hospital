import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/news-detail.css";

const API = "http://localhost:5000/api";

function NewsDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (value) => {
    return new Date(value).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API}/news/${slug}`);
        setPost(res.data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (!post) return <p>Bài viết không tồn tại</p>;

  return (
    <article className="news-detail">
      {/* ===== TITLE ===== */}
      <h1 className="news-title">{post.title}</h1>

      {/* ===== META ===== */}
      <div className="news-meta">
        {post.createdAt && (
          <span> {formatDateTime(post.createdAt)}  <span> - Thành phố Hồ Chí Minh</span></span>
        )}
      </div>

      {/* ===== THUMBNAIL ===== */}
      {post.thumbnail && (
        <div className="news-thumbnail">
          <img src={post.thumbnail} alt={post.title} />
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div
        className="news-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export default NewsDetail;
