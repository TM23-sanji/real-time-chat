// components/CodeBlock.tsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, language }: { code: string; language: string }) => (
  <SyntaxHighlighter language={language} style={materialLight} wrapLines showLineNumbers>
    {code}
  </SyntaxHighlighter>
);

export default CodeBlock;
