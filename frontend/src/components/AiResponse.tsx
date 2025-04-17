import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

interface FileTreeContent {
  [key: string]: {
    content: string;
  };
}

interface AiResponseProps {
  content: {
    text: string;
    fileTree: FileTreeContent;
  };
}

const AiResponse: React.FC<AiResponseProps> = ({ content }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fileNames = Object.keys(content?.fileTree || {});

  return (
    <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
      {/* Sidebar Buttons */}
      <Box
        sx={{
          width: "180px",
          bgcolor: "#f4f4f4",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          borderRight: "1px solid #ddd",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          📁 Files
        </Typography>
        {fileNames.map((fileName) => (
          <Button
            key={fileName}
            variant={selectedFile === fileName ? "contained" : "outlined"}
            onClick={() => setSelectedFile(fileName)}
            size="small"
            sx={{ justifyContent: "flex-start", textTransform: "none", overflow:"hidden" }}
          >
            {fileName}
          </Button>
        ))}
      </Box>

      {/* File Content Display */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {selectedFile || "Select a file"}
        </Typography>
        <Paper
          sx={{
            p: 2,
            bgcolor: "#f9f9f9",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            flex: 1,
            overflowX: "auto",
          }}
        >
          {selectedFile
            ? content.fileTree[selectedFile]?.content || "No content"
            : "Click on a file to view its content."}
        </Paper>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {content.text}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AiResponse;
