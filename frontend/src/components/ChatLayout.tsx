import { ProjectData } from "./Dashboard";
import React from "react";

interface Props {
  project: ProjectData;
  onBack: () => void;
}

import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  TextField,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useRef } from "react";

const ChatLayout: React.FC<Props> = ({ project, onBack }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const chatRef = useRef<HTMLDivElement | null>(null);

  const toggleDrawer = (open: boolean) => {
    setOpenDrawer(open);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left Chat Panel (35%) */}
      <Box
        sx={{
          width: "25%",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "#f9f9f9",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontWeight: 700, textTransform: "capitalize" }}
            variant="h6"
          >
            {project.name}
          </Typography>
          <Tooltip title="Users">
            <IconButton onClick={() => toggleDrawer(true)}>
              <PeopleIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          ref={chatRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            pb: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
                bgcolor: msg.sender === "You" ? "#1976d2" : "#eee",
                color: msg.sender === "You" ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Input Box */}
        <Box sx={{ display: "flex", gap: 1, p: 2 }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
          />
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <Button variant="outlined" onClick={onBack}>
            🔙 Back
          </Button>
        </Box>
      </Box>

      {/* Right AI Response Panel (65%) */}
      <Box
        sx={{
          width: "75%",
          p: 3,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h5" mb={2}>
          🤖
        </Typography>
        <Box sx={{ bgcolor: "#f1f1f1", p: 2, borderRadius: 2, height: "80%" }}>
          <Typography color="text.secondary">
            AI responses or output will be displayed here.
          </Typography>
        </Box>
      </Box>

      {/* Slide-In Drawer from Right (User List) */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: { width: "25%", p: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Users
          </Typography>
          <IconButton onClick={() => toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {["Ravi", "Simran", "Kabir", "Ayesha"].map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={user} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default ChatLayout;
