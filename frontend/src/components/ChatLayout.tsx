import { ProjectData } from './Dashboard';

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
  Tooltip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const ChatLayout: React.FC<Props> = ({ project, onBack }) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setOpenDrawer(open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Chat Panel (35%) */}
      <Box
        sx={{
          width: '35%',
          borderRight: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          bgcolor: '#f9f9f9',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chat – {project.name}</Typography>
          <Tooltip title="Users">
            <IconButton onClick={() => toggleDrawer(true)}>
              <PeopleIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Chat messages will go here...
          </Typography>
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
          width: '65%',
          p: 3,
          bgcolor: '#fff',
        }}
      >
        <Typography variant="h5" mb={2}>
          🤖 AI Response Area
        </Typography>
        <Box sx={{ bgcolor: '#f1f1f1', p: 2, borderRadius: 2, height: '80%' }}>
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
          sx: { width: '35%', p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Users</Typography>
          <IconButton onClick={() => toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {['Ravi', 'Simran', 'Kabir', 'Ayesha'].map((user, index) => (
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
