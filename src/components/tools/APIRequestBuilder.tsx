import { useState } from "react";
import axios, { type Method } from "axios";
import { Plus, Trash2, Loader2, Send } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface Header {
  key: string;
  value: string;
}

const APIRequestBuilder = () => {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    data: any;
    time: number;
    headers: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleSendRequest = async () => {
    if (!url) {
      setError("URL cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = performance.now();
    const headerObj: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) headerObj[h.key] = h.value;
    });

    try {
      const res = await axios({
        method,
        url,
        headers: headerObj,
        data: body ? JSON.parse(body) : undefined,
        validateStatus: () => true, // Resolve promise for all status codes
      });

      const endTime = performance.now();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        headers: res.headers,
        time: Math.round(endTime - startTime),
      });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      if (err.response) {
        const endTime = performance.now();
        setResponse({
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers,
          time: Math.round(endTime - startTime),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 400) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          API Request Builder
        </h1>
        <p className="text-muted-foreground">
          Test API endpoints with custom methods, headers, and bodies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Method & URL</Label>
                <div className="flex gap-2">
                  <Select
                    value={method}
                    onValueChange={(val) => setMethod(val as Method)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="https://api.example.com/v1/users"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <Tabs defaultValue="headers" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body (JSON)</TabsTrigger>
                </TabsList>
                <TabsContent value="headers" className="space-y-3 mt-4">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) =>
                          handleHeaderChange(index, "key", e.target.value)
                        }
                        className="h-8 text-xs font-mono"
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) =>
                          handleHeaderChange(index, "value", e.target.value)
                        }
                        className="h-8 text-xs font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveHeader(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleAddHeader}
                  >
                    <Plus className="mr-2 h-3 w-3" /> Add Header
                  </Button>
                </TabsContent>
                <TabsContent value="body" className="mt-4">
                  <Textarea
                    placeholder='{ "key": "value" }'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="font-mono text-xs min-h-[200px]"
                  />
                </TabsContent>
              </Tabs>

              <Button
                className="w-full"
                onClick={handleSendRequest}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Request
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Response</CardTitle>
              {response && (
                <div className="flex items-center gap-4 text-sm">
                  <span
                    className={`font-mono font-bold ${getStatusColor(response.status)}`}
                  >
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-muted-foreground">
                    {response.time}ms
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 min-h-[500px]">
              {error && (
                <div className="p-4 rounded-md bg-destructive/10 text-destructive mb-4 text-sm font-medium">
                  {error}
                </div>
              )}

              {!response && !error && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Send className="h-12 w-12 mb-4" />
                  <p>Enter a URL and send request to see response</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                  <p>Fetching response...</p>
                </div>
              )}

              {response && (
                <Tabs
                  defaultValue="body"
                  className="w-full h-full flex flex-col"
                >
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="body"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Body
                    </TabsTrigger>
                    <TabsTrigger
                      value="headers"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Headers
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="body" className="flex-1 mt-0">
                    <div className="relative h-full">
                      {/* Simple scroll area for code */}
                      <pre className="p-4 h-[500px] overflow-auto text-xs font-mono bg-muted/50 rounded-b-md">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="headers" className="flex-1 mt-0">
                    <div className="p-4 h-[500px] overflow-auto font-mono text-xs bg-muted/50 rounded-b-md space-y-1">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-semibold text-primary/80 min-w-[120px]">
                            {key}:
                          </span>
                          <span className="text-foreground/80 break-all">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default APIRequestBuilder;
