import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

export interface FileTreeContent {
  [key: string]: {
    file: { contents: string };
  } ;
}

export interface AiResponseProps {
    text: string;
    fileTree: FileTreeContent;
    buildCommand?: { mainItem: string; commands: string[] };
    startCommand?: { mainItem: string; commands: string[] };
    additionalExplanation?: string;
    viewMode: "chat" | "code";
}

const AiResponse: React.FC<AiResponseProps> = ({ text, fileTree, additionalExplanation, viewMode }) => {
  const hasFiles = fileTree && Object.keys(fileTree).length > 0;
  const [selectedFile, setSelectedFile] = useState<string | null>(
    hasFiles ? Object.keys(fileTree!)[0] : null
  );

  if (viewMode === "chat") {
    return (
      <Typography sx={{ whiteSpace: "pre-wrap",fontFamily:"monospace", fontSize: "1rem" }}>
        {`${text}\n${additionalExplanation || " "}`}
      </Typography>
    );
  }

  if (!hasFiles) {
    return (
      <Typography sx={{ whiteSpace: "pre-wrap", fontFamily:"monospace", fontSize: "1rem" }}>
        {text || "No content available."}
      </Typography>
    );
  }

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
        {Object.keys(fileTree!).map((fileName) => (
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
          {selectedFile}
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
            ? fileTree?.[selectedFile]?.file?.contents || "No content"
            : "Click on a file to view its content."}
        </Paper>
      </Box>
    </Box>
  );

};

export default AiResponse;
