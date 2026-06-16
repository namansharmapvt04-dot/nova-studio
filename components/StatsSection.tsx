"use client";

import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./StatsSection.module.css";

interface Stat {
  id: number;
  label: string;
  value: string;
}

const SUFFIX_MAP: Record<string, string> = {
  "Projects Completed": "+",
  "Clients Worldwide": "+",
  "Years Experience": "",
};

function StatCard({ stat, shouldStart, delay }: { stat: Stat; shouldStart: boolean; delay: number }) {
  const numericValue = parseInt(stat.value, 10);
  const count = useCountUp(numericValue, 2000, shouldStart);
  const suffix = SUFFIX_MAP[stat.label] ?? "";

  return (
    <Box
      className={`${styles.statCard} ${shouldStart ? styles.visible : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      sx={{ textAlign: "center", p: 4 }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          fontSize: { xs: "3rem", md: "4rem" },
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #d97706, #92400e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          mb: 1,
        }}
      >
        {count}
        {suffix}
      </Typography>
      <Typography variant="body1" sx={{ color: "#92400e", fontWeight: 500, opacity: 0.8 }}>
        {stat.label}
      </Typography>
    </Box>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setStats(data as Stat[]);
      })
      .catch(() => {});
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 6 },
        background: "linear-gradient(180deg, rgba(217,119,6,0.07) 0%, transparent 100%)",
        borderTop: "1px solid rgba(217,119,6,0.12)",
        borderBottom: "1px solid rgba(217,119,6,0.12)",
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Grid container spacing={2}>
          {stats.map((stat, i) => (
            <Grid item xs={12} md={4} key={stat.id}>
              <StatCard stat={stat} shouldStart={isVisible} delay={i * 150} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
