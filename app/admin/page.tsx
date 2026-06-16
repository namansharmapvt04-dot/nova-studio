"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import ContactsTable from "@/components/admin/ContactsTable";
import ProjectsManager from "@/components/admin/ProjectsManager";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("nova_admin_token");
    if (!stored) {
      router.replace("/admin/login");
    } else {
      setToken(stored);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("nova_admin_token");
    router.push("/admin/login");
  };

  if (!token) return null;

  return (
    <Box sx={{ minHeight: "100vh", background: "#fffbeb" }}>
      <Box
        sx={{
          background: "#fff",
          borderBottom: "1px solid rgba(217,119,6,0.15)",
          px: { xs: 3, md: 6 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#92400e" }}>
          Nova Studio Admin
        </Typography>
        <Button
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ color: "#92400e", opacity: 0.6, textTransform: "none", "&:hover": { opacity: 1, background: "rgba(217,119,6,0.06)" } }}
        >
          Sign Out
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 6 }, py: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1c0a00", mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#92400e", mb: 4, opacity: 0.65 }}>
          Manage your projects and contacts.
        </Typography>

        <Box sx={{ borderBottom: "1px solid rgba(217,119,6,0.15)", mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(_, v: number) => setTab(v)}
            sx={{
              "& .MuiTab-root": { color: "#92400e", opacity: 0.5, textTransform: "none", fontWeight: 600, fontSize: "0.95rem" },
              "& .Mui-selected": { color: "#d97706", opacity: 1 },
              "& .MuiTabs-indicator": { background: "#d97706" },
            }}
          >
            <Tab label="Contacts" />
            <Tab label="Projects" />
          </Tabs>
        </Box>

        {tab === 0 && <ContactsTable token={token} />}
        {tab === 1 && <ProjectsManager token={token} />}
      </Box>
    </Box>
  );
}
