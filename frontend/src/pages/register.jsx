import { useState } from "react";

function Register({ onGoToLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.trim() === "") {
        setMessage("Username harus diisi");
        return;
    }

    if (email.trim() === "") {
        setMessage("Email harus diisi");
        return;
    }

    if (!email.includes("@")) {
        setMessage("Format email tidak valid");
        return;
    }

    if (password.trim() === "") {
        setMessage("Password harus diisi");
        return;
    }

    try {
        setIsLoading(true);
        setMessage("");

        const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
        });

        const data = await response.json();

        console.log(data);

        setMessage(data.message || "Registrasi selesai");

        if (response.ok) {
            setUsername("");
            setEmail("");
            setPassword("");
        }
    } catch (error) {
        console.error(error);
        setMessage("Terjadi kesalahan koneksi ke server");
    } finally {
        setIsLoading(false);
    }
};

    return(
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Username </label>
                    <input
                        type="text"
                        placeholder="Masukkan Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Email </label>
                    <input
                        type="email"
                        placeholder="Masukkan Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Password </label>
                    <input
                        type="password"
                        placeholder="Masukkan Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Daftar"}
                </button>
            </form>

            {message && <p>{message}</p>}

            <p>
                Sudah punya akun?{" "}
                <button type="button" onClick={onGoToLogin}>
                    Login
                </button>
            </p>
        </div>
    );
}
 export default Register;