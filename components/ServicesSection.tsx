"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./ServicesSection.module.css";

const SERVICES = [
  {
    number: "01",
    title: "Web Design",
    description: "Interfaces built around how people actually use things — not how they look in a mockup. Fast, accessible, conversion-focused.",
    tags: ["UI/UX", "Figma", "Prototyping"],
  },
  {
    number: "02",
    title: "Development",
    description: "React, Next.js, TypeScript. We write code that's easy to hand off, easy to scale, and doesn't fall apart six months later.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    number: "03",
    title: "Branding",
    description: "A logo isn't a brand. We build the full system — mark, type, colour, tone — so you look consistent everywhere.",
    tags: ["Identity", "Typography", "Guidelines"],
  },
];

function ServiceRow({ service, delay }: { service: typeof SERVICES[0]; delay: number }) {
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
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "80px 1fr 1fr" },
          gap: { xs: 1.5, md: 4 },
          alignItems: "start",
          py: 4,
          borderTop: "1px solid rgba(217,119,6,0.15)",
          "&:hover .service-title": { color: "#d97706" },
          transition: "all 0.2s",
          cursor: "default",
        }}
      >
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#d97706", mt: { xs: 0, md: "6px" }, letterSpacing: "0.05em" }}>
          {service.number}
        </Typography>
        <Typography
          className="service-title"
          variant="h5"
          sx={{ fontWeight: 800, color: "#1c0a00", fontSize: { xs: "1.4rem", md: "1.75rem" }, letterSpacing: "-0.02em", transition: "color 0.2s" }}
        >
          {service.title}
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ color: "#78350f", lineHeight: 1.8, mb: 2, opacity: 0.75, fontSize: "0.95rem" }}>
            {service.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {service.tags.map((tag) => (
              <Box
                key={tag}
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#92400e",
                  background: "rgba(217,119,6,0.08)",
                  border: "1px solid rgba(217,119,6,0.18)",
                  px: 1.5,
                  py: 0.4,
                  borderRadius: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default function ServicesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleVisible = useScrollAnimation(titleRef as React.RefObject<HTMLElement>);

  return (
    <Box
      id="services"
      component="section"
      sx={{ py: { xs: 10, md: 16 }, px: { xs: 3, md: 6 }, maxWidth: 1200, mx: "auto" }}
    >
      <Box
        ref={titleRef}
        className={`${styles.sectionTitle} ${titleVisible ? styles.visible : ""}`}
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-end" }, mb: 2 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#1c0a00", fontSize: { xs: "2rem", md: "2.5rem" }, letterSpacing: "-0.03em" }}>
          What we do
        </Typography>
        <Typography variant="body2" sx={{ color: "#92400e", opacity: 0.6, maxWidth: 260, lineHeight: 1.7, mt: { xs: 1, md: 0 } }}>
          Three things. Done properly. No upsells.
        </Typography>
      </Box>

      {SERVICES.map((service, i) => (
        <ServiceRow key={service.number} service={service} delay={i * 100} />
      ))}

      <Box sx={{ borderTop: "1px solid rgba(217,119,6,0.15)" }} />
    </Box>
  );
}
