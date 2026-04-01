import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, User, X, Zap } from "lucide-react";
import Logo from "/apple-touch-icon.png";
import SearchBar from "../components/common/SearchBar";
import { useAuthStore } from "../store/useAuthStore";

const EXPLORE_LINKS = [
  { name: "Inicio", path: "/" },
  { name: "Categorías", path: "/categories" },
  { name: "Plataformas", path: "/platforms" },
  { name: "Desarrolladores", path: "/developers" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = Boolean(user);
  const userLabel = isLoggedIn
    ? (user.displayName || user.email?.split("@")[0] || "PLAYER").toUpperCase()
    : "LOGIN";
  const profilePath = isLoggedIn ? "/profile" : "/login";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* 🚀 AISLAMIENTO PRINCIPAL: transform-gpu evita que el sticky repinte la pantalla al scrollear */}
      <header className="sticky top-0 z-999 w-full isolate transform-gpu">
        {/* 1. FONDO CAÓTICO (Aceleración de Hardware) */}
        {/* 🚀 transform-gpu agrupa todo este fondo pesado en una sola textura de VRAM */}
        <div className="absolute inset-0 bg-void-purple z-0 border-b-4 border-jinx-pink shadow-lg overflow-hidden transform-gpu pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)] transform-gpu"></div>
          <svg
            className="absolute w-full h-full pointer-events-none transform-gpu"
            preserveAspectRatio="none"
          >
            <path
              d="M-50,80 Q 200,-50 500,100 T 1000,20"
              stroke="#ff2a6d"
              strokeWidth="10"
              fill="none"
              opacity="0.15"
            />
            <circle
              cx="90%"
              cy="10%"
              r="150"
              stroke="#0aff60"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15,10"
              opacity="0.1"
            />
            <g stroke="#0aff60" strokeWidth="5" opacity="0.2">
              <path d="M 50,20 L 90,80 M 90,20 L 50,80" />
              <path d="M 600,10 L 620,30 M 620,10 L 600,30" strokeWidth="3" />
            </g>
            <path
              d="M 800,100 L 820,60 L 840,100 L 860,60 L 880,100"
              stroke="#ff2a6d"
              strokeWidth="3"
              fill="none"
              opacity="0.2"
            />
            {/* Este filtro ahora se calcula solo una vez gracias a las capas de arriba */}
            <ellipse
              cx="50%"
              cy="50%"
              rx="300"
              ry="60"
              fill="black"
              opacity="0.3"
              filter="blur(40px)"
            />
          </svg>
        </div>

        {/* 2. CONTENEDOR DE ELEMENTOS */}
        <div className="relative max-w-350 mx-auto px-2 md:px-6 h-16 md:h-24 flex items-center justify-between gap-1 md:gap-4 z-10">
          {/* --- PIEZA 1: IDENTIDAD --- */}
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-5 group relative select-none shrink-0 transform-gpu"
          >
            <div className="relative md:ml-4">
              <div className="absolute inset-0 bg-jinx-pink transform rotate-6 scale-125 border-2 border-white z-0 transition-transform group-hover:rotate-12"></div>
              <img
                src={Logo}
                alt="Logo Gamer Forever"
                className="h-9 w-9 md:h-14 md:w-auto object-contain relative z-10 -rotate-3 transition-transform group-hover:scale-110 drop-shadow-[1px_1px_0_#000]"
              />
            </div>
            <div className="hidden md:flex flex-col relative z-20 ml-1">
              <div className="relative leading-none">
                <span className="absolute top-0 left-0 font-marker text-3xl text-jinx-pink tracking-widest translate-x-0.5 translate-y-0.5">
                  GAMER
                </span>
                <span className="relative font-marker text-3xl text-white tracking-widest">
                  GAMER
                </span>
              </div>
              <div className="relative inline-block -mt-1 ml-4 transform -rotate-2 self-start">
                <span className="font-extrabold text-xs tracking-[0.2em] text-black bg-zaun-green border border-black px-4 py-0.5 shadow-[2px_2px_0_#000]">
                  FOREVER
                </span>
              </div>
            </div>
          </Link>

          {/* --- PIEZA 2: BUSCADOR --- */}
          <div className="flex-1 flex justify-center z-20 px-2 max-w-2xl">
            <SearchBar />
          </div>

          {/* --- PIEZA 3: ZONA DE USUARIO --- */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            {/* Campana */}
            <button className="hidden md:block relative group hover:scale-105 transition-transform transform-gpu">
              <div className="absolute inset-0 bg-black rotate-45 border-2 border-gray-600 group-hover:border-jinx-pink transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.5)]"></div>
              <div className="relative p-2.5 z-10">
                <Bell
                  size={20}
                  className="text-gray-300 group-hover:text-white transition-colors"
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-zaun-green text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center border border-black z-20 shadow-[1px_1px_0_#000]">
                !
              </div>
            </button>

            {/* Avatar */}
            <Link
              to={profilePath}
              className="flex items-center gap-2 md:gap-4 group transform-gpu"
            >
              <div className="text-right hidden md:block">
                <span className="block font-marker text-xl text-white leading-none group-hover:text-jinx-pink transition-colors">
                  {userLabel}
                </span>
                <div className="h-1.5 w-full bg-jinx-pink mt-1 border border-black transform -skew-x-12 shadow-[2px_2px_0_#000]"></div>
              </div>
              <div className="relative w-8 h-8 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 rotate-3"></div>
                <div className="absolute inset-0 bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-200">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <div className="absolute -top-1.5 -left-1.5 w-3 h-1.5 md:-top-2 md:-left-2 md:w-5 md:h-2.5 bg-[#e4c95e] border border-black transform -rotate-45 shadow-sm z-10 opacity-90"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:-bottom-1 md:-right-1 md:w-2.5 md:h-2.5 rounded-sm bg-zaun-green border border-black z-10"></div>
              </div>
            </Link>

            {/* Menú Hamburguesa */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden bg-black border-2 border-zaun-green p-1 text-zaun-green hover:bg-zaun-green hover:text-black transition-colors shadow-[2px_2px_0_rgba(10,255,96,0.5)] active:translate-y-1 active:shadow-none transform-gpu"
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. OVERLAY MENÚ MÓVIL (PANTALLA COMPLETA) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-1000 bg-gray-950/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 bg-jinx-pink p-2 border-2 border-black text-white shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
          >
            <X size={32} strokeWidth={3} />
          </button>
          <div className="flex flex-col items-center gap-8 w-full px-8">
            <h2 className="font-marker text-4xl text-white tracking-widest mb-4 flex items-center gap-2 border-b-4 border-zaun-green pb-2">
              <Zap className="text-jinx-pink" size={32} />
              NAVEGACIÓN
            </h2>
            {EXPLORE_LINKS.map((link, idx) => (
              <Link
                key={link.name}
                to={link.path}
                className="w-full relative group block text-center"
              >
                <div className="absolute inset-0 bg-zaun-green transform skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="relative z-10 font-black text-2xl uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors py-4 block">
                  {link.name}
                </span>
                {idx !== EXPLORE_LINKS.length - 1 && (
                  <div className="h-px w-1/2 mx-auto bg-gray-800 mt-2"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
