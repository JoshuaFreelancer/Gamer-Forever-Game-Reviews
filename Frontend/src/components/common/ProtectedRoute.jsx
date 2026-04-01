import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const user = useAuthStore((state) => state.user);

  if (!isAuthReady) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-jinx-pink">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-marker text-2xl mt-3 text-white">CARGANDO PERFIL...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
