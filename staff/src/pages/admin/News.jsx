import { useState } from "react";
import axios from "axios";
import "../../styles/admin/news.css";

const NEWS_API = "http://localhost:5000/api/news";
const UPLOAD_API = "http://localhost:5000/api/upload";

function AdminNews() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);

  /* ===============================
     UPLOAD ẢNH (DÙNG CHUNG)
  ================================ */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(UPLOAD_API, formData);

    return res.data.url;
  };

  /* ===============================
     CHÈN ẢNH VÀO NỘI DUNG
  ================================ */
  const handleInsertImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);

      // chèn ảnh vào cuối content
      setContent((prev) =>
        prev + `\n<img src="${imageUrl}" alt="image" />\n`
      );
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    }
  };

  /* ===============================
     SUBMIT BÀI VIẾT
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !summary || !content) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      let thumbnailUrl = "";
      if (thumbnail) {
        thumbnailUrl = await uploadImage(thumbnail);
      }

      await axios.post(NEWS_API, {
        title,
        summary,
        content,
        status,
        thumbnail: thumbnailUrl,
        authorId: "admin",
      });

      alert("Đã thêm bài viết");

      // reset
      setTitle("");
      setSummary("");
      setContent("");
      setStatus("draft");
      setThumbnail(null);
      setThumbnailPreview("");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-news">
      <h1>Viết bài viết</h1>

      <form className="admin-news-form" onSubmit={handleSubmit}>
        {/* ===== TITLE ===== */}
        <input
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ===== SUMMARY ===== */}
        <textarea
          placeholder="Tóm tắt ngắn"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {/* ===== THUMBNAIL ===== */}
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

        {/* ===== CONTENT ===== */}
        <div className="content-editor">
          <div className="editor-toolbar">
            <label className="insert-image-btn">
              📷 Chèn ảnh vào bài
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleInsertImage}
              />
            </label>
          </div>

          <textarea
            rows={12}
            placeholder="Nội dung bài viết (HTML)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* ===== STATUS ===== */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Lưu nháp</option>
          <option value="published">Xuất bản</option>
        </select>

        {/* ===== SUBMIT ===== */}
        <button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu bài viết"}
        </button>
      </form>
    </div>
  );
}

export default AdminNews;
