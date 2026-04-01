import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthPageLayout from "../components/common/AuthPageLayout";

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const registerUser = useAuthStore((state) => state.register);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const passwordValue = watch("password", "");

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: "center", behavior: "auto" });
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  const onSubmit = async (values) => {
    const result = await registerUser(values);
    if (result.ok) {
      navigate("/profile", { replace: true });
    }
  };

  return (
    <AuthPageLayout eyebrow="Registro de Usuario" title="Crear Cuenta" icon={UserPlus}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block">
          <span className="text-xs font-bold tracking-widest text-gray-300 mb-2 block">
            NOMBRE
          </span>
          <div className="flex items-center border-2 border-gray-700 focus-within:border-jinx-pink bg-black/40 px-3 transition-colors">
            <User className="w-4 h-4 text-zaun-green" />
            <input
              type="text"
              autoComplete="name"
              className="w-full bg-transparent px-3 py-3 text-dirty-white placeholder:text-gray-400 outline-none"
              placeholder="Tu nombre completo"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
              })}
            />
          </div>
          <p
            className={`text-jinx-pink text-xs mt-1 min-h-4 ${errors.name ? "visible" : "invisible"}`}
          >
            {errors.name?.message || " "}
          </p>
        </label>

        <label className="block">
          <span className="text-xs font-bold tracking-widest text-gray-300 mb-2 block">
            CORREO
          </span>
          <div className="flex items-center border-2 border-gray-700 focus-within:border-jinx-pink bg-black/40 px-3 transition-colors">
            <Mail className="w-4 h-4 text-zaun-green" />
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
          <div className="flex items-center border-2 border-gray-700 focus-within:border-jinx-pink bg-black/40 px-3 transition-colors">
            <Lock className="w-4 h-4 text-zaun-green" />
            <input
              type="password"
              autoComplete="new-password"
              className="w-full bg-transparent px-3 py-3 text-dirty-white placeholder:text-gray-400 outline-none"
              placeholder="Crea una contraseña segura"
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

        <label className="block">
          <span className="text-xs font-bold tracking-widest text-gray-300 mb-2 block">
            CONFIRMAR CONTRASEÑA
          </span>
          <div className="flex items-center border-2 border-gray-700 focus-within:border-jinx-pink bg-black/40 px-3 transition-colors">
            <Lock className="w-4 h-4 text-zaun-green" />
            <input
              type="password"
              autoComplete="new-password"
              className="w-full bg-transparent px-3 py-3 text-dirty-white placeholder:text-gray-400 outline-none"
              placeholder="Repite tu contraseña"
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === passwordValue || "Las contraseñas no coinciden",
              })}
            />
          </div>
          <p
            className={`text-jinx-pink text-xs mt-1 min-h-4 ${errors.confirmPassword ? "visible" : "invisible"}`}
          >
            {errors.confirmPassword?.message || " "}
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
          className="w-full py-3 bg-jinx-pink text-white font-black tracking-widest border-2 border-black shadow-[4px_4px_0_#000] hover:bg-zaun-green hover:text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-800 pt-4 text-sm text-gray-300 text-center">
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-zaun-green font-bold hover:text-jinx-pink transition-colors justify-center"
          >
            <ArrowLeft size={14} /> Volver a login
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Register;
