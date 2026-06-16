import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import StatsSection from "@/components/StatsSection";
import ContactForm from "@/components/ContactForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <PortfolioSection />
        <StatsSection />
        <ContactForm />
      </main>
      <Box
        component="footer"
        sx={{
          py: 4,
          px: { xs: 3, md: 6 },
          borderTop: "1px solid rgba(217,119,6,0.12)",
          background: "#fef3c7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "100%",
        }}
      >
        <Typography variant="body2" sx={{ color: "#92400e", opacity: 0.5, fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} Nova Studio
        </Typography>
        <Typography variant="body2" sx={{ color: "#92400e", opacity: 0.4, fontSize: "0.8rem" }}>
          Built with Next.js
        </Typography>
      </Box>
    </>
  );
}
