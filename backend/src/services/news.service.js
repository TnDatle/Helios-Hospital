import slugify from "slugify";
import { db, FieldValue } from "../config/firebase.js";

export const createNews = async ({
  title,
  summary,
  content,
  status,
  thumbnail,  
  authorId,
}) => {
  if (!title || !summary || !content) {
    throw new Error("Missing data");
  }

  const slug = slugify(title, {
    lower: true,
    strict: true,
    locale: "vi",
  });

  const docRef = await db.collection("News").add({
    title,
    slug,
    summary,
    content,
    status,
    thumbnail,
    authorId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: docRef.id };
};


export const getAllPublishedNews = async () => {
  const snap = await db
    .collection("News")
    .where("status", "==", "published")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : null,
    };
  });
};

export const getNewsBySlug = async (slug) => {
  const snap = await db
    .collection("news")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate
      ? data.createdAt.toDate()
      : null,
  };
};