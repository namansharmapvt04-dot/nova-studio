"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("nova_admin_token");
    if (token) router.replace("/admin");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as { token?: string; error?: string };
      if (res.ok && data.token) {
        localStorage.setItem("nova_admin_token", data.token);
        router.push("/admin");
      } else {
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#1c0a00",
      backgroundColor: "#fffbeb",
      "& fieldset": { borderColor: "rgba(217,119,6,0.25)" },
      "&:hover fieldset": { borderColor: "rgba(217,119,6,0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#d97706" },
    },
    "& .MuiInputLabel-root": { color: "#92400e" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#d97706" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid rgba(217,119,6,0.2)",
          borderRadius: 4,
          boxShadow: "0 8px 40px rgba(217,119,6,0.1)",
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: "#92400e" }}>
            Nova Studio
          </Typography>
          <Typography variant="body2" sx={{ color: "#92400e", mb: 4, opacity: 0.6 }}>
            Admin Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" fullWidth required sx={inputSx} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" fullWidth required sx={inputSx} />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                mt: 1,
                background: "#d97706",
                color: "#fff",
                fontWeight: 700,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                borderRadius: "100px",
                boxShadow: "0 4px 16px rgba(217,119,6,0.3)",
                "&:hover": { background: "#b45309" },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
