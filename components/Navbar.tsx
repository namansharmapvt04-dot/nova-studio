"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255, 251, 235, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(217,119,6,0.12)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 3, md: 6 }, minHeight: "56px !important" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#1c0a00",
            fontSize: "1.1rem",
          }}
        >
          Nova Studio
        </Typography>
        <Box sx={{ display: "flex", gap: 0 }}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              sx={{
                color: "#78350f",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.875rem",
                px: 2,
                py: 0.75,
                borderRadius: "4px",
                "&:hover": { color: "#d97706", background: "transparent" },
                transition: "color 0.15s",
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
