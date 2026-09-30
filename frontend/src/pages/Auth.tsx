import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Garment from "../components/Garment";
import Meta from "../components/Meta";

/**
 * Presentation only. Real auth (server session cookie, argon2id) lands in Phase 3 —
 * nothing is stored in localStorage and no credentials leave the page.
 */
function AuthShell({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const from = (useLocation().state as { from?: string } | null)?.from;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    if (!isLogin && !String(f.get("name") ?? "").trim()) next.name = "Nama wajib diisi";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Masukkan email yang valid";
    if (isLogin ? !password : password.length < 8) next.password = isLogin ? "Kata sandi wajib diisi" : "Minimal 8 karakter";
    setErrors(next);
    setDone(Object.keys(next).length === 0);
  };

  const row = ({ name, label, type = "text", auto }: { name: string; label: string; type?: string; auto?: string }) => (
    <div>
      <label htmlFor={name} className="text-xs text-muted">{label}</label>
      <input id={name} name={name} type={type} autoComplete={auto} className="field" aria-invalid={!!errors[name]} />
      {errors[name] && <p className="mt-1 text-xs text-clay">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-7xl md:grid-cols-2">
      <Meta title={isLogin ? "Masuk" : "Daftar"} />
      <div className="hidden overflow-hidden md:block">
        <Garment fit="meet" shape="gamis" color="#b56f52" label="Ilustrasi gamis" />
      </div>
      <div className="flex items-center px-5 py-16 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <p className="eyebrow">{isLogin ? "Selamat datang kembali" : "Akun baru"}</p>
          <h1 className="mt-3 font-serif text-4xl font-light">{isLogin ? "Masuk" : "Daftar"}</h1>
          {from && <p className="mt-3 text-sm text-muted">Masuk dulu untuk melanjutkan.</p>}
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
            {!isLogin && row({ name: "name", label: "Nama lengkap", auto: "name" })}
            {row({ name: "email", label: "Email", type: "email", auto: "email" })}
            {row({ name: "password", label: "Kata sandi", type: "password", auto: isLogin ? "current-password" : "new-password" })}
            <button type="submit" className="btn btn-solid w-full py-4">{isLogin ? "Masuk" : "Buat akun"}</button>
            <p role="status" className="text-xs leading-relaxed text-clay">
              {done ? "Format data sudah benar. Login dan pendaftaran akan aktif setelah backend tersambung." : ""}
            </p>
          </form>
          <p className="mt-8 text-sm text-muted">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <Link to={isLogin ? "/daftar" : "/masuk"} className="text-ink underline underline-offset-4">
              {isLogin ? "Daftar" : "Masuk"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const Login = () => <AuthShell mode="login" />;
export const Register = () => <AuthShell mode="register" />;
