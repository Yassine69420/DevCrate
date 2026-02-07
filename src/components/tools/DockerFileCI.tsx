import { useState } from "react";
import { Download, Copy, FileJson, Server, Check } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DockerFileCI = () => {
  const [fileType, setFileType] = useState<"dockerfile" | "ci">("dockerfile");
  const [projectType, setProjectType] = useState<
    "nodejs" | "python" | "go" | "rust"
  >("nodejs");
  const [ciProvider, setCiProvider] = useState<"github" | "gitlab">("github");
  const [port, setPort] = useState("3000");
  const [outputContent, setOutputContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  const templates = {
    dockerfile: {
      nodejs: (port: string) => `
# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port ${port}
EXPOSE ${port}

# Define the command to run your app
CMD [ "node", "server.js" ]
`,
      python: (port: string) => `
# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the requirements file
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Make port ${port} available to the world outside this container
EXPOSE ${port}

# Run app.py when the container launches
CMD ["python", "app.py"]
`,
      go: (port: string) => `
# Start from the official Golang base image
FROM golang:1.19-alpine

# Set the working directory
WORKDIR /app

# Copy the Go modules files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY *.go ./

# Build the Go app
RUN go build -o /docker-gs-ping

# Expose port ${port} to the outside world
EXPOSE ${port}

# Command to run the executable
CMD [ "/docker-gs-ping" ]
`,
      rust: (port: string) => `
# Start from the official Rust base image
FROM rust:1.65 as builder

WORKDIR /usr/src/app
COPY . .

# Build the release binary
RUN cargo build --release

# Final, smaller image
FROM debian:buster-slim
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/app /usr/local/bin/app

EXPOSE ${port}

CMD ["app"]
`,
    },
    ci: {
      github: {
        nodejs: () => `
name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
`,
        python: () => `
name: Python application

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Set up Python 3.10
      uses: actions/setup-python@v3
      with:
        python-version: "3.10"
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install flake8 pytest
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
    - name: Lint with flake8
      run: |
        # stop the build if there are Python syntax errors or undefined names
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        # exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
    - name: Test with pytest
      run: |
        pytest
`,
        go: () => `
name: Go

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:

  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Set up Go
      uses: actions/setup-go@v3
      with:
        go-version: 1.19

    - name: Build
      run: go build -v ./...

    - name: Test
      run: go test -v ./...
`,
        rust: () => `
name: Rust

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

env:
  CARGO_TERM_COLOR: always

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Build
      run: cargo build --verbose
    - name: Run tests
      run: cargo test --verbose
`,
      },
      gitlab: {
        nodejs: () => `
image: node:latest

stages:
  - build
  - test

cache:
  paths:
    - node_modules/

build_project:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

run_tests:
  stage: test
  script:
    - npm test
`,
        python: () => `
image: python:latest

stages:
  - test

test:
  stage: test
  script:
    - pip install -r requirements.txt
    - python -m pytest
`,
        go: () => `
image: golang:latest

stages:
  - test
  - build

format:
  stage: test
  script:
    - go fmt $(go list ./... | grep -v /vendor/)
    - go vet $(go list ./... | grep -v /vendor/)
    - go test -race $(go list ./... | grep -v /vendor/)

compile:
  stage: build
  script:
    - mkdir -p mybin
    - go build -o mybin/ ./...
  artifacts:
    paths:
      - mybin
`,
        rust: () => `
image: rust:latest

stages:
    - test
    - build

test:
  stage: test
  script:
    - cargo test --verbose

build:
  stage: build
  script:
    - cargo build --release
`,
      },
    },
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let content = "";
      if (fileType === "dockerfile") {
        content = templates.dockerfile[projectType](port);
      } else {
        // @ts-ignore
        content = templates.ci[ciProvider][projectType]();
      }
      setOutputContent(content.trim());
      setIsGenerating(false);
      setStatus("Template generated!");
      setTimeout(() => setStatus(""), 2000);
    }, 500);
  };

  const copyToClipboard = () => {
    if (!outputContent) return;
    navigator.clipboard.writeText(outputContent);
    setStatus("Copied to clipboard!");
    setTimeout(() => setStatus(""), 2000);
  };

  const downloadFile = () => {
    if (!outputContent) return;
    let filename = "Dockerfile";
    if (fileType === "ci") {
      filename = ciProvider === "github" ? "main.yml" : ".gitlab-ci.yml";
    }

    const blob = new Blob([outputContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Downloaded!");
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Dockerfile & CI/CD Generator
        </h1>
        <p className="text-muted-foreground">
          Generate Dockerfiles and CI/CD pipelines for your projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Generator Type */}
              <div className="space-y-2">
                <Label>You Build For</Label>
                <Tabs
                  value={fileType}
                  onValueChange={(v) => setFileType(v as any)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dockerfile">Dockerfile</TabsTrigger>
                    <TabsTrigger value="ci">CI Pipeline</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                <Label>Project Type</Label>
                <Select
                  value={projectType}
                  onValueChange={(v) => setProjectType(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Inputs */}
              {fileType === "dockerfile" ? (
                <div className="space-y-2">
                  <Label>Exposed Port</Label>
                  <Input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="3000"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>CI Provider</Label>
                  <Select
                    value={ciProvider}
                    onValueChange={(v) => setCiProvider(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">GitHub Actions</SelectItem>
                      <SelectItem value="gitlab">GitLab CI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Template"}
              </Button>

              <div className="flex justify-center h-6">
                {status && (
                  <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <Check className="mr-1 h-3 w-3" /> {status}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                {fileType === "dockerfile" ? (
                  <Server className="h-5 w-5" />
                ) : (
                  <FileJson className="h-5 w-5" />
                )}
                Generated Code
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!outputContent}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadFile}
                  disabled={!outputContent}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-[500px]">
              <Textarea
                value={outputContent}
                readOnly
                className="font-mono text-sm h-[500px] resize-none bg-muted"
                placeholder="Generated template will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DockerFileCI;
