import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Box } from "@mui/material";

interface AIResponseProps {
  content: string;
}

const AiResponse: React.FC<AIResponseProps> = ({ content }) => {
    return (
      <Box
        sx={{
          bgcolor: "#f9f9f9",
          p: 2,
          borderRadius: 2,
          overflowY: "auto",
          height: "100%",
        }}
      >
        <ReactMarkdown
          children={content}
          components={{
            code({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) {
            return !inline ? (
                <Box
                  component="div"
                  sx={{
                    my: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ccc",
                  }}
                >
                  <SyntaxHighlighter
                    language="javascript"
                    style={materialDark}
                    customStyle={{ margin: 0, padding: "1rem", background: "#282c34" }}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </Box>
              ) : (
                <code style={{ backgroundColor: "#e0e0e0", padding: "2px 6px", borderRadius: 4 }}>
                  {children}
                </code>
              );
            },
          }}
        />
      </Box>
    );
  };
  
  export default AiResponse;
  