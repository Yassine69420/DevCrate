import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import ColorPicker from "./components/tools/ColorPicker";
import JSONFormatter from "./components/tools/JSONFormatter";
import Base64 from "./components/tools/Base64";
import UUIDGenerator from "./components/tools/UUIDGenerator";
import LoremIpsum from "./components/tools/LoremIpsum";
import APIRequestBuilder from "./components/tools/APIRequestBuilder";
import CSVConverter from "./components/tools/CSVConverter";
import DiffChecker from "./components/tools/DiffChecker";
import CodeSeparator from "./components/tools/CodeSeparator";
import CronTester from "./components/tools/CronTester";
import DockerFileCI from "./components/tools/DockerFileCI";
import GitCheatSheet from "./components/tools/GitCheatSheet";
import HashGenerator from "./components/tools/HashGenerator";
import JSONToCSV from "./components/tools/JSONToCSV";
import JWTDecoder from "./components/tools/JWTDecoder";
import Markdown from "./components/tools/Markdown";
import PasswordGenerator from "./components/tools/PasswordGenerator";
import Regex from "./components/tools/Regex";
import TimestampConverter from "./components/tools/TimestampConverter";
import UnitConverter from "./components/tools/UnitConverter";
import ProjectBuilder from "./components/tools/ProjectBuilder";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="color-picker" element={<ColorPicker />} />
          <Route path="json-formatter" element={<JSONFormatter />} />
          <Route path="base64" element={<Base64 />} />
          <Route path="uuid-generator" element={<UUIDGenerator />} />
          <Route path="lorem-ipsum" element={<LoremIpsum />} />
          <Route path="api-request-builder" element={<APIRequestBuilder />} />
          <Route path="csv-converter" element={<CSVConverter />} />
          <Route path="diff-checker" element={<DiffChecker />} />
          <Route path="code-separator" element={<CodeSeparator />} />
          <Route path="cron-tester" element={<CronTester />} />
          <Route path="dockerfile-ci" element={<DockerFileCI />} />
          <Route path="git-cheat-sheet" element={<GitCheatSheet />} />
          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="json-to-csv" element={<JSONToCSV />} />
          <Route path="jwt-decoder" element={<JWTDecoder />} />
          <Route path="markdown-preview" element={<Markdown />} />
          <Route path="password-generator" element={<PasswordGenerator />} />
          <Route path="regex-tester" element={<Regex />} />
          <Route path="timestamp-converter" element={<TimestampConverter />} />
          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="project-builder" element={<ProjectBuilder />} />
          {/* Add more routes here as we migrate tools */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
