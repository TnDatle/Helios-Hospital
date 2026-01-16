import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/news.css";

const NEWS_API = "http://localhost:5000/api/news";
const UPLOAD_API = "http://localhost:5000/api/upload";

function AdminNews() {
  /* ===============================
     FORM STATE
  ================================ */
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);

  /* ===============================
     LIST / FILTER / EDIT
  ================================ */
  const [newsList, setNewsList] = useState([]);
  const [filter, setFilter] = useState("all"); // all | published | draft
  const [editingId, setEditingId] = useState(null);

  /* ===============================
     FETCH NEWS
  ================================ */
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(NEWS_API);
      setNewsList(res.data);
    } catch (err) {
      console.error("Fetch news error", err);
    }
  };

   /* ===============================
     NORMALIZE CONTENT
  ================================ */
  const normalizeContent = (html) => {
  return html
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "")
    .map(line => {
      if (line.startsWith("<")) return line;
      return `<p>${line}</p>`;
    })
    .join("\n");
};


  /* ===============================
     UPLOAD IMAGE
  ================================ */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(UPLOAD_API, formData);
    return res.data.url;
  };

  /* ===============================
     INSERT IMAGE INTO CONTENT
  ================================ */
  const handleInsertImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setContent(
        (prev) => prev + `\n<img src="${imageUrl}" alt="image" />\n`
      );
    } catch {
      alert("Upload ảnh thất bại");
    }
  };

  /* ===============================
     CREATE / UPDATE NEWS
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !summary || !content) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      let thumbnailUrl = thumbnailPreview;
      if (thumbnail) {
        thumbnailUrl = await uploadImage(thumbnail);
      }

      const payload = {
        title,
        summary,
        content: normalizeContent(content),
        status,
        thumbnail: thumbnailUrl,
        authorId: "admin",
      };

      if (editingId) {
        await axios.put(`${NEWS_API}/${editingId}`, payload);
        alert("✏️ Đã cập nhật bài viết");
      } else {
        await axios.post(NEWS_API, payload);
        alert("✅ Đã tạo bài viết");
      }

      resetForm();
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setStatus("draft");
    setThumbnail(null);
    setThumbnailPreview("");
    setEditingId(null);
  };

  /* ===============================
     EDIT NEWS
  ================================ */
  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setSummary(item.summary);
    setContent(item.content);
    setStatus(item.status);
    setThumbnail(null);
    setThumbnailPreview(item.thumbnail || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===============================
     DELETE NEWS
  ================================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;

    try {
      await axios.delete(`${NEWS_API}/${id}`);
      fetchNews(); // reload list
      alert("Xóa bài viết thành công !");
    } catch (err) {
      console.error("FE DELETE ERROR:", err.response?.data || err);
      alert(" Xoá thất bại");
    }
  };

  /* ===============================
     TOGGLE STATUS
  ================================ */
  const toggleStatus = async (item) => {
    const newStatus =
      item.status === "published" ? "draft" : "published";

    try {
      await axios.patch(`${NEWS_API}/${item._id}`, {
        status: newStatus,
      });
      fetchNews();
    } catch {
      alert("❌ Không đổi được trạng thái");
    }
  };

  /* ===============================
     FILTERED LIST
  ================================ */
  const filteredNews =
    filter === "all"
      ? newsList
      : newsList.filter((n) => n.status === filter);

  return (
    <div className="admin-news">
      <h1>{editingId ? "✏️ Sửa bài viết" : "📝 Viết bài viết"}</h1>

      {/* ===== FORM ===== */}
      <form className="admin-news-form" onSubmit={handleSubmit}>
        <input
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Tóm tắt ngắn"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <div className="thumbnail-upload">
          <label>Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setThumbnail(file);
              if (file) {
                setThumbnailPreview(URL.createObjectURL(file));
              }
            }}
          />

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="preview"
              className="thumbnail-preview"
            />
          )}
        </div>

        <div className="content-editor">
          <label className="insert-image-btn">
            📷 Chèn ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleInsertImage}
            />
          </label>

          <textarea
            rows={12}
            placeholder="Nội dung bài viết (HTML)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Lưu nháp</option>
          <option value="published">Xuất bản</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading
            ? "Đang lưu..."
            : editingId
            ? "Cập nhật"
            : "Tạo bài viết"}
        </button>
      </form>

      {/* ===== FILTER ===== */}
      <div className="news-filter">
        <button onClick={() => setFilter("all")}>Tất cả</button>
        <button onClick={() => setFilter("published")}>Đã đăng</button>
        <button onClick={() => setFilter("draft")}>Nháp</button>
      </div>

      {/* ===== LIST ===== */}
      <div className="news-list">
        {filteredNews.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="news-item"
            >
            <img src={item.thumbnail || "/no-image.png"} alt="" />

            <div className="news-info">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>

              <span className={`status ${item.status}`}>
                {item.status === "published" ? "✅ Đã đăng" : "📝 Nháp"}
              </span>

              <div className="actions">
                <button onClick={() => toggleStatus(item)}>
                  🔄
                </button>
                <button onClick={() => handleEdit(item)}>
                  ✏️
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(item.id || item._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminNews;
