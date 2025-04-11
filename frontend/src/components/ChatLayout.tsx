import { Box, Button, Typography } from '@mui/material';

interface Props {
  projectName: string;
  onBack: () => void;
}

const ChatLayout: React.FC<Props> = ({ projectName, onBack }) => {
  return (
    <Box p={4}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        Back to Projects
      </Button>
      <Typography variant="h5" mb={2}>
        Chat for {projectName}
      </Typography>
      <Box
        sx={{
          height: '60vh',
          bgcolor: '#eaeaea',
          borderRadius: 2,
          p: 2,
        }}
      >
        {/* Placeholder for chat */}
        <Typography color="text.secondary">Chat UI coming soon...</Typography>
      </Box>
    </Box>
  );
};

export default ChatLayout;
