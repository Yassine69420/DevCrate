import { useState, useEffect } from "react";
import cronstrue from "cronstrue";
import { Clock, HelpCircle, AlertCircle, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
const CronTester = () => {
  const [cronExpression, setCronExpression] = useState("* * * * *");
  const [humanReadable, setHumanReadable] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cronExpression.trim()) {
      setHumanReadable("");
      setError("");
      return;
    }

    try {
      const readable = cronstrue.toString(cronExpression);
      setHumanReadable(readable);
      setError("");
    } catch (err: any) {
      setError(err.toString());
      setHumanReadable("");
    }
  }, [cronExpression]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Cron Tester</h1>
        <p className="text-muted-foreground">
          Validate and convert cron expressions to human readable text.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> Enter Cron Expression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="* * * * *"
            className="font-mono text-lg p-6"
          />

          {humanReadable && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                  Human Readable
                </p>
                <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                  {humanReadable}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  Invalid Expression
                </p>
                <p className="text-sm text-red-700 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reference Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="w-4 h-4" /> Cron Expression Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-3 font-semibold">Field</th>
                  <th className="p-3 font-semibold">Allowed Values</th>
                  <th className="p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-mono">Minute</td>
                  <td className="p-3 font-mono">0-59</td>
                  <td className="p-3">Minute of the hour</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-mono">Hour</td>
                  <td className="p-3 font-mono">0-23</td>
                  <td className="p-3">Hour of the day</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-mono">Day of Month</td>
                  <td className="p-3 font-mono">1-31</td>
                  <td className="p-3">Day of the month</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-mono">Month</td>
                  <td className="p-3 font-mono">1-12 or JAN-DEC</td>
                  <td className="p-3">Month of the year</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-mono">Day of Week</td>
                  <td className="p-3 font-mono">0-6 or SUN-SAT</td>
                  <td className="p-3">Day of the week (0=Sunday)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-semibold text-sm">Common Special Characters</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>
                <code className="bg-muted px-1 rounded">*</code> : Any value
              </li>
              <li>
                <code className="bg-muted px-1 rounded">,</code> : Value list
                separator (e.g. 1,3,5)
              </li>
              <li>
                <code className="bg-muted px-1 rounded">-</code> : Range of
                values (e.g. 1-5)
              </li>
              <li>
                <code className="bg-muted px-1 rounded">/</code> : Step values
                (e.g. */5)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CronTester;
