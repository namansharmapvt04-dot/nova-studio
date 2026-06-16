"use client";

import { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./PortfolioSection.module.css";

interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

const CATEGORIES = ["All", "Web Design", "Branding", "Development", "UI/UX"];

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollAnimation(ref as React.RefObject<HTMLElement>);

  return (
    <div
      ref={ref}
      className={`${styles.cardWrapper} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid rgba(217,119,6,0.15)",
          cursor: "pointer",
          "&:hover .overlay": { opacity: 1 },
          "&:hover img": { transform: "scale(1.06)" },
        }}
      >
        <Box sx={{ position: "relative", width: "100%", paddingTop: "66.66%" }}>
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
          />
          <Box
            className="overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(28,10,0,0.85) 0%, rgba(28,10,0,0.2) 100%)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              display: "flex",
              alignItems: "flex-end",
              p: 3,
            }}
          >
            <Chip
              label={project.category}
              size="small"
              sx={{ background: "rgba(217,119,6,0.9)", color: "#fff", fontWeight: 600 }}
            />
          </Box>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1c0a00", mb: 0.5 }}>
            {project.title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#92400e", opacity: 0.7 }}>
            {project.category}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const titleRef = useRef<HTMLDivElement>(null);
  const titleVisible = useScrollAnimation(titleRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setProjects(data as Project[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <Box id="portfolio" component="section" sx={{ py: { xs: 10, md: 16 }, background: "#fef3c7" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 6 } }}>
        <Box
          ref={titleRef}
          className={`${styles.sectionTitle} ${titleVisible ? styles.visible : ""}`}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <Typography variant="overline" sx={{ color: "#d97706", letterSpacing: "0.3em", fontWeight: 600, fontSize: "0.8rem" }}>
            Our Work
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#1c0a00", mt: 1, fontSize: { xs: "2rem", md: "2.75rem" }, letterSpacing: "-0.02em" }}>
            Portfolio
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center", mb: 7 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveFilter(cat)}
              sx={{
                background: activeFilter === cat ? "#d97706" : "rgba(217,119,6,0.08)",
                color: activeFilter === cat ? "#fff" : "#92400e",
                border: activeFilter === cat ? "1px solid transparent" : "1px solid rgba(217,119,6,0.2)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { background: activeFilter === cat ? "#b45309" : "rgba(217,119,6,0.15)" },
              }}
            />
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#d97706" }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filtered.map((project, i) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard project={project} delay={i * 80} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
