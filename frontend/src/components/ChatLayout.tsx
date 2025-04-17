import { ProjectData } from "./Dashboard";
import React from "react";
import axios from "axios";

interface Props {
  project: ProjectData;
  onBack: () => void;
  fetchProjects: () => void;
}

interface User {
    name: string;
    email: string;
    _id: string;
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
  Modal,
  Checkbox,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useRef } from "react";
import { receiveMsg, sendMsg } from "../socket";
import { useUserContext } from "../context/use.user.context";
import AiResponse from "./AiResponse";

const ChatLayout: React.FC<Props> = ({ project, onBack, fetchProjects }) => {
  const {user} = useUserContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [notAvailableUsers, setNotAvailableUsers] = useState<string[]>([]);
  const [aiMessage, setAiMessage] = useState<{ text: string; fileTree: any } | null>(null);


  const hasRun = useRef(false);

  useEffect(() => {
    receiveMsg('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  useEffect(()=>{
    if (!hasRun.current){
      fetchAvailableUsers();
      fetchNotAvailableUsers();
      hasRun.current=true;
    }
  },)

  const chatRef = useRef<HTMLDivElement | null>(null);

  const toggleDrawer = (open: boolean) => {
    setOpenDrawer(open);
  };

  const handleSend = async () => {
    if (newMessage.trim().toLowerCase().startsWith("@ai")){
      setMessages(prev => [...prev, { sender: user?.name || " ", text: newMessage.trim() }]);
      setNewMessage("");     

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/get-result?prompt=${newMessage.trim().split(/\s+/).slice(1).join(" ")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAiMessage(JSON.parse(response.data));

    } else {
      sendMsg('chat message', { sender: user?.name|| " ", text: newMessage.trim() });
      setMessages(prev => [...prev, { sender: user?.name || " ", text: newMessage.trim() }]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const fetchAvailableUsers = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/available-users`,
          { users: project.users },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const users= response.data;
        users.map((user:User)=>{
          setAvailableUsers((prev) => [...prev, user.name])
        })
      } catch (error) {
        console.error("Error fetching available users:", error);
      }
    };
    
  const fetchNotAvailableUsers = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/not-available-users`,
          { users: project.users },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const users= response.data;
        users.map((user:User)=>{
          setNotAvailableUsers((prev) => [...prev, user.name])
        })
      } catch (error) {
        console.error("Error fetching available users:", error);
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
          <Box>
          <Tooltip title="Users">
            <IconButton onClick={() => toggleDrawer(true)}>
              <PeopleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add">
            <IconButton onClick={() => setInviteModalOpen(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          </Box>
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
                alignSelf: msg.sender === user?.name ? "flex-end" : "flex-start",
                bgcolor: msg.sender === user?.name ? "#1976d2" : "#eee",
                color: msg.sender === user?.name ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="caption">{msg.sender} :</Typography>
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
          <Button variant="outlined" onClick={()=>{onBack(); fetchProjects();}}>
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
    display: "flex",
    flexDirection: "column",
  }}
>
  <Typography variant="h5" mb={2}>
    🤖 Gemini AI
  </Typography>

  <Box
    sx={{
      bgcolor: "#f1f1f1",
      p: 2,
      borderRadius: 2,
      flexGrow: 1,
      overflowY: "auto",
    }}
  >
    <AiResponse content={aiMessage || { text: "Type @ai to get AI response", fileTree: {} }} />
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
          {notAvailableUsers.map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={user} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Modal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 3,
    }}
  >
    <Typography variant="h6" mb={2} sx={{fontWeight:"bold"}}>
      Invite Users to Project
    </Typography>
    <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
      {availableUsers.map((user) => (
        <MenuItem
          key={user}
          onClick={() => {
            setSelectedUsers((prev) =>
              prev.includes(user)
                ? prev.filter((u) => u !== user)
                : [...prev, user]
            );
          }}
        >
          <ListItemIcon>
            <Checkbox edge="start" checked={selectedUsers.includes(user)} />
          </ListItemIcon>
          <ListItemText primary={user} />
        </MenuItem>
      ))}
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <Button onClick={() => {setInviteModalOpen(false); setSelectedUsers([])}}>Cancel</Button>
      <Button
        variant="contained"
        onClick={async() => {
          // Do something with selectedUsers
          console.log('Invited:', selectedUsers);
          await axios.put(`${import.meta.env.VITE_BASE_URL}/projects/add-user`,
            {projectName:project.name,userNames:selectedUsers}).then(()=>console.log('Done')).catch((err)=>console.log(err)).finally(()=>{
          setNotAvailableUsers((prev) => [...prev, ...selectedUsers]);
          setSelectedUsers([]);
          setAvailableUsers((prev) => prev.filter((user) => !selectedUsers.includes(user)));
          setInviteModalOpen(false);})
        }}
      >
        Invite
      </Button>
    </Box>
  </Box>
</Modal>

    </Box>
    
  );
};

export default ChatLayout;
