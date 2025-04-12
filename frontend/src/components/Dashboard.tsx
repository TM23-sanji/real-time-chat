import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Grid,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React, { useEffect, useState } from "react";
import AddProjectModal from "./AddProjectModal";
import ChatLayout from "./ChatLayout";
import axios from "axios";
import { useUserContext } from "../context/use.user.context";
import { useNavigate } from "react-router-dom";

interface ProjectData {
  name: string;
  users: string[];
}

const Dashboard = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/projects/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProjects(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const [selectedProject, setSelectedProject] =
    useState<Partial<ProjectData> | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleAddProject = (name: string) => {
    setProjects((prev) => [
      ...prev,
      { name: name || "Project Inc", users: [projects[0]?.users[0]] },
    ]);
  };
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Projects
          </Typography>
          <IconButton onClick={handleAvatarClick}>
            <Avatar alt="User" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/users/logout`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    console.log("Logout successful", response.data);
                    localStorage.removeItem("token");
                    setUser(null);
                    navigate("/login");
                  }
                } catch (error) {
                  console.log("Logout error", error);
                }
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Project List */}
      {!selectedProject ? (
        <Grid container spacing={4} px={4}>
          {projects.map((project, index) => (
            <Grid
              key={index}
              sx={{
                gridColumn: {
                  xs: "span 4",
                  sm: "span 4",
                  md: "span 4",
                },
              }}
            >
              <Box
                onClick={() => setSelectedProject(project)}
                sx={{
                  p: 3,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  boxShadow: 2,
                  cursor: "pointer",
                  textAlign: "center",
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
              >
                <Typography variant="h6">{project.name}</Typography>
                {/* 👤 Member Info */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={0.5}
                >
                  <PersonIcon fontSize="small" />
                  <Typography variant="body2">
                    {project.users.length}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <ChatLayout
          projectName={selectedProject?.name || ""}
          onBack={() => setSelectedProject(null)}
        />
      )}

      {/* Floating Add Project Button */}
      <AddProjectModal onAdd={handleAddProject} />
    </Box>
  );
};

export default Dashboard;
