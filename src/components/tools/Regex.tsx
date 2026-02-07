import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, AlertCircle, Trash2 } from "lucide-react";

interface Toast {
  msg: string;
  type: "success" | "error";
}

const Regex = () => {
  const [regexPattern, setRegexPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flagGlobal, setFlagGlobal] = useState(true);
  const [flagIgnoreCase, setFlagIgnoreCase] = useState(true);
  const [flagMultiline, setFlagMultiline] = useState(false);
  const [highlightedOutput, setHighlightedOutput] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [regexError, setRegexError] = useState("");
  const [allMatches, setAllMatches] = useState<string[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    runTest();
  }, [regexPattern, testString, flagGlobal, flagIgnoreCase, flagMultiline]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const runTest = () => {
    let flags = "";
    if (flagGlobal) flags += "g";
    if (flagIgnoreCase) flags += "i";
    if (flagMultiline) flags += "m";

    setRegexError("");
    setAllMatches([]);

    if (!regexPattern) {
      setHighlightedOutput(escapeHtml(testString));
      setMatchCount(0);
      return;
    }
    if (!testString) {
      setHighlightedOutput(
        '<span class="text-muted-foreground">// Matches will be highlighted here...</span>'
      );
      setMatchCount(0);
      return;
    }

    try {
      const regex = new RegExp(regexPattern, flags);
      let outputHtml = "";
      let lastIndex = 0;
      const matches = Array.from(testString.matchAll(regex));
      const currentMatches = [];

      for (const match of matches) {
        currentMatches.push(match[0]);
        const startIndex = match.index;
        const endIndex = startIndex + match[0].length;
        outputHtml += escapeHtml(testString.substring(lastIndex, startIndex));
        outputHtml += `<span class="bg-primary/20 border border-primary/30 rounded px-0.5">${escapeHtml(match[0])}</span>`;
        lastIndex = endIndex;
      }
      outputHtml += escapeHtml(testString.substring(lastIndex));
      setHighlightedOutput(outputHtml || escapeHtml(testString));
      setMatchCount(currentMatches.length);
      setAllMatches(currentMatches);
    } catch (e: unknown) {
      const error = e as Error;
      setRegexError(error.message);
      setHighlightedOutput(escapeHtml(testString));
      setMatchCount(0);
    }
  };

  const handleCopyMatches = () => {
    if (allMatches.length > 0) {
      navigator.clipboard
        .writeText(allMatches.join("\n"))
        .then(() => {
          showToast("Matches copied!", "success");
        })
        .catch(() => {
          showToast("Failed to copy matches", "error");
        });
    }
  };

  const handleClear = () => {
    setTestString("");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto space-y-8 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Regex Tester
          </h1>
          <p className="text-muted-foreground">
            Test and debug your regular expressions in real-time
          </p>
        </div>

        {/* REGEX INPUT */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              <div className="flex-grow w-full">
                <label
                  htmlFor="regexPattern"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
                >
                  Regular Expression
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground text-lg">
                    /
                  </span>
                  <Input
                    type="text"
                    id="regexPattern"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    placeholder="Enter your regex pattern here"
                    className={`font-mono w-full pl-7 pr-7 ${regexError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <span className="absolute right-3 text-muted-foreground text-lg">
                    /
                  </span>
                </div>
                {regexError && (
                  <p className="text-destructive text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {regexError}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-6 pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={flagGlobal}
                    onCheckedChange={(checked) => setFlagGlobal(!!checked)}
                  />
                  <span className="text-sm font-mono font-semibold">g</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={flagIgnoreCase}
                    onCheckedChange={(checked) => setFlagIgnoreCase(!!checked)}
                  />
                  <span className="text-sm font-mono font-semibold">i</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={flagMultiline}
                    onCheckedChange={(checked) => setFlagMultiline(!!checked)}
                  />
                  <span className="text-sm font-mono font-semibold">m</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEXT & OUTPUT PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TEST STRING */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/50">
              <h2 className="text-lg font-semibold">Test String</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                title="Clear input"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full h-96 p-6 bg-background focus:outline-none resize-none font-mono text-sm leading-relaxed"
              placeholder="Paste your test string here..."
              spellCheck="false"
            ></textarea>
          </Card>

          {/* MATCH RESULTS */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/50">
              <h2 className="text-lg font-semibold">
                Match Result{" "}
                <span className="text-primary">({matchCount})</span>
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyMatches}
                disabled={allMatches.length === 0}
                className="h-8 w-8"
                title="Copy All Matches"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div
              className="w-full h-96 p-6 bg-muted/30 overflow-auto font-mono text-sm whitespace-pre-wrap break-words leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedOutput }}
            ></div>
          </Card>
        </div>

        {/* CHEATSHEET */}
        <Card>
          <CardHeader>
            <CardTitle>Regex Cheatsheet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
              <div className="space-y-3">
                <h3 className="font-bold text-primary text-base mb-3">
                  Anchors
                </h3>
                <p className="flex items-start gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono font-semibold text-foreground">
                    ^
                  </code>
                  <span className="text-muted-foreground">Start of string</span>
                </p>
                <p className="flex items-start gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono font-semibold text-foreground">
                    $
                  </code>
                  <span className="text-muted-foreground">End of string</span>
                </p>
                <p className="flex items-start gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono font-semibold text-foreground">
                    \b
                  </code>
                  <span className="text-muted-foreground">Word boundary</span>
                </p>
              </div>
              {/* Add more sections similarly if needed, for brevity ensuring key structure is kept */}
              {/* Quantifiers */}
              <div className="space-y-3">
                <h3 className="font-bold text-primary text-base mb-3">
                  Quantifiers
                </h3>
                <p className="flex items-start gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono font-semibold text-foreground">
                    *
                  </code>
                  <span className="text-muted-foreground">0 or more</span>
                </p>
                <p className="flex items-start gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono font-semibold text-foreground">
                    +
                  </code>
                  <span className="text-muted-foreground">1 or more</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {toast && (
          <div
            className={`fixed bottom-6 right-6 text-primary-foreground px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-fade-in ${toast.type === "success" ? "bg-primary" : "bg-destructive"}`}
          >
            {toast.type === "success" ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Regex;
