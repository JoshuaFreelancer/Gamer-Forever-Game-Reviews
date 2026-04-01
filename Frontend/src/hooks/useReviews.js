import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReviewId,
  deleteGameReview,
  getGameReviews,
  upsertGameReview,
} from "../services/reviews";

export const useGameReviews = (gameId) => {
  return useQuery({
    queryKey: ["gameReviews", String(gameId)],
    queryFn: () => getGameReviews(gameId),
    enabled: Boolean(gameId),
    // Mantener datos frescos por más tiempo evita recargas visibles al navegar.
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useUpsertReview = (gameId) => {
  const queryClient = useQueryClient();
  const queryKey = ["gameReviews", String(gameId)];

  return useMutation({
    mutationFn: (payload) => upsertGameReview(payload),
    // Optimistic update: actualizamos UI antes de esperar la red.
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReviews = queryClient.getQueryData(queryKey) || [];
      const optimisticId = getReviewId(payload.gameId, payload.user.uid);
      const nowIso = new Date().toISOString();

      const optimisticReview = {
        id: optimisticId,
        gameId: String(payload.gameId),
        gameName: payload.gameName || "Juego",
        uid: payload.user.uid,
        authorName: payload.user.displayName || payload.user.email?.split("@")[0] || "Jugador",
        authorEmail: payload.user.email || null,
        rating: Number(payload.rating),
        comment: String(payload.comment).trim(),
        status: "published",
        createdAt:
          previousReviews.find((review) => review.id === optimisticId)?.createdAt || nowIso,
        updatedAt: nowIso,
      };

      const nextReviews = [
        optimisticReview,
        ...previousReviews.filter((review) => review.id !== optimisticId),
      ];

      queryClient.setQueryData(queryKey, nextReviews);

      return { previousReviews };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteReview = (gameId) => {
  const queryClient = useQueryClient();
  const queryKey = ["gameReviews", String(gameId)];

  return useMutation({
    mutationFn: (payload) => deleteGameReview(payload),
    // Optimistic delete para respuesta inmediata de interfaz.
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReviews = queryClient.getQueryData(queryKey) || [];
      const deletedReviewId = getReviewId(payload.gameId, payload.uid);

      queryClient.setQueryData(
        queryKey,
        previousReviews.filter((review) => review.id !== deletedReviewId),
      );

      return { previousReviews };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useReviewsSummary = (reviews = []) => {
  return useMemo(() => {
    if (!reviews.length) {
      return { count: 0, average: 0 };
    }

    const count = reviews.length;
    const average =
      reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0) / count;

    return { count, average };
  }, [reviews]);
};
