import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CommandItem = ({ cmd, desc }: { cmd: string; desc: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-3">
      <div className="space-y-1 flex-1">
        <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded text-primary font-semibold break-all">
          {cmd}
        </code>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

const GitCheatSheet = () => {
  const commands = {
    setup: [
      {
        cmd: 'git config --global user.name "[name]"',
        desc: "Set your name for all local repositories.",
      },
      {
        cmd: 'git config --global user.email "[email]"',
        desc: "Set your email for all local repositories.",
      },
      {
        cmd: "git init",
        desc: "Initialize a new local repository in the current directory.",
      },
      {
        cmd: "git clone [url]",
        desc: "Clone a remote repository to your local machine.",
      },
    ],
    staging: [
      {
        cmd: "git status",
        desc: "Show the status of changes as untracked, modified, or staged.",
      },
      {
        cmd: "git add [file]",
        desc: "Add a file to the staging area. Use `.` to add all modified files.",
      },
      {
        cmd: 'git commit -m "[message]"',
        desc: "Commit the staged changes with a descriptive message.",
      },
      {
        cmd: "git commit --amend",
        desc: "Modify the most recent commit (message or content).",
      },
    ],
    branching: [
      {
        cmd: "git branch",
        desc: "List all local branches. `*` indicates the current branch.",
      },
      { cmd: "git branch [branch-name]", desc: "Create a new branch." },
      {
        cmd: "git checkout [branch-name]",
        desc: "Switch to another branch.",
      },
      {
        cmd: "git checkout -b [branch-name]",
        desc: "Create a new branch and switch to it.",
      },
      {
        cmd: "git merge [branch-name]",
        desc: "Merge a branch's history into the current branch.",
      },
      {
        cmd: "git branch -d [branch-name]",
        desc: "Delete a local branch.",
      },
    ],
    inspecting: [
      {
        cmd: "git log",
        desc: "Show commit history for the current branch.",
      },
      {
        cmd: "git log --oneline",
        desc: "Show commit history in a compact, single-line format.",
      },
      {
        cmd: "git diff",
        desc: "Show changes between working directory and staging area.",
      },
      {
        cmd: "git diff --staged",
        desc: "Show changes between the staging area and the last commit.",
      },
      {
        cmd: "git show [commit-hash]",
        desc: "Show the metadata and content changes of a specific commit.",
      },
    ],
    undoing: [
      {
        cmd: "git reset [file]",
        desc: "Unstage a file, but preserve its content in the working directory.",
      },
      {
        cmd: "git checkout -- [file]",
        desc: "Discard all changes in a file in the working directory.",
      },
      {
        cmd: "git revert [commit-hash]",
        desc: "Create a new commit that undoes the changes of a specified commit.",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Git Cheat Sheet
        </h1>
        <p className="text-muted-foreground">
          Essential Git commands for version control.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-500" /> Setup & Config
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {commands.setup.map((cmd, i) => (
              <CommandItem key={i} {...cmd} />
            ))}
          </CardContent>
        </Card>

        {/* Staging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-yellow-500" /> Stage & Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {commands.staging.map((cmd, i) => (
              <CommandItem key={i} {...cmd} />
            ))}
          </CardContent>
        </Card>

        {/* Branching */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-500" /> Branch & Merge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {commands.branching.map((cmd, i) => (
              <CommandItem key={i} {...cmd} />
            ))}
          </CardContent>
        </Card>

        {/* Inspecting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-500" /> Inspect & Compare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {commands.inspecting.map((cmd, i) => (
              <CommandItem key={i} {...cmd} />
            ))}
          </CardContent>
        </Card>

        {/* Undoing */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-red-500" /> Undo Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {commands.undoing.map((cmd, i) => (
              <CommandItem key={i} {...cmd} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GitCheatSheet;
