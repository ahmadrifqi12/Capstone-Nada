import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (identifier.trim() === "") {
      setPesan("Username atau email harus diisi");
      return;
    }

    if (password.trim() === "") {
      setPesan("Password harus diisi");
      return;
    }

    try {
      setIsLoading(true);
      setPesan("");

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setPesan(`Selamat datang, ${data.user.username}!`);
        navigate("/");
      } else {
        setPesan(data.message || "Login gagal");
      }
    } catch (error) {
      console.error(error);
      setPesan("Terjadi kesalahan koneksi ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username / Email </label>
          <input
            type="text"
            placeholder="Masukkan Username atau Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password </label>
          <input
            type="password"
            placeholder="Masukkan Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {pesan && <p>{pesan}</p>}

      <p>
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  );
}

export default Login;
