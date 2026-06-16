"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./Hero.module.css";

function scrollToContact() {
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

async function trackCtaClick() {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cta_click", page: "/" }),
    });
  } catch {
    // non-critical
  }
}

export default function Hero() {
  const handleCta = () => {
    scrollToContact();
    trackCtaClick();
  };

  return (
    <Box
      component="section"
      className={styles.hero}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box className={styles.bgOrb1} />
      <Box className={styles.bgOrb2} />

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 3, md: 6 },
          width: "100%",
          zIndex: 1,
          position: "relative",
        }}
      >
        <Box className={styles.heroContent}>
          <Typography
            variant="overline"
            sx={{
              color: "#d97706",
              letterSpacing: "0.15em",
              fontWeight: 600,
              fontSize: "0.75rem",
              mb: 3,
              display: "block",
            }}
          >
            Digital Studio — Est. 2024
          </Typography>

          <Typography
            variant="h1"
            className={styles.headline}
            sx={{
              fontWeight: 900,
              fontSize: { xs: "3rem", sm: "4.5rem", md: "6.5rem" },
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#1c0a00",
              mb: 4,
              maxWidth: 900,
            }}
          >
            We make brands
            <br />
            <Box component="span" sx={{ color: "#d97706" }}>
              impossible
            </Box>
            <br />
            to ignore.
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 6 },
              mt: 2,
            }}
          >
            <Typography
              variant="body1"
              className={styles.subheadline}
              sx={{
                color: "#78350f",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.1rem" },
                maxWidth: 340,
                lineHeight: 1.7,
                opacity: 0.8,
              }}
            >
              Strategy, design and code — delivered as one. No handoffs, no agency bloat.
            </Typography>

            <Button
              variant="contained"
              size="large"
              className={styles.ctaBtn}
              onClick={handleCta}
              sx={{
                background: "#1c0a00",
                color: "#fffbeb",
                fontWeight: 700,
                fontSize: "0.95rem",
                px: 4,
                py: 1.6,
                borderRadius: "6px",
                textTransform: "none",
                flexShrink: 0,
                letterSpacing: "0.01em",
                "&:hover": {
                  background: "#d97706",
                },
                transition: "background 0.2s ease",
              }}
            >
              Start a project →
            </Button>
          </Box>
        </Box>

        <Box
          className={styles.scrollHint}
          sx={{
            position: "absolute",
            bottom: { xs: -120, md: -180 },
            right: { xs: 24, md: 48 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: "1px",
              height: 80,
              background: "linear-gradient(to bottom, transparent, #d97706)",
            }}
          />
          <Typography sx={{ fontSize: "0.65rem", color: "#d97706", letterSpacing: "0.2em", writingMode: "vertical-rl" }}>
            SCROLL
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
