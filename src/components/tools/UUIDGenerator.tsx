import { useState, useEffect } from "react";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";
import { Copy, RefreshCw, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const UUIDGenerator = () => {
  const [uuid, setUuid] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });

  const generateV1 = () => {
    const newUuid = uuidv1();
    setUuid(newUuid);
    setStatus({ message: "Generated v1 UUID.", type: "success" });
  };

  const generateV4 = () => {
    const newUuid = uuidv4();
    setUuid(newUuid);
    setStatus({ message: "Generated v4 UUID.", type: "success" });
  };

  const copyToClipboard = () => {
    if (uuid) {
      navigator.clipboard.writeText(uuid);
      setStatus({ message: "Copied to clipboard!", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    }
  };

  useEffect(() => {
    generateV4();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          UUID Generator
        </h1>
        <p className="text-muted-foreground">
          Generate unique identifiers (v1 & v4).
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button onClick={generateV1} variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Generate v1
              </Button>
              <Button onClick={generateV4}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate v4
              </Button>
            </div>
            <div
              className={`text-sm font-medium h-5 ${status.type === "success" ? "text-green-500" : "text-muted-foreground"}`}
            >
              {status.message || "\u00A0"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={uuid}
              readOnly
              className="font-mono text-lg h-12 text-center"
            />
            <Button size="icon" className="h-12 w-12" onClick={copyToClipboard}>
              {status.message.includes("Copied") ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UUIDGenerator;
