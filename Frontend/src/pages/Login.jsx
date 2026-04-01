import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthPageLayout from "../components/common/AuthPageLayout";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (user) {
      const nextPath = location.state?.from || "/profile";
      navigate(nextPath, { replace: true });
    }
  }, [user, location.state, navigate]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: "center", behavior: "auto" });
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  const onSubmit = async (values) => {
    const result = await login(values);
    if (result.ok) {
      const nextPath = location.state?.from || "/profile";
      navigate(nextPath, { replace: true });
    }
  };

  return (
    <AuthPageLayout eyebrow="Acceso Seguro" title="Login" icon={LogIn}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block">
          <span className="text-xs font-bold tracking-widest text-gray-300 mb-2 block">
            CORREO
          </span>
          <div className="flex items-center border-2 border-gray-700 focus-within:border-zaun-green bg-black/40 px-3 transition-colors">
            <Mail className="w-4 h-4 text-jinx-pink" />
            <input
              type="email"
              autoComplete="email"
              className="w-full bg-transparent px-3 py-3 text-dirty-white placeholder:text-gray-400 outline-none"
              placeholder="correo@email.com"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un correo válido",
                },
              })}
            />
          </div>
          <p
            className={`text-jinx-pink text-xs mt-1 min-h-4 ${errors.email ? "visible" : "invisible"}`}
          >
            {errors.email?.message || " "}
          </p>
        </label>

        <label className="block">
          <span className="text-xs font-bold tracking-widest text-gray-300 mb-2 block">
            CONTRASEÑA
          </span>
          <div className="flex items-center border-2 border-gray-700 focus-within:border-zaun-green bg-black/40 px-3 transition-colors">
            <Lock className="w-4 h-4 text-jinx-pink" />
            <input
              type="password"
              autoComplete="current-password"
              className="w-full bg-transparent px-3 py-3 text-dirty-white placeholder:text-gray-400 outline-none"
              placeholder="Ingresa tu contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres",
                },
              })}
            />
          </div>
          <p
            className={`text-jinx-pink text-xs mt-1 min-h-4 ${errors.password ? "visible" : "invisible"}`}
          >
            {errors.password?.message || " "}
          </p>
        </label>

        <div>
          {error && (
            <div className="border border-jinx-pink bg-jinx-pink/10 px-3 py-2 text-sm text-dirty-white">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-zaun-green text-black font-black tracking-widest border-2 border-black shadow-[4px_4px_0_#000] hover:bg-jinx-pink hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "INGRESANDO..." : "INICIAR SESIÓN"}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-800 pt-4 text-sm text-gray-300 text-center">
        <p>
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-zaun-green font-bold hover:text-jinx-pink transition-colors justify-center"
          >
            Crear cuenta <ArrowRight size={14} />
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Login;
