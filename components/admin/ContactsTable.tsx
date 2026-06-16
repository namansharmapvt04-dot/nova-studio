"use client";

import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface ContactsTableProps {
  token: string;
}

export default function ContactsTable({ token }: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contacts", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load contacts");
        return r.json() as Promise<Contact[]>;
      })
      .then(setContacts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#d97706" }} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ py: 4, textAlign: "center" }}>{error}</Typography>;
  }

  if (contacts.length === 0) {
    return (
      <Typography sx={{ py: 4, textAlign: "center", color: "#92400e", opacity: 0.5 }}>
        No contacts yet.
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ background: "#fff", border: "1px solid rgba(217,119,6,0.15)", borderRadius: 2, boxShadow: "none" }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#fef3c7" }}>
            {["Name", "Email", "Message", "Date"].map((h) => (
              <TableCell key={h} sx={{ color: "#92400e", borderBottom: "1px solid rgba(217,119,6,0.15)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((c) => (
            <TableRow key={c.id} sx={{ "&:hover": { background: "#fffbeb" }, "&:last-child td": { borderBottom: 0 } }}>
              <TableCell sx={{ color: "#1c0a00", borderBottom: "1px solid rgba(217,119,6,0.08)", fontWeight: 600 }}>{c.name}</TableCell>
              <TableCell sx={{ color: "#92400e", borderBottom: "1px solid rgba(217,119,6,0.08)" }}>{c.email}</TableCell>
              <TableCell sx={{ color: "#78350f", borderBottom: "1px solid rgba(217,119,6,0.08)", maxWidth: 300 }}>
                <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.message}
                </Typography>
              </TableCell>
              <TableCell sx={{ color: "#92400e", opacity: 0.6, borderBottom: "1px solid rgba(217,119,6,0.08)", whiteSpace: "nowrap" }}>
                {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
