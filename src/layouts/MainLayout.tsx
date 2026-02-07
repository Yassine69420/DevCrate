import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Palette,
  FileText,
  Table,
  FileSpreadsheet,
  Ruler,
  Calendar,
  Fingerprint,
  Lock,
  Hash,
  FileJson,
  Network,
  GitCompare,
  Search,
  Container,
  GitBranch,
  Clock,
  Key,
  FileType,
  Code,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Grouping tools for the sidebar to match the "Documents", "Projects" style in the image
  const toolGroups = [
    {
      title: "Overview",
      items: [{ path: "/", name: "Dashboard", icon: LayoutDashboard }],
    },
    {
      title: "Converters",
      items: [
        { path: "/color-picker", name: "Color Picker", icon: Palette },
        { path: "/base64", name: "Base64", icon: FileText },
        { path: "/json-to-csv", name: "JSON to CSV", icon: Table },
        {
          path: "/csv-converter",
          name: "CSV Converter",
          icon: FileSpreadsheet,
        },
        { path: "/unit-converter", name: "Unit Converter", icon: Ruler },
        { path: "/timestamp-converter", name: "Timestamp", icon: Calendar },
      ],
    },
    {
      title: "Generators",
      items: [
        { path: "/uuid-generator", name: "UUID", icon: Fingerprint },
        { path: "/password-generator", name: "Password", icon: Lock },
        { path: "/hash-generator", name: "Hash", icon: Hash },
        { path: "/lorem-ipsum", name: "Lorem Ipsum", icon: FileText },
      ],
    },
    {
      title: "Development",
      items: [
        { path: "/json-formatter", name: "JSON Formatter", icon: FileJson },
        { path: "/api-request-builder", name: "API Builder", icon: Network },
        { path: "/diff-checker", name: "Diff Checker", icon: GitCompare },
        { path: "/regex-tester", name: "Regex", icon: Search },
        { path: "/dockerfile-ci", name: "Docker & CI", icon: Container },
        { path: "/git-cheat-sheet", name: "Git Cheatsheet", icon: GitBranch },
        { path: "/cron-tester", name: "Cron Tester", icon: Clock },
        { path: "/jwt-decoder", name: "JWT Decoder", icon: Key },
        { path: "/markdown-preview", name: "Markdown", icon: FileType },
        { path: "/code-separator", name: "Code Separator", icon: Code },
        { path: "/project-builder", name: "Project Builder", icon: Container },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-card h-full transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Header/Logo */}
        <div className="h-14 flex items-center px-4 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs font-bold">
              DC
            </div>
            {isSidebarOpen && <span>DevCrate</span>}
          </div>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-6 px-2">
            {toolGroups.map((group, i) => (
              <div key={i}>
                {isSidebarOpen ? (
                  <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    {group.title}
                  </h3>
                ) : (
                  <div className="h-4" /> // Spacer
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          !isSidebarOpen && "justify-center px-0"
                        )}
                        title={!isSidebarOpen ? item.name : undefined}
                      >
                        <Icon className="h-4 w-4" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer/Toggle */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-8"
          >
            {isSidebarOpen ? (
              <div className="flex items-center gap-2 w-full justify-start px-2">
                <Settings className="h-4 w-4" /> <span>Settings</span>
              </div>
            ) : (
              <Settings className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background/50">
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b flex items-center justify-between px-4 bg-card">
          <div className="font-semibold">DevCrate</div>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-auto">
          {/* The Outlet is where the Dashboard and Tools pages render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
