import { useState } from "react";
import { ArrowLeftRight, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const Base64 = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });

  // Standard Base64 encoding for UTF-8 strings
  const b64Encode = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  // Standard Base64 decoding for UTF-8 strings
  const b64Decode = (str: string) => {
    try {
      // atob can fail if padding is missing; add it if necessary
      const padded = str.padEnd(Math.ceil(str.length / 4) * 4, "=");
      return decodeURIComponent(escape(atob(padded)));
    } catch (e) {
      throw new Error("Invalid Base64 input");
    }
  };

  const handleAction = (action: "encode" | "decode") => {
    if (!inputText) {
      setStatus({ message: "Input text cannot be empty.", type: "error" });
      return;
    }

    try {
      if (action === "encode") {
        setOutputText(b64Encode(inputText));
        setStatus({ message: "Encoded successfully", type: "success" });
      } else {
        setOutputText(b64Decode(inputText));
        setStatus({ message: "Decoded successfully", type: "success" });
      }
    } catch (e: any) {
      setStatus({
        message: e.message || "Operation failed. Check input format.",
        type: "error",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setStatus({ message: "Copied to clipboard!", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    }
  };

  const swapInputs = () => {
    setInputText(outputText);
    setOutputText(""); // Clear output after swapping
    setStatus({ message: "Input/Output swapped!", type: "success" });
    setTimeout(() => setStatus({ message: "", type: "" }), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Base64 Converter
        </h1>
        <p className="text-muted-foreground">
          Convert between Base64 and plain text.
        </p>
      </div>

      {/* Input and Result in the same row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Input</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInputText("")}
                title="Clear Input"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(inputText)}
                title="Copy Input"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              className="h-[300px] font-mono resize-none"
              placeholder="Enter text to encode or Base64 string to decode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Result</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={swapInputs}
                title="Swap Input/Output"
                disabled={!outputText}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOutputText("")}
                title="Clear Output"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(outputText)}
                title="Copy Output"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              className="h-[300px] font-mono resize-none bg-muted"
              readOnly
              placeholder="Result will appear here..."
              value={outputText}
            />
          </CardContent>
        </Card>
      </div>

      {/* Action buttons centered below */}
      <div className="flex justify-center gap-4 mt-4">
        <Button className="w-32" onClick={() => handleAction("encode")}>
          Encode <ArrowLeftRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          className="w-32"
          variant="secondary"
          onClick={() => handleAction("decode")}
        >
          Decode <ArrowLeftRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Status message */}
      {status.message && (
        <div
          className={`text-sm font-medium px-4 py-2 rounded-md mt-4 ${
            status.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
};

export default Base64;
