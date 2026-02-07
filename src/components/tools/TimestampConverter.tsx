import { useState } from "react";
import { fromUnixTime, format, getUnixTime } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TimestampConverter = () => {
  const [timestampInput, setTimestampInput] = useState("");
  const [gmtOutput, setGmtOutput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const showStatus = (message: string, error: boolean = false) => {
    setStatusMessage(message);
    setIsError(error);
    setTimeout(() => {
      setStatusMessage("");
      setIsError(false);
    }, 3000);
  };

  const handleToGmt = () => {
    const timestamp = parseInt(timestampInput, 10);
    if (isNaN(timestamp)) {
      showStatus("Please enter a valid Unix timestamp.", true);
      return;
    }
    try {
      const date = fromUnixTime(timestamp);
      setGmtOutput(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
      showStatus("Converted to GMT/UTC date.");
    } catch (e) {
      showStatus("Invalid timestamp.", true);
    }
  };

  const handleToTimestamp = () => {
    if (!dateInput) {
      showStatus("Please select a date and time.", true);
      return;
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      showStatus("Invalid date format.", true);
      return;
    }
    setTimestampOutput(getUnixTime(date).toString());
    showStatus("Converted to Unix timestamp.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Timestamp Converter
        </h1>
        <p className="text-muted-foreground">
          Convert between Unix timestamps and human-readable dates.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timestamp to Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timestamp to Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="timestampInput"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unix Timestamp
              </label>
              <Input
                type="number"
                id="timestampInput"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="e.g., 1672531199"
                className="font-mono"
              />
            </div>
            <Button onClick={handleToGmt} className="w-full">
              Convert to GMT/UTC
            </Button>
            <div className="space-y-2">
              <label
                htmlFor="gmtOutput"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                GMT/UTC Date
              </label>
              <Input
                type="text"
                id="gmtOutput"
                value={gmtOutput}
                readOnly
                className="font-mono bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Date to Timestamp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date to Timestamp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="dateInput"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Date & Time (Local)
              </label>
              <Input
                type="datetime-local"
                id="dateInput"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                step="1"
                className="font-mono"
              />
            </div>
            <Button
              onClick={handleToTimestamp}
              variant="secondary"
              className="w-full"
            >
              Convert to Timestamp
            </Button>
            <div className="space-y-2">
              <label
                htmlFor="timestampOutput"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unix Timestamp
              </label>
              <Input
                type="text"
                id="timestampOutput"
                value={timestampOutput}
                readOnly
                className="font-mono bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center h-6">
        {statusMessage && (
          <div
            className={`text-sm font-medium px-4 py-2 rounded-md ${
              !isError
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimestampConverter;
