"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";

interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

const CATEGORIES = ["Web Design", "Branding", "Development", "UI/UX"];

interface AddFormState {
  title: string;
  category: string;
  imageUrl: string;
}

interface ProjectsManagerProps {
  token: string;
}

export default function ProjectsManager({ token }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddFormState>({ title: "", category: "Web Design", imageUrl: "" });
  const [snackbar, setSnackbar] = useState<{ open: boolean; severity: "success" | "error"; message: string }>({
    open: false, severity: "success", message: "",
  });

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/projects")
      .then((r) => r.json() as Promise<Project[]>)
      .then(setProjects)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      setSnackbar({ open: true, severity: "error", message: "Title and Image URL are required" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: authHeaders, body: JSON.stringify(form) });
      if (res.ok) {
        setForm({ title: "", category: "Web Design", imageUrl: "" });
        setSnackbar({ open: true, severity: "success", message: "Project added!" });
        fetchProjects();
      } else {
        const data = await res.json() as { error?: string };
        setSnackbar({ open: true, severity: "error", message: data.error ?? "Failed to add project" });
      }
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE", headers: authHeaders });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setSnackbar({ open: true, severity: "success", message: "Project deleted" });
      } else {
        setSnackbar({ open: true, severity: "error", message: "Failed to delete project" });
      }
    } catch {
      setSnackbar({ open: true, severity: "error", message: "Network error" });
    } finally {
      setDeletingId(null);
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
    "& .MuiSelect-icon": { color: "#92400e" },
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleAdd}
        sx={{
          background: "#fff",
          border: "1px solid rgba(217,119,6,0.15)",
          borderRadius: 3,
          p: 3,
          mb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          boxShadow: "0 2px 16px rgba(217,119,6,0.06)",
        }}
      >
        <Typography variant="h6" sx={{ color: "#1c0a00", fontWeight: 700, mb: 1 }}>
          Add New Project
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} fullWidth required sx={inputSx} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={inputSx}>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                sx={{ color: "#1c0a00" }}
                MenuProps={{ PaperProps: { sx: { background: "#fff", color: "#1c0a00" } } }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} fullWidth required sx={inputSx} />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{
            alignSelf: "flex-start",
            background: "#d97706",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            px: 4,
            py: 1.25,
            borderRadius: "100px",
            boxShadow: "0 4px 16px rgba(217,119,6,0.25)",
            "&:hover": { background: "#b45309" },
          }}
        >
          {submitting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Add Project"}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#d97706" }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ background: "#fff", border: "1px solid rgba(217,119,6,0.15)", borderRadius: 3, height: "100%", boxShadow: "none" }}>
                <Box sx={{ position: "relative", width: "100%", paddingTop: "60%" }}>
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                  />
                </Box>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: "#1c0a00", fontWeight: 700, mb: 0.5 }}>
                    {project.title}
                  </Typography>
                  <Chip label={project.category} size="small" sx={{ background: "rgba(217,119,6,0.1)", color: "#92400e", fontSize: "0.75rem", fontWeight: 600 }} />
                </CardContent>
                <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={deletingId === project.id ? <CircularProgress size={14} sx={{ color: "#dc2626" }} /> : <DeleteIcon />}
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    sx={{ color: "#dc2626", textTransform: "none", "&:hover": { background: "rgba(220,38,38,0.06)" } }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
