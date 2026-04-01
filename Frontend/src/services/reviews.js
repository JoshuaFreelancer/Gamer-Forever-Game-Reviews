import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const REVIEWS_COLLECTION = "game_reviews";

const mapReviewError = (error) => {
  const code = error?.code;

  if (code === "permission-denied") {
    return "No tienes permisos para esta acción. Inicia sesión de nuevo e inténtalo.";
  }

  if (code === "unauthenticated") {
    return "Tu sesión expiró. Inicia sesión otra vez para publicar reseñas.";
  }

  if (code === "unavailable") {
    return "Firestore no está disponible en este momento. Intenta nuevamente en unos segundos.";
  }

  if (code === "failed-precondition") {
    return "Falta un índice de Firestore para esta consulta. Revisa la configuración de índices.";
  }

  return "No se pudo completar la operación de reseñas. Intenta nuevamente.";
};

const toReviewModel = (snapshot) => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || null,
  };
};

export const getReviewId = (gameId, uid) => `${gameId}_${uid}`;

export const getGameReviews = async (gameId) => {
  const reviewsRef = collection(db, REVIEWS_COLLECTION);

  // Limitar resultados reduce tiempo de red y render en listados largos.
  const reviewsQuery = query(
    reviewsRef,
    where("gameId", "==", String(gameId)),
    where("status", "==", "published"),
    orderBy("updatedAt", "desc"),
    limit(60),
  );

  try {
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map(toReviewModel);
  } catch (error) {
    throw new Error(mapReviewError(error));
  }
};

export const upsertGameReview = async ({
  gameId,
  gameName,
  rating,
  comment,
  user,
}) => {
  try {
    const reviewId = getReviewId(gameId, user.uid);
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    const existing = await getDoc(reviewRef);

    const basePayload = {
      gameId: String(gameId),
      gameName: gameName || "Juego",
      uid: user.uid,
      authorName: user.displayName || user.email?.split("@")[0] || "Jugador",
      authorEmail: user.email || null,
      rating: Number(rating),
      comment: String(comment).trim(),
      status: "published",
      updatedAt: serverTimestamp(),
    };

    if (existing.exists()) {
      await setDoc(reviewRef, basePayload, { merge: true });
      return reviewId;
    }

    await setDoc(reviewRef, {
      ...basePayload,
      createdAt: serverTimestamp(),
    });

    return reviewId;
  } catch (error) {
    throw new Error(mapReviewError(error));
  }
};

export const deleteGameReview = async ({ gameId, uid }) => {
  try {
    const reviewId = getReviewId(gameId, uid);
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    throw new Error(mapReviewError(error));
  }
};
