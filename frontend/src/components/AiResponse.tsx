import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";

export interface FileTreeContent {
  [key: string]: {
    file: { contents: string };
  };
}

export interface AiResponseProps {
  text: string;
  fileTree: FileTreeContent;
  buildCommand?: { mainItem: string; commands: string[] };
  startCommand?: { mainItem: string; commands: string[] };
  additionalExplanation?: string;
  viewMode: "chat" | "code";
  webContainer: WebContainer | null;
}

const AiResponse: React.FC<AiResponseProps> = ({
  text,
  fileTree,
  additionalExplanation,
  viewMode,
  webContainer,
}) => {
  const hasFiles = fileTree && Object.keys(fileTree).length > 0;
  const [selectedFile, setSelectedFile] = useState<string | null>(
    hasFiles ? Object.keys(fileTree!)[0] : null
  );
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [customPath, setCustomPath] = useState("");
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const [runProcess, setRunProcess] = useState<WebContainerProcess | null>(
    null
  );

  useEffect(() => {
    if (selectedFile && fileTree?.[selectedFile]?.file?.contents) {
      setEditedFiles((prev) => {
        // Only set if this file hasn't been edited yet
        if (!(selectedFile in prev)) {
          return {
            ...prev,
            [selectedFile]: fileTree[selectedFile].file.contents,
          };
        }
        return prev;
      });
    }
  }, [selectedFile, fileTree]);

  if (viewMode === "chat") {
    return (
      <Typography
        sx={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "1rem",
        }}
      >
        {`${text}\n${additionalExplanation || " "}`}
      </Typography>
    );
  }

  if (!hasFiles) {
    return (
      <Typography
        sx={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "1rem",
        }}
      >
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
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              overflow: "hidden",
            }}
          >
            {fileName}
          </Button>
        ))}
      </Box>

      {/* File Content Display */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {selectedFile}
          </Typography>

          <Tooltip title="Run">
            <IconButton
              size="small"
              onClick={async () => {
                const installProcess = await webContainer?.spawn("npm", [
                  "install",
                ]);
                installProcess?.output.pipeTo(
                  new WritableStream({
                    write(data) {
                      console.log(data);
                    },
                  })
                );
                if (runProcess) {
                  runProcess.kill();
                }
                const tempRunProcess = await webContainer?.spawn("npm", [
                  "start",
                ]);
                tempRunProcess?.output.pipeTo(
                  new WritableStream({
                    write(data) {
                      console.log(data);
                    },
                  })
                );
                if (tempRunProcess) {
                  setRunProcess(tempRunProcess);
                }

                webContainer?.on(
                  "server-ready",
                  (port: number, url: string): void => {
                    setBaseUrl(url);
                    setIframeUrl(url);
                  }
                );
              }}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              multiline
              fullWidth
              minRows={20}
              maxRows={50}
              value={selectedFile ? editedFiles[selectedFile] || "" : ""}
              onChange={(e) =>
                setEditedFiles((prev) => ({
                  ...prev,
                  [selectedFile || ""]: e.target.value,
                }))
              }
              sx={{
                fontFamily: "monospace",
                bgcolor: "#f9f9f9",
                flex: 1,
                overflowX: "auto",
              }}
            />

            <Button
              variant="contained"
              onClick={async () => {
                if (webContainer && selectedFile && editedFiles[selectedFile]) {
                  await webContainer.fs.writeFile(
                    selectedFile,
                    editedFiles[selectedFile]
                  );
                  console.log(`${selectedFile} updated`);
                }
              }}
            >
              Save & Reload
            </Button>
          </Box>

          {iframeUrl && webContainer && (
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="/route"
                  variant="outlined"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (baseUrl) {
                      const normalizedPath = customPath.startsWith("/")
                        ? customPath
                        : `/${customPath}`;
                      setIframeUrl(`${baseUrl}${normalizedPath}`);
                    }
                  }}
                >
                  Go
                </Button>
              </Box>

              <iframe
                src={iframeUrl}
                className="w-full"
                style={{
                  height: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  flex: 1,
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AiResponse;
