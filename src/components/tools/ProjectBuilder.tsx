import { useState, useEffect } from "react";
import { Folder, Terminal, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProjectBuilder = () => {
  const [input, setInput] = useState(`src/
  components/
    Header.js
    Footer.js
    ui/
      Button.jsx
      Card.jsx
  utils/
    api.ts
  App.js
public/
  index.html
  robots.txt
README.md`);
  const [shell, setShell] = useState("cmd");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ folders: 0, files: 0 });
  const [copied, setCopied] = useState(false);

  // --- Parser Logic ---
  const parseStructure = (text: string) => {
    const lines = text.split("\n");
    const result: { path: string; type: "file" | "folder"; name: string }[] =
      [];
    const stack: { indent: number; name: string }[] = [];

    lines.forEach((line) => {
      // 1. Skip empty lines
      if (!line.trim()) return;

      // 2. Detect Indentation
      const rawIndentMatch = line.match(/^[\s\t│├└─]*/);
      const rawIndentStr = rawIndentMatch ? rawIndentMatch[0] : "";
      const indentLevel = rawIndentStr.length;

      // 3. Clean Filename
      let name = line.replace(/^[\s\t│├└─]+/, "").trim();
      name = name.split("#")[0].trim(); // Remove comments

      if (!name) return;

      // 4. Manage Hierarchy
      while (
        stack.length > 0 &&
        stack[stack.length - 1].indent >= indentLevel
      ) {
        stack.pop();
      }

      // 5. Build Path
      const parentPath = stack.map((s) => s.name).join("/");

      // 6. Determine Type (Folder if ends with / or \, or no extension - heuristic)
      let type: "file" | "folder" = "file";
      if (name.endsWith("/") || name.endsWith("\\") || !name.includes(".")) {
        type = "folder";
        name = name.replace(/[/\\]$/, "");
      }

      // 7. Push to results
      const finalPath = parentPath ? `${parentPath}/${name}` : name;
      result.push({ path: finalPath, type: type, name: name });

      if (type === "folder") {
        stack.push({ indent: indentLevel, name: name });
      }
    });

    return result;
  };

  // --- Generators ---
  const generateCmdCommands = (
    structure: { path: string; type: "file" | "folder" }[]
  ) => {
    const commands = ["@echo off"];
    structure.forEach((item) => {
      const path = item.path.replace(/\//g, "\\");
      if (item.type === "folder") {
        commands.push(`if not exist "${path}" mkdir "${path}"`);
      } else {
        // Create parent dir if needed logic is complicated in batch line-by-line without logic,
        // usually we assume folder comes first in tree traversal.
        // But for safety let's just create file.
        // Actually the parser returns tree order so folders come before files inside them usually.
        commands.push(`type nul > "${path}"`);
      }
    });
    return commands.join("\n");
  };

  const generatePowerShellCommands = (
    structure: { path: string; type: "file" | "folder" }[]
  ) => {
    const commands: string[] = [];
    structure.forEach((item) => {
      const path = item.path.replace(/\//g, "\\");
      const type = item.type === "folder" ? "Directory" : "File";
      // Force to create parents is simpler in PS
      commands.push(`New-Item -Path "${path}" -ItemType ${type} -Force`);
    });
    return commands.join("\n");
  };

  const generateBashCommands = (
    structure: { path: string; type: "file" | "folder" }[]
  ) => {
    const commands = ["#!/bin/bash"];
    structure.forEach((item) => {
      const path = item.path.replace(/\\/g, "/"); // Ensure forward slashes
      if (item.type === "folder") {
        commands.push(`mkdir -p "${path}"`);
      } else {
        const parent = path.substring(0, path.lastIndexOf("/"));
        if (parent && parent.length > 0) {
          // Ensure parent exists
          commands.push(`mkdir -p "${parent}" && touch "${path}"`);
        } else {
          commands.push(`touch "${path}"`);
        }
      }
    });
    return commands.join("\n");
  };

  useEffect(() => {
    const structure = parseStructure(input);

    // Stats
    const folders = structure.filter((i) => i.type === "folder").length;
    const files = structure.filter((i) => i.type === "file").length;
    setStats({ folders, files });

    // Generate output
    let generated = "";
    if (input.trim()) {
      switch (shell) {
        case "cmd":
          generated = generateCmdCommands(structure);
          break;
        case "powershell":
          generated = generatePowerShellCommands(structure);
          break;
        case "bash":
          generated = generateBashCommands(structure);
          break;
      }
    }
    setOutput(generated);
  }, [input, shell]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Project Builder
        </h1>
        <p className="text-muted-foreground">
          Turn text structures into actual files and folders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Input Column */}
        <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Folder className="h-4 w-4 text-indigo-500" /> Project Structure
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInput("")}
              title="Clear Input"
              className="h-8 w-8 text-slate-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed rounded-none"
              placeholder={`src/\n  components/\n    App.js`}
              spellCheck={false}
            />
            <div className="px-4 py-2 border-t text-xs text-muted-foreground bg-muted/20 flex justify-between items-center">
              <span>Supports Indentation (Tabs/Spaces)</span>
              <span className="font-medium">
                Detected: {stats.folders} folders, {stats.files} files
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Output Column */}
        <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm bg-slate-950 text-slate-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-base font-medium text-emerald-100">
                Generated Script
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select value={shell} onValueChange={setShell}>
                <SelectTrigger className="h-8 w-[120px] bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="cmd">CMD (Batch)</SelectItem>
                  <SelectItem value="powershell">PowerShell</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleCopy}
                disabled={!output}
                size="sm"
                className={`h-8 transition-colors ${copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white border-0`}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 overflow-auto p-4 custom-scrollbar">
              {output ? (
                <pre className="font-mono text-sm text-emerald-300 whitespace-pre-wrap break-all">
                  {output}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                  <Terminal className="w-12 h-12 mb-4" />
                  <p>Start typing to generate commands</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 text-xs text-slate-400">
            {shell === "cmd" &&
              "Tip: Save as .bat or paste into Command Prompt."}
            {shell === "powershell" &&
              "Tip: Save as .ps1 or paste into PowerShell."}
            {shell === "bash" && "Tip: Save as .sh or paste into Terminal."}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectBuilder;
