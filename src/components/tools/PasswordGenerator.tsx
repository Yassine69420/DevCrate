import { useState, useEffect } from "react";
import { Copy, RefreshCw, Trash2, Sliders, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface HistoryItem {
  password: string;
  timestamp: string;
}

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("Click Generate!");
  const [strength, setStrength] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/\\'\"`;:.,<>";

  useEffect(() => {
    const savedHistory = localStorage.getItem("passwordHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    generatePassword();
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const replaceRandomChar = (str: string, charset: string) => {
    const pos = Math.floor(Math.random() * str.length);
    const newChar = charset[Math.floor(Math.random() * charset.length)];
    return str.substring(0, pos) + newChar + str.substring(pos + 1);
  };

  const calculateStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s += 20;
    if (pwd.length >= 12) s += 20;
    if (pwd.length >= 16) s += 20;
    if (/[a-z]/.test(pwd)) s += 10;
    if (/[A-Z]/.test(pwd)) s += 10;
    if (/[0-9]/.test(pwd)) s += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) s += 10;
    setStrength(s);
  };

  const addToHistory = (pwd: string) => {
    const timestamp = new Date().toLocaleString();
    const newHistory = [{ password: pwd, timestamp }, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("passwordHistory", JSON.stringify(newHistory));
  };

  const generatePassword = () => {
    let charset = "";

    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (excludeSimilar) {
      charset = charset
        .split("")
        .filter((char) => !similarChars.includes(char))
        .join("");
    }
    if (excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((char) => !ambiguousChars.includes(char))
        .join("");
    }

    if (charset.length === 0) {
      if (password !== "Click Generate!") {
        showToast("Please select at least one character type", "error");
      }
      return;
    }

    let generated = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }

    if (includeUppercase && !generated.match(/[A-Z]/))
      generated = replaceRandomChar(generated, uppercase);
    if (includeLowercase && !generated.match(/[a-z]/))
      generated = replaceRandomChar(generated, lowercase);
    if (includeNumbers && !generated.match(/[0-9]/))
      generated = replaceRandomChar(generated, numbers);
    if (includeSymbols && !generated.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/))
      generated = replaceRandomChar(generated, symbols);

    setPassword(generated);
    calculateStrength(generated);
    addToHistory(generated);
  };

  const copyToClipboard = (text: string) => {
    if (text === "Click Generate!") return;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Password copied!", "success");
    });
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all password history?")) {
      setHistory([]);
      localStorage.removeItem("passwordHistory");
      showToast("History cleared", "success");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Password Generator
        </h1>
        <p className="text-muted-foreground">
          Create secure, random passwords with custom settings.
        </p>
      </div>
      {/* Password Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            Generated Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between gap-4">
              <Input
                type="text"
                readOnly
                className="flex-1 bg-transparent border-none shadow-none font-mono text-xl md:text-2xl font-bold outline-none select-all focus-visible:ring-0 px-0 h-auto"
                value={password}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(password)}
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                  title="Copy to clipboard"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button
                  onClick={generatePassword}
                  size="icon"
                  variant="secondary"
                  title="Generate new password"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Password Strength:</span>
              <span
                className={`font-bold ${
                  strength < 40
                    ? "text-red-500"
                    : strength < 70
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {strength < 40 ? "Weak" : strength < 70 ? "Medium" : "Strong"}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  strength < 40
                    ? "bg-red-500 w-1/3"
                    : strength < 70
                      ? "bg-yellow-500 w-2/3"
                      : "bg-green-500 w-full"
                }`}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Customization Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Password Length</label>
              <span className="text-xl font-bold text-primary">{length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          <Separator />

          {/* Character Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: "upper",
                label: "Uppercase Letters",
                sub: "A-Z",
                state: includeUppercase,
                setter: setIncludeUppercase,
              },
              {
                id: "lower",
                label: "Lowercase Letters",
                sub: "a-z",
                state: includeLowercase,
                setter: setIncludeLowercase,
              },
              {
                id: "numbers",
                label: "Numbers",
                sub: "0-9",
                state: includeNumbers,
                setter: setIncludeNumbers,
              },
              {
                id: "symbols",
                label: "Special Characters",
                sub: "!@#$%^&*",
                state: includeSymbols,
                setter: setIncludeSymbols,
              },
            ].map((opt) => (
              <div
                key={opt.id}
                className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={opt.id}
                  checked={opt.state}
                  onCheckedChange={(checked) => opt.setter(checked as boolean)}
                />
                <label
                  htmlFor={opt.id}
                  className="flex-1 cursor-pointer grid gap-0.5"
                >
                  <span className="text-sm font-medium leading-none">
                    {opt.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {opt.sub}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* Advanced Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <Checkbox
                id="excludeSimilar"
                checked={excludeSimilar}
                onCheckedChange={(checked) =>
                  setExcludeSimilar(checked as boolean)
                }
              />
              <label
                htmlFor="excludeSimilar"
                className="flex-1 cursor-pointer grid gap-0.5"
              >
                <span className="text-sm font-medium leading-none">
                  Exclude Similar Characters
                </span>
                <span className="text-xs text-muted-foreground">
                  Excludes: i, l, 1, L, o, 0, O
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <Checkbox
                id="excludeAmbiguous"
                checked={excludeAmbiguous}
                onCheckedChange={(checked) =>
                  setExcludeAmbiguous(checked as boolean)
                }
              />
              <label
                htmlFor="excludeAmbiguous"
                className="flex-1 cursor-pointer grid gap-0.5"
              >
                <span className="text-sm font-medium leading-none">
                  Exclude Ambiguous Characters
                </span>
                <span className="text-xs text-muted-foreground">
                  Excludes: {"{}[]()/\\'\"`:.,<>"}
                </span>
              </label>
            </div>
          </div>

          <Button
            onClick={generatePassword}
            className="w-full h-12 text-lg font-semibold shadow-lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" /> Generate Password
          </Button>
        </CardContent>
      </Card>

      {/* Password History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Passwords
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mt-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No passwords generated yet
              </p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 group transition-all"
                >
                  <div className="flex-1 mr-4 overflow-hidden">
                    <p className="font-mono font-semibold truncate">
                      {item.password}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.timestamp}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(item.password)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
