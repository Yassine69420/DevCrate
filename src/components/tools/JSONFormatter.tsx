import { useState, useEffect, useRef } from "react";
import jsyaml from "js-yaml";
import prettier from "prettier/standalone";
import parserXml from "@prettier/plugin-xml";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/atom-one-dark.css";
import { Copy, Trash2, Code2 } from "lucide-react";
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

hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("xml", xml);

const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("json");
  const [status, setStatus] = useState({ message: "", type: "" });
  const outputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      delete outputRef.current.dataset.highlighted;
      hljs.highlightElement(outputRef.current);
    }
  }, [output, language]);

  const handleFormat = async () => {
    if (!input.trim()) {
      setStatus({
        message: "Ready. Paste data and click Beautify.",
        type: "info",
      });
      setOutput("");
      return;
    }

    try {
      let formatted = "";
      switch (language) {
        case "json":
          const jsonObj = JSON.parse(input);
          formatted = JSON.stringify(jsonObj, null, 2);
          setStatus({
            message: "Valid JSON formatted successfully.",
            type: "success",
          });
          break;
        case "yaml":
          const yamlObj = jsyaml.load(input);
          formatted = jsyaml.dump(yamlObj);
          setStatus({
            message: "Valid YAML formatted successfully.",
            type: "success",
          });
          break;
        case "xml":
          formatted = await prettier.format(input, {
            parser: "xml",
            plugins: [parserXml],
            printWidth: 80,
            tabWidth: 2,
          });
          setStatus({
            message: "Valid XML formatted successfully.",
            type: "success",
          });
          break;
      }
      setOutput(formatted);
    } catch (error: any) {
      setOutput(input);
      setStatus({
        message: `Error: ${error.message.split("\n")[0]}`,
        type: "error",
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus({ message: "", type: "" });
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setStatus({ message: "Copied to clipboard!", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          JSON Formatter
        </h1>
        <p className="text-muted-foreground">
          Validate and beautify your structured data (JSON, YAML, XML).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Input
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 w-[100px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                title="Clear input"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full h-full p-4 resize-none rounded-none border-0 focus-visible:ring-0 font-mono text-sm leading-relaxed"
              placeholder={`Paste your ${language.toUpperCase()} here...`}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
            <CardTitle className="text-sm font-medium">
              Formatted Output
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={!output}
              title="Copy to clipboard"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden bg-[#282c34] rounded-b-xl relative">
            <div className="h-full overflow-auto">
              <pre className="m-0 h-full">
                <code
                  ref={outputRef}
                  className={`language-${language} h-full block p-4 text-sm font-mono`}
                >
                  {output}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action and Status */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className={`text-sm font-medium px-4 py-2 rounded-md ${
              status.type === "success"
                ? "text-green-600 dark:text-green-400"
                : status.type === "error"
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
            }`}
          >
            {status.message}
          </div>
          <Button onClick={handleFormat} className="w-full sm:w-auto" size="lg">
            Beautify {language.toUpperCase()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JSONFormatter;
