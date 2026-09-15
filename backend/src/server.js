const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

const ensureUsersTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS username VARCHAR(50)
    `);

    await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS email VARCHAR(255)
    `);

    await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
    `);

    await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
};

const ensureLoginLogsTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS login_logs (
            id SERIAL PRIMARY KEY,
            user_id INT,
            ip_address VARCHAR(45),
            success BOOLEAN NOT NULL DEFAULT false,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        ALTER TABLE login_logs
        ADD COLUMN IF NOT EXISTS user_id INT
    `);

    await pool.query(`
        ALTER TABLE login_logs
        ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45)
    `);

    await pool.query(`
        ALTER TABLE login_logs
        ADD COLUMN IF NOT EXISTS success BOOLEAN NOT NULL DEFAULT false
    `);

    await pool.query(`
        ALTER TABLE login_logs
        ADD COLUMN IF NOT EXISTS logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
};

app.get("/", (req, res) => {
    res.send("Backend berhasil");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API berhasil bekerja!"
    });
});

app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || username.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Username harus diisi"
            });
        }

        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email harus diisi"
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Format email tidak valid"
            });
        }

        if (!password || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Password harus diisi"
            });
        }

        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at",
            [username.trim(), email.trim().toLowerCase(), password]
        );

        res.status(201).json({
            success: true,
            message: "Registrasi Berhasil",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Username atau email sudah terdaftar"
            });
        }

        res.status(500).json({
            success: false,
            message: "Gagal registrasi"
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";

        if (!identifier || identifier.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Username atau email harus diisi"
            });
        }

        if (!password || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Password harus diisi"
            });
        }

        const userResult = await pool.query(
            "SELECT id, username, email FROM users WHERE (username = $1 OR email = $2) AND password_hash = $3",
            [identifier.trim(), identifier.trim().toLowerCase(), password]
        );

        if (userResult.rows.length === 0) {
            await pool.query(
                "INSERT INTO login_logs (user_id, ip_address, success) VALUES ($1, $2, $3)",
                [null, ipAddress, false]
            );

            return res.status(401).json({
                success: false,
                message: "Username/email atau password salah"
            });
        }

        const user = userResult.rows[0];

        await pool.query(
            "INSERT INTO login_logs (user_id, ip_address, success) VALUES ($1, $2, $3)",
            [user.id, ipAddress, true]
        );

        res.json({
            success: true,
            message: "Login berhasil",
            user: user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal login"
        });
    }
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "DB berhasil terhubung",
            time: result.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database gagal terhubung"
        });
    }
});

ensureUsersTable()
    .then(() => ensureLoginLogsTable())
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Gagal menyiapkan tabel users", error);
        process.exit(1);
    });