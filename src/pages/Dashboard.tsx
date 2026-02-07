import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  Palette,
  FileJson,
  Binary,
  Fingerprint,
  AlignLeft,
  Network,
  FileSpreadsheet,
  FileDiff,
  Code2,
  Clock,
  Container,
  GitBranch,
  Lock,
  Table,
  Key,
  FileText,
  ShieldCheck,
  Search,
  CalendarClock,
  Ruler,
  Folder,
  type LucideIcon,
} from "lucide-react";

// --- Inline UI Components (simulating shadcn/ui) ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = ({ className = "", ...props }: CardProps) => (
  <div
    className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({ className = "", ...props }: CardProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

const CardTitle = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { className?: string }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
);

const CardContent = ({ className = "", ...props }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}

const Tabs = ({ className = "", children }: TabsProps) => {
  return <div className={className}>{children}</div>;
};

// --- Data ---

interface ToolData {
  name: string;
  path: string;
  description: string;
  icon: LucideIcon;
}

const toolsData: ToolData[] = [
  {
    name: "Color Picker",
    path: "/color-picker",
    description:
      "Convert between HEX, RGB, HSL color formats with visual picker.",
    icon: Palette,
  },
  {
    name: "JSON Formatter",
    path: "/json-formatter",
    description: "Validate and beautify your structured data formats.",
    icon: FileJson,
  },
  {
    name: "Base64 Converter",
    path: "/base64",
    description: "Convert between Base64 and plain text.",
    icon: Binary,
  },
  {
    name: "UUID Generator",
    path: "/uuid-generator",
    description: "Generate UUIDs (v1, v4) for your applications.",
    icon: Fingerprint,
  },
  {
    name: "Lorem Ipsum",
    path: "/lorem-ipsum",
    description: "Generate placeholder text in various formats.",
    icon: AlignLeft,
  },
  {
    name: "API Request Builder",
    path: "/api-request-builder",
    description: "Create and test API requests.",
    icon: Network,
  },
  {
    name: "CSV Converter",
    path: "/csv-converter",
    description: "Convert CSV using to Excel format and vice versa.",
    icon: FileSpreadsheet,
  },
  {
    name: "Diff Checker",
    path: "/diff-checker",
    description: "Compare text or code files to see differences.",
    icon: FileDiff,
  },
  {
    name: "Code Separator",
    path: "/code-separator",
    description: "Separate HTML, CSS, and JavaScript code.",
    icon: Code2,
  },
  {
    name: "Cron Tester",
    path: "/cron-tester",
    description: "Validate and understand cron expressions.",
    icon: Clock,
  },
  {
    name: "Dockerfile & CI",
    path: "/dockerfile-ci",
    description: "Generate Dockerfile templates and CI configuration.",
    icon: Container,
  },
  {
    name: "Git Cheat Sheet",
    path: "/git-cheat-sheet",
    description: "Quick reference for common Git commands.",
    icon: GitBranch,
  },
  {
    name: "Hash Generator",
    path: "/hash-generator",
    description: "Generate cryptographic hashes (MD5, SHA256, etc.).",
    icon: Lock,
  },
  {
    name: "JSON to CSV",
    path: "/json-to-csv",
    description: "Convert JSON data to CSV format with ease.",
    icon: Table,
  },
  {
    name: "JWT Decoder",
    path: "/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
    icon: Key,
  },
  {
    name: "Markdown Preview",
    path: "/markdown-preview",
    description: "Write Markdown and see rendered HTML.",
    icon: FileText,
  },
  {
    name: "Password Generator",
    path: "/password-generator",
    description: "Generate secure passwords.",
    icon: ShieldCheck,
  },
  {
    name: "Regex Tester",
    path: "/regex-tester",
    description: "Test and debug regular expressions.",
    icon: Search,
  },
  {
    name: "Timestamp Converter",
    path: "/timestamp-converter",
    description: "Convert between Unix timestamps and dates.",
    icon: CalendarClock,
  },
  {
    name: "Project Builder",
    path: "/project-builder",
    description: "Turn text structures into actual files and folders.",
    icon: Folder,
  },
  {
    name: "Unit Converter",
    path: "/unit-converter",
    description: "Convert between bytes, time units, etc.",
    icon: Ruler,
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState(toolsData);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredTools(toolsData);
    } else {
      setFilteredTools(
        toolsData.filter(
          (tool) =>
            tool.name.toLowerCase().includes(term) ||
            tool.description.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 font-sans text-slate-900 bg-white min-h-screen">
      <Tabs defaultValue="overview" className="space-y-4">
        {/* Tools Browser Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium tracking-tight">
              All Developer Tools
            </h3>
            <div className="w-full max-w-sm flex items-center space-x-2">
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="block cursor-pointer"
              >
                <Card className="h-full hover:bg-slate-100/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      {tool.name}
                    </CardTitle>
                    <tool.icon className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {tool.description}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500">
                No tools found matching your search.
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
