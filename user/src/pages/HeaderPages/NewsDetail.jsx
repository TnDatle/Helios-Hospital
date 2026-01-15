import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/news-detail.css";

const API = "http://localhost:5000/api";

function NewsDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/news/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (!post) return <p>Bài viết không tồn tại</p>;

  return (
    <div className="news-detail">
      <h1>{post.title}</h1>

      <span className="news-date">
        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
      </span>

      <img src={post.thumbnail} alt={post.title} />

      {/* Nội dung bài */}
      <div
        className="news-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}

export default NewsDetail;
