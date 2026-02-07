import { useState, useEffect } from "react";
import { Copy, Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LoremIpsum = () => {
  const [amount, setAmount] = useState(5);
  const [type, setType] = useState("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const loremIpsumText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const generateText = (amt: number, typ: string) => {
    const words = loremIpsumText.split(" ");
    let result = "";

    if (typ === "words") {
      let currentWordIndex = 0;
      for (let i = 0; i < amt; i++) {
        result += words[currentWordIndex % words.length] + " ";
        currentWordIndex++;
      }
    } else if (typ === "sentences") {
      const sentences = loremIpsumText.split(". ");
      let currentSentIndex = 0;
      for (let i = 0; i < amt; i++) {
        result += sentences[currentSentIndex % sentences.length] + ". ";
        currentSentIndex++;
      }
    } else {
      // paragraphs
      for (let i = 0; i < amt; i++) {
        result += loremIpsumText + "\n\n";
      }
    }
    return result.trim();
  };

  const handleGenerate = () => {
    setOutput(generateText(amount, type));
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Lorem Ipsum Generator
        </h1>
        <p className="text-muted-foreground">
          Generate placeholder text for your designs.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="h-5 w-5" /> Generator Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="w-full md:w-1/4 space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(Math.max(1, parseInt(e.target.value) || 0))
                  }
                  min="1"
                />
              </div>

              <div className="w-full md:w-1/4 space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-auto flex-1 flex gap-2">
                <Button
                  onClick={handleGenerate}
                  className="flex-1 md:flex-none"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Generated Text
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? (
                <span className="flex items-center text-green-600 dark:text-green-400">
                  Copied!
                </span>
              ) : (
                <span className="flex items-center">
                  <Copy className="mr-2 h-4 w-4" /> Copy Text
                </span>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              className="min-h-[400px] resize-y bg-muted/30 text-base leading-relaxed p-6"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoremIpsum;
