import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";

const mapAuthError = (errorCode) => {
  const errorsMap = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "El correo no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/invalid-login-credentials": "Correo o contraseña incorrectos.",
    "auth/user-disabled": "Esta cuenta está deshabilitada.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed":
      "No se pudo conectar con Firebase. Revisa tu conexión e inténtalo de nuevo.",
  };

  return errorsMap[errorCode] || "Ocurrió un error de autenticación.";
};

const normalizeUser = (firebaseUser) => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthReady: false,
  isLoading: false,
  error: null,
  unsubscribeAuth: null,

  initAuthListener: () => {
    if (get().unsubscribeAuth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      set({
        user: normalizeUser(firebaseUser),
        isAuthReady: true,
        isLoading: false,
      });
    });

    set({ unsubscribeAuth: unsubscribe });
  },

  cleanupAuthListener: () => {
    const unsubscribe = get().unsubscribeAuth;
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribeAuth: null });
    }
  },

  clearAuthError: () => set({ error: null }),

  register: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      set({ user: normalizeUser({ ...userCredential.user, displayName: name }) });
      return { ok: true };
    } catch (error) {
      set({ error: mapAuthError(error.code) });
      return { ok: false };
    } finally {
      set({ isLoading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      set({ user: normalizeUser(userCredential.user) });
      return { ok: true };
    } catch (error) {
      set({ error: mapAuthError(error.code) });
      return { ok: false };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
      set({ user: null });
      return { ok: true };
    } catch {
      set({ error: "No se pudo cerrar sesión." });
      return { ok: false };
    } finally {
      set({ isLoading: false });
    }
  },
}));
