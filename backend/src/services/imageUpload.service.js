import axios from "axios";
import FormData from "form-data";

export const uploadImage = async (fileBuffer, fileName) => {
  const form = new FormData();
  form.append("source", fileBuffer, { filename: fileName });
  form.append("action", "upload");

  const apiKey = process.env.FREEIMAGE_API_KEY;

  const res = await axios.post(
    `https://freeimage.host/api/1/upload?key=${apiKey}`,
    form,
    { headers: form.getHeaders() }
  );

  if (!res.data?.image?.display_url) {
    throw new Error("Upload image failed");
  }

  return res.data.image.display_url;
};
