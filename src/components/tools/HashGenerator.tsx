import { useState } from "react";
import CryptoJS from "crypto-js";
import { Hash, Copy, Trash2, Check, RefreshCw } from "lucide-react";
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

const HashGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [hashType, setHashType] = useState<
    "MD5" | "SHA1" | "SHA256" | "SHA512"
  >("SHA256");
  const [generatedHash, setGeneratedHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">(
    "info"
  );

  const handleGenerate = () => {
    if (!inputText) {
      setStatusMessage("Please enter some text to hash.");
      setStatusType("info");
      setTimeout(() => setStatusMessage(""), 2000);
      return;
    }

    let hash = "";
    switch (hashType) {
      case "MD5":
        hash = CryptoJS.MD5(inputText).toString();
        break;
      case "SHA1":
        hash = CryptoJS.SHA1(inputText).toString();
        break;
      case "SHA256":
        hash = CryptoJS.SHA256(inputText).toString();
        break;
      case "SHA512":
        hash = CryptoJS.SHA512(inputText).toString();
        break;
    }

    setGeneratedHash(hash);
    setStatusMessage(`Generated ${hashType} hash.`);
    setStatusType("success");
    setTimeout(() => setStatusMessage(""), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setGeneratedHash("");
    setStatusMessage("");
  };

  const copyToClipboard = () => {
    if (!generatedHash) return;
    navigator.clipboard.writeText(generatedHash).then(() => {
      setStatusMessage("Hash copied to clipboard!");
      setStatusType("success");
      setTimeout(() => setStatusMessage(""), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Hash Generator
        </h1>
        <p className="text-muted-foreground">
          Generate cryptographic hashes (MD5, SHA, etc.) for text.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Text */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Input Text</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={!inputText}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-[300px] resize-none font-mono"
              placeholder="Enter text to hash..."
            />
            <Button className="w-full" onClick={handleGenerate}>
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Hash
            </Button>
          </CardContent>
        </Card>

        {/* Output Hash */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" /> Generated Hash
            </CardTitle>
            <div className="w-32">
              <Select
                value={hashType}
                onValueChange={(v) => setHashType(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MD5">MD5</SelectItem>
                  <SelectItem value="SHA1">SHA1</SelectItem>
                  <SelectItem value="SHA256">SHA256</SelectItem>
                  <SelectItem value="SHA512">SHA512</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="relative">
              <Textarea
                value={generatedHash}
                readOnly
                className="h-[300px] resize-none bg-muted font-mono text-xs break-all"
                placeholder="Hash output..."
              />
              {generatedHash && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-4 right-4 h-8 w-8"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="h-10 flex items-center justify-center">
              {statusMessage && (
                <div
                  className={`text-sm font-medium flex items-center gap-2 ${
                    statusType === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {statusType === "success" && <Check className="h-4 w-4" />}
                  {statusMessage}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HashGenerator;
