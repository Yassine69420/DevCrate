import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { Copy, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const Markdown = () => {
  const [markdownInput, setMarkdownInput] =
    useState(`# Welcome to the Markdown Previewer!

This tool renders your Markdown text into HTML in real-time.

## Features
- **Live Preview:** See changes as you type.
- **Syntax Highlighting:** Code blocks are automatically highlighted.
- **Secure:** HTML output is sanitized to prevent XSS attacks.
- **GitHub Flavored Markdown:** Includes support for tables, strikethrough, and more.
- **PDF Export:** You can now export the result to a PDF!

### Example Code Block
\`\`\`javascript
// A simple hello world function
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('DevCrate User');
\`\`\`

### Example Table
| Feature             | Status      | Priority |
|---------------------|-------------|----------|
| Real-time           | Implemented | High     |
| Syntax Highlighting | Implemented | High     |
| PDF Export          | Implemented | Medium   |

> This is a blockquote. Isn't it neat?

Start typing in the left pane to see the magic happen!
`);
  const [htmlOutput, setHtmlOutput] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    marked.setOptions({
      highlight: function (code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
      gfm: true,
      breaks: false,
    } as any);
  }, []);

  useEffect(() => {
    const parseMarkdown = async () => {
      const dirtyHtml = await marked.parse(markdownInput);
      const cleanHtml = DOMPurify.sanitize(dirtyHtml);
      setHtmlOutput(cleanHtml);
    };
    parseMarkdown();
  }, [markdownInput]);

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownInput).then(() => {
      showToast("Markdown copied!", "success");
    });
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput).then(() => {
      showToast("HTML copied!", "success");
    });
  };

  const handleClear = () => {
    setMarkdownInput("");
  };

  const handleExportPdf = () => {
    const element = document.getElementById("htmlOutput");
    if (!element) return;

    showToast("Generating PDF...", "info");

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename: "markdown_preview.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        showToast("PDF Downloaded!", "success");
      })
      .catch((err: any) => {
        console.error(err);
        showToast("Failed to generate PDF", "error");
      });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 flex flex-col">
      <div className="text-center mb-0">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Markdown Preview
        </h1>
        <p className="text-muted-foreground">
          Write Markdown and see rendered HTML.
        </p>
      </div>
      {/* Action Buttons */}
      <Card className="p-2">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <Button variant="ghost" size="sm" onClick={handleCopyMarkdown}>
            <Copy className="mr-2 h-4 w-4" /> Copy Markdown
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopyHtml}>
            <Copy className="mr-2 h-4 w-4" /> Copy HTML
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <div className="flex-grow sm:flex-grow-0 sm:ml-auto">
            <Button variant="destructive" size="sm" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-4 bg-muted/50 border-b">
            <CardTitle className="text-sm font-medium">Input</CardTitle>
          </CardHeader>
          <div className="flex-1 p-0 h-full">
            <Textarea
              value={markdownInput}
              onChange={(e) => setMarkdownInput(e.target.value)}
              className="w-full h-full p-4 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm leading-relaxed min-h-[500px]"
              placeholder="# Start typing Markdown..."
            />
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-4 bg-muted/50 border-b">
            <CardTitle className="text-sm font-medium">Preview</CardTitle>
          </CardHeader>
          <div className="flex-1 p-4 overflow-auto bg-white dark:bg-zinc-950 text-foreground min-h-[500px]">
            <div
              id="htmlOutput"
              className="prose dark:prose-invert max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            ></div>
          </div>
        </Card>
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg z-50 ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Markdown;
