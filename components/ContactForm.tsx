"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface FormState { name: string; email: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name || form.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!form.email || !EMAIL_REGEX.test(form.email)) errors.email = "Please enter a valid email address";
  if (!form.message || form.message.trim().length < 10) errors.message = "Message must be at least 10 characters";
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; severity: "success" | "error"; message: string }>({ open: false, severity: "success", message: "" });

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        setForm({ name: "", email: "", message: "" });
        setSnackbar({ open: true, severity: "success", message: "Got it — we'll be in touch within 24 hours." });
      } else {
        const data = await res.json() as { error?: string };
        setSnackbar({ open: true, severity: "error", message: data.error ?? "Something went wrong." });
      }
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#1c0a00",
      backgroundColor: "#fff",
      borderRadius: "6px",
      "& fieldset": { borderColor: "rgba(217,119,6,0.2)" },
      "&:hover fieldset": { borderColor: "rgba(217,119,6,0.45)" },
      "&.Mui-focused fieldset": { borderColor: "#d97706", borderWidth: "1px" },
    },
    "& .MuiInputLabel-root": { color: "#92400e", opacity: 0.7 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#d97706" },
    "& .MuiFormHelperText-root": { color: "#dc2626" },
  };

  return (
    <Box id="contact" component="section" sx={{ py: { xs: 10, md: 16 }, background: "#fffbeb" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 6 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 6, md: 12 }, alignItems: "start" }}>

          <Box>
            <Typography variant="overline" sx={{ color: "#d97706", letterSpacing: "0.15em", fontWeight: 600, fontSize: "0.7rem", display: "block", mb: 2 }}>
              Get in touch
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#1c0a00", fontSize: { xs: "2.25rem", md: "3rem" }, letterSpacing: "-0.03em", lineHeight: 1.1, mb: 3 }}>
              Got a project in mind?
            </Typography>
            <Typography variant="body1" sx={{ color: "#78350f", opacity: 0.7, lineHeight: 1.8, mb: 4, maxWidth: 360 }}>
              Tell us what you're building. We'll get back within 24 hours with honest thoughts — no sales pitch.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {["hello@novastudio.co", "Available for new projects"].map((line) => (
                <Typography key={line} variant="body2" sx={{ color: "#92400e", opacity: 0.65, fontSize: "0.9rem" }}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField label="Your name" value={form.name} onChange={handleChange("name")} error={!!errors.name} helperText={errors.name} fullWidth required sx={inputSx} />
            <TextField label="Email address" type="email" value={form.email} onChange={handleChange("email")} error={!!errors.email} helperText={errors.email} fullWidth required sx={inputSx} />
            <TextField label="Tell us about the project" value={form.message} onChange={handleChange("message")} error={!!errors.message} helperText={errors.message} fullWidth required multiline rows={5} sx={inputSx} />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "#1c0a00",
                color: "#fffbeb",
                fontWeight: 700,
                fontSize: "0.95rem",
                py: 1.6,
                px: 4,
                textTransform: "none",
                borderRadius: "6px",
                alignSelf: "flex-start",
                letterSpacing: "0.01em",
                boxShadow: "none",
                "&:hover": { background: "#d97706", boxShadow: "none" },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: "#fffbeb" }} /> : "Send message →"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
