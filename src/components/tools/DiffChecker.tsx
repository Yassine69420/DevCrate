import { useState, useEffect } from "react";
import { createTwoFilesPatch } from "diff";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui";
import "diff2html/bundles/css/diff2html.min.css";
import { GitCompare, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const DiffChecker = () => {
  const [originalText, setOriginalText] = useState("");
  const [changedText, setChangedText] = useState("");

  const generateDiff = () => {
    if (!originalText && !changedText) {
      const targetElement = document.getElementById("diff-output");
      if (targetElement) targetElement.innerHTML = "";
      return;
    }

    const diffStr = createTwoFilesPatch(
      "Original",
      "Changed",
      originalText,
      changedText,
      "",
      "",
      { context: 3 }
    );

    const targetElement = document.getElementById("diff-output");
    if (targetElement) {
      const diff2htmlUi = new Diff2HtmlUI(targetElement, diffStr, {
        drawFileList: false,
        matching: "lines",
        outputFormat: "side-by-side",
        renderNothingWhenEmpty: true,
      });
      diff2htmlUi.draw();
      diff2htmlUi.highlightCode();
    }
  };

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(changedText);
    setChangedText(temp);
  };

  const handleClear = () => {
    setOriginalText("");
    setChangedText("");
    const targetElement = document.getElementById("diff-output");
    if (targetElement) targetElement.innerHTML = "";
  };

  useEffect(() => {
    // Debounce diff generation
    const timer = setTimeout(() => {
      generateDiff();
    }, 500);
    return () => clearTimeout(timer);
  }, [originalText, changedText]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Diff Checker</h1>
        <p className="text-muted-foreground">
          Compare text or code files to see differences side-by-side.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex-1 w-full flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleSwap}
            disabled={!originalText && !changedText}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Swap
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={!originalText && !changedText}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Text */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="h-[300px] font-mono resize-none text-xs"
              placeholder="Paste original text here..."
            />
          </CardContent>
        </Card>

        {/* Changed Text */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Changed Text</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              value={changedText}
              onChange={(e) => setChangedText(e.target.value)}
              className="h-[300px] font-mono resize-none text-xs"
              placeholder="Paste changed text here..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Diff Output */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" /> Diff Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div id="diff-output" className="diff-container text-sm"></div>
          {!originalText && !changedText && (
            <div className="h-32 flex flex-col items-center justify-center text-muted-foreground opacity-50 border-2 border-dashed rounded-lg">
              <GitCompare className="h-8 w-8 mb-2" />
              <p>Enter text above to generate diff</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiffChecker;
