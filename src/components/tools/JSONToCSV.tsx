import { useState } from "react";
import {
  FileJson,
  FileSpreadsheet,
  Download,
  Copy,
  Trash2,
  AlertTriangle,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const JSONToCSV = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [separator, setSeparator] = useState(",");
  const [customSeparator, setCustomSeparator] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const sanitizeCsvField = (field: any, sep: string) => {
    const fieldStr = String(field ?? "");
    const needsQuoting =
      fieldStr.includes(sep) ||
      fieldStr.includes('"') ||
      fieldStr.includes("\n");

    if (needsQuoting) {
      const escapedStr = fieldStr.replace(/"/g, '""');
      return `"${escapedStr}"`;
    }
    return fieldStr;
  };

  const jsonToCsv = (data: any[], sep: string) => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const sanitizedHeaders = headers
      .map((h) => sanitizeCsvField(h, sep))
      .join(sep);

    const rows = data.map((obj) => {
      return headers
        .map((header) => {
          return sanitizeCsvField(obj[header], sep);
        })
        .join(sep);
    });

    return [sanitizedHeaders, ...rows].join("\n");
  };

  const handleConvert = () => {
    setError("");
    const jsonString = jsonInput.trim();

    let sep = separator;
    if (sep === "custom") {
      sep = customSeparator;
      if (!sep) {
        setError("Custom separator cannot be empty.");
        return;
      }
    }

    if (!jsonString) {
      setError("JSON input is empty.");
      setCsvOutput("");
      return;
    }

    try {
      const data = JSON.parse(jsonString);

      if (!Array.isArray(data)) {
        setError("Your JSON requires wrapping in [ ].");
        setCsvOutput("");
        return;
      }

      const csvString = jsonToCsv(data, sep);
      setCsvOutput(csvString);
      if (csvString.length > 0) {
        showToast("Conversion successful!", "success");
      }
    } catch (err) {
      setError("Invalid JSON format. Please check for syntax errors.");
      setCsvOutput("");
    }
  };

  const handleDownload = () => {
    if (!csvOutput) {
      showToast("Nothing to download.", "info");
      return;
    }
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Download started!", "success");
  };

  const handleCopy = () => {
    if (csvOutput) {
      navigator.clipboard.writeText(csvOutput).then(() => {
        showToast("CSV copied to clipboard!", "success");
      });
    } else {
      showToast("Nothing to copy.", "info");
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setCsvOutput("");
    setError("");
    showToast("Cleared fields.", "info");
  };

  const fixJsonArray = () => {
    const currentJson = jsonInput.trim();
    if (currentJson) {
      setJsonInput(`[${currentJson}]`);
      setError("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">JSON to CSV</h1>
        <p className="text-muted-foreground">
          Convert JSON data objects to CSV format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <FileJson className="h-4 w-4" /> JSON Input
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              title="Clear all"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0 flex flex-col gap-2">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 font-mono text-sm resize-none"
              placeholder={
                '[\\n  {\\n    "id": 1,\\n    "name": "Product A",\\n    "price": 19.99,\\n    "inStock": true\\n  }\\n]'
              }
            />
            {error && (
              <div className="text-sm text-destructive font-medium flex items-center gap-2 mt-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
                {error === "Your JSON requires wrapping in [ ]." && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-destructive underline"
                    onClick={fixJsonArray}
                  >
                    Fix it
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CSV Output */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <FileSpreadsheet className="h-4 w-4" /> CSV Output
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!csvOutput}
                title="Copy CSV"
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={!csvOutput}
                title="Download CSV"
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <Textarea
              value={csvOutput}
              readOnly
              className="h-full font-mono text-sm resize-none bg-muted"
              placeholder="CSV output will appear here..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-1/3 space-y-2">
              <Label>Separator</Label>
              <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select separator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="|">Pipe (|)</SelectItem>
                  <SelectItem value="\t">Tab (\t)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {separator === "custom" && (
              <div className="w-full md:w-1/6 space-y-2">
                <Label>Custom</Label>
                <Input
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  placeholder="Char"
                  maxLength={1}
                />
              </div>
            )}

            <div className="flex-1 flex justify-end">
              <Button
                onClick={handleConvert}
                className="w-full md:w-auto min-w-[150px]"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Convert to CSV
              </Button>
            </div>
          </div>

          {toast && (
            <div
              className={`mt-4 text-sm font-medium flex items-center justify-center ${
                toast.type === "success"
                  ? "text-green-600 dark:text-green-400"
                  : toast.type === "error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
              }`}
            >
              {toast.msg}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JSONToCSV;
