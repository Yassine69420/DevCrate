import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const JWTDecoder = () => {
  const [jwtInput, setJwtInput] = useState("");
  const [headerOutput, setHeaderOutput] = useState("");
  const [payloadOutput, setPayloadOutput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">(
    "info"
  );

  const decodeJWT = () => {
    const token = jwtInput.trim();
    if (!token) {
      setStatusMessage("Please paste a JWT to decode.");
      setStatusType("info");
      return;
    }

    try {
      const decodedHeader = jwtDecode(token, { header: true });
      const decodedPayload = jwtDecode(token);

      setHeaderOutput(JSON.stringify(decodedHeader, null, 2));
      setPayloadOutput(JSON.stringify(decodedPayload, null, 2));

      setStatusMessage("JWT successfully decoded.");
      setStatusType("success");
    } catch (error: any) {
      setHeaderOutput("");
      setPayloadOutput("");
      setStatusMessage(`Error: ${error.message}`);
      setStatusType("error");
    }
  };

  const handleClear = () => {
    setJwtInput("");
    setHeaderOutput("");
    setPayloadOutput("");
    setStatusMessage("");
    setStatusType("info");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">JWT Decoder</h1>
        <p className="text-muted-foreground">
          Decode and inspect JSON Web Tokens.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Encoded JWT</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              title="Clear input"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-y"
              placeholder="Paste your JWT here..."
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Header</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-md bg-muted font-mono text-sm break-all whitespace-pre-wrap overflow-auto max-h-[300px]">
                {headerOutput || "// Header will appear here"}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-md bg-muted font-mono text-sm break-all whitespace-pre-wrap overflow-auto max-h-[400px]">
                {payloadOutput || "// Payload will appear here"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className={`text-sm font-medium px-4 py-2 rounded-md ${
              statusType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : statusType === "error"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "text-muted-foreground"
            }`}
          >
            {statusMessage || "Ready"}
          </div>
          <Button onClick={decodeJWT} className="w-full sm:w-auto">
            <Key className="mr-2 h-4 w-4" />
            Decode
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JWTDecoder;
