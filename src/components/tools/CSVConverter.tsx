import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CSVConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [convertTo, setConvertTo] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [status, setStatus] = useState({ message: "", type: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validExts = ["csv", "xls", "xlsx"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !validExts.includes(ext)) {
      setStatus({
        message: "Please upload a CSV or Excel file",
        type: "error",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatus({ message: "File size must be less than 10MB", type: "error" });
      return;
    }

    setFile(file);
    setStatus({ message: "File loaded successfully!", type: "success" });

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      setWorkbook(wb);
      displayPreview(wb);
    };
    reader.readAsArrayBuffer(file);
  };

  const displayPreview = (wb: XLSX.WorkBook) => {
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    if (jsonData.length === 0) {
      setStatus({ message: "No data found in file", type: "error" });
      return;
    }

    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1, 101); // Preview first 100 rows

    setHeaders(headers);
    setPreviewData(rows);
  };

  const handleConvert = () => {
    if (!workbook || !convertTo) {
      setStatus({
        message: "Please select a conversion format",
        type: "error",
      });
      return;
    }

    try {
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let convertedData: any;
      let mimeType = "";
      let extension = convertTo;

      if (convertTo === "csv") {
        convertedData = XLSX.utils.sheet_to_csv(sheet, { FS: delimiter });
        mimeType = "text/csv";
      } else {
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, sheet, sheetName);
        convertedData = XLSX.write(newWorkbook, {
          bookType: convertTo as any,
          type: "array",
        });
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }

      const blob = new Blob([convertedData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted_file.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus({ message: "Conversion successful!", type: "success" });
    } catch (error) {
      console.error(error);
      setStatus({ message: "Conversion failed.", type: "error" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          CSV & Excel Converter
        </h1>
        <p className="text-muted-foreground">
          Convert between CSV, Excel (XLSX), and other spreadsheet formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv, .xls, .xlsx"
                />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium">
                  Drag & Drop or Click to Upload
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports CSV, XLS, XLSX (Max 10MB)
                </p>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md overflow-hidden">
                  <FileSpreadsheet className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFile(null);
                      setWorkbook(null);
                      setPreviewData([]);
                      setHeaders([]);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={convertTo} onValueChange={setConvertTo}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem value="xls">Excel 97-2003 (.xls)</SelectItem>
                    <SelectItem value="txt">Text (.txt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {convertTo === "csv" && (
                <div className="space-y-2">
                  <Label htmlFor="delimiter">Delimiter</Label>
                  <Select value={delimiter} onValueChange={setDelimiter}>
                    <SelectTrigger id="delimiter">
                      <SelectValue placeholder="Select Delimiter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=";">Semicolon (;)</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                      <SelectItem value="\t">Tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleConvert}
                disabled={!file || !convertTo}
              >
                <Download className="mr-2 h-4 w-4" />
                Convert & Download
              </Button>

              <div className="flex justify-center h-6">
                {status.message && (
                  <div
                    className={`text-sm font-medium px-4 py-2 rounded-md ${
                      status.type === "success"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {status.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="overflow-auto border rounded-md max-h-[600px]">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted text-muted-foreground sticky top-0">
                      <tr>
                        {headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-6 py-3 font-medium whitespace-nowrap"
                          >
                            {header || `Column ${i + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="bg-background hover:bg-muted/50"
                        >
                          {row.map((cell: any, cellIndex: number) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              {cell !== null && cell !== undefined
                                ? String(cell)
                                : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50 border-2 border-dashed rounded-lg">
                  <FileSpreadsheet className="h-16 w-16 mb-4" />
                  <p>Upload a file to see data preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CSVConverter;
