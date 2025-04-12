import React from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Fab,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import axios from "axios";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface Props {
  onAdd: (name: string) => void;
  addbtnRef:React.RefObject<HTMLButtonElement | null>;
}

const AddProjectModal: React.FC<Props> = ({onAdd,addbtnRef}) => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setProjectName("");
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleCreate = async () => {
    if (projectName.trim()) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/projects/create`,
          { name: projectName },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Project created:", response.data);
        onAdd(projectName);
        setToast({
          open: true,
          type: "success",
          message: "Project created successfully!",
        });
        handleClose();
      } catch {
        setToast({
          open: true,
          type: "error",
          message: "Project name must be unique!",
        });
      }
    } else {
      setToast({
        open: true,
        type: "error",
        message: "Project name cannot be empty!",
      });
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        ref={addbtnRef}
      >
        <AddIcon />
      </Fab>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Create New Project
          </Typography>
          <TextField
            fullWidth
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProjectModal;
