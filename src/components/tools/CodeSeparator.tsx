import { useState } from "react";
import {
  FileCode,
  FileType,
  Check,
  Copy,
  Download,
  Trash2,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const CodeSeparator = () => {
  const [inputCode, setInputCode] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [cssOutput, setCssOutput] = useState("");
  const [jsOutput, setJsOutput] = useState("");
  const [status, setStatus] = useState("");

  const handleSeparate = () => {
    if (!inputCode.trim()) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(inputCode, "text/html");

    // Extract CSS
    const styleTags = Array.from(doc.querySelectorAll("style"));
    const cssContent = styleTags
      .map((tag) => tag.innerHTML)
      .join("\n\n/* --- Next Style Block --- */\n\n");
    setCssOutput(cssContent.trim());
    styleTags.forEach((tag) => tag.remove());

    // Extract JS
    const scriptTags = Array.from(doc.querySelectorAll("script:not([src])"));
    const jsContent = scriptTags
      .map((tag) => tag.innerHTML)
      .join("\n\n// --- Next Script Block ---\n\n");
    setJsOutput(jsContent.trim());
    scriptTags.forEach((tag) => tag.remove());

    // Add links to separated files
    if (cssContent.trim()) {
      const linkTag = doc.createElement("link");
      linkTag.setAttribute("rel", "stylesheet");
      linkTag.setAttribute("href", "style.css");
      doc.head.appendChild(linkTag);
    }
    if (jsContent.trim()) {
      const scriptTag = doc.createElement("script");
      scriptTag.setAttribute("src", "script.js");
      scriptTag.setAttribute("defer", "");
      doc.body.appendChild(scriptTag);
    }

    setHtmlOutput(`<!DOCTYPE html>\n${doc.documentElement.outerHTML}`);
    setStatus("Separation complete!");
    setTimeout(() => setStatus(""), 3000);
  };

  const handleClear = () => {
    setInputCode("");
    setHtmlOutput("");
    setCssOutput("");
    setJsOutput("");
    setStatus("");
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setStatus("Copied to clipboard!");
    setTimeout(() => setStatus(""), 2000);
  };

  const downloadFile = (
    filename: string,
    content: string,
    mimeType: string
  ) => {
    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Code Separator
        </h1>
        <p className="text-muted-foreground">
          Extract CSS and JavaScript from HTML files into separate files.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" /> Paste HTML Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              rows={12}
              className="font-mono"
              placeholder="Paste your complete HTML file content here..."
            />
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleSeparate} disabled={!inputCode.trim()}>
                <Scissors className="mr-2 h-4 w-4" /> Separate Code
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={!inputCode && !htmlOutput}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
              {status && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <Check className="mr-1 h-3 w-3" /> {status}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {htmlOutput && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* HTML Output */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileType className="h-4 w-4" /> index.html
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(htmlOutput)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      downloadFile("index.html", htmlOutput, "text/html")
                    }
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={htmlOutput}
                  readOnly
                  className="font-mono text-xs h-[300px] bg-muted/50"
                />
              </CardContent>
            </Card>

            {/* CSS Output */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileType className="h-4 w-4" /> style.css
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(cssOutput)}
                    disabled={!cssOutput}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      downloadFile("style.css", cssOutput, "text/css")
                    }
                    disabled={!cssOutput}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cssOutput ? (
                  <Textarea
                    value={cssOutput}
                    readOnly
                    className="font-mono text-xs h-[300px] bg-muted/50"
                  />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground text-xs italic border rounded-md">
                    No CSS found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* JS Output */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileType className="h-4 w-4" /> script.js
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(jsOutput)}
                    disabled={!jsOutput}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      downloadFile("script.js", jsOutput, "text/javascript")
                    }
                    disabled={!jsOutput}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {jsOutput ? (
                  <Textarea
                    value={jsOutput}
                    readOnly
                    className="font-mono text-xs h-[300px] bg-muted/50"
                  />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground text-xs italic border rounded-md">
                    No JavaScript found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSeparator;
