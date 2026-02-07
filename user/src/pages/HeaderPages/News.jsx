import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/news`) // chỉ trả bài published
      .then((res) => setNews(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải tin tức...</p>;

  return (
    <div className="news-container">
      <h2 className="news-title">TIN TỨC & THÔNG BÁO</h2>

      <div className="news-list">
        {news.map((item) => (
          <div className="news-card" key={item.id}>
            <img src={item.thumbnail} alt={item.title} />

            <div className="news-content">
              <span className="news-date">
                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
              </span>

              <h3>{item.title}</h3>
              <p>{item.summary}</p>

              {/*  TRUYỀN SLUG */}
              <Link to={`/tin-tuc/${item.slug}`}>
                <button className="btnRead">Đọc bài</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
