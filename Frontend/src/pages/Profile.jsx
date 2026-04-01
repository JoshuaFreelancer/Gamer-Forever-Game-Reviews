import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Profile = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const displayName = useMemo(() => {
    if (!user) return "PLAYER";
    return user.displayName || user.email?.split("@")[0] || "PLAYER";
  }, [user]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.ok) {
      navigate("/", { replace: true });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-void-purple/90 border-2 border-zaun-green shadow-[8px_8px_0_#000] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-800 pb-6">
            <div>
              <p className="font-roboto uppercase tracking-[0.2em] text-jinx-pink text-xs">
                PERFIL DE JUGADOR
              </p>
              <h1 className="font-marker text-4xl text-dirty-white mt-2">
                {String(displayName).toUpperCase()}
              </h1>
            </div>
            <div className="w-18 h-18 rounded-none border-2 border-jinx-pink bg-black flex items-center justify-center shadow-[4px_4px_0_#000]">
              <User className="w-10 h-10 text-zaun-green" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-black/40 border border-gray-700 px-4 py-3 flex items-center gap-3">
              <Mail className="text-jinx-pink w-5 h-5" />
              <div>
                <p className="text-xs tracking-widest text-gray-400 uppercase">Email</p>
                <p className="text-dirty-white">{user?.email || "No disponible"}</p>
              </div>
            </div>

            <div className="bg-black/40 border border-gray-700 px-4 py-3 flex items-center gap-3">
              <ShieldCheck className="text-zaun-green w-5 h-5" />
              <div>
                <p className="text-xs tracking-widest text-gray-400 uppercase">Estado</p>
                <p className="text-dirty-white">Cuenta autenticada</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="px-5 py-3 bg-black border-2 border-gray-700 text-gray-200 font-bold tracking-wider hover:border-jinx-pink transition-colors text-center"
            >
              VOLVER AL INICIO
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-5 py-3 bg-jinx-pink border-2 border-black text-white font-black tracking-wider hover:bg-zaun-green hover:text-black transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? "CERRANDO..." : "CERRAR SESIÓN"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
