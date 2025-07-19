"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type File,
  FileText,
  FolderOpen,
  Play,
  Plus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { LiveProvider, LiveEditor, LiveError } from "react-live";
import { themes } from "prism-react-renderer";
import { useEffect, useRef, useState } from "react";
import {
  SiC,
  SiDocker,
  SiGit,
  SiGnubash,
  SiCplusplus,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiJpeg,
  SiJupyter,
  SiLess,
  SiMarkdown,
  SiMysql,
  SiKeras,
  SiPhp,
  SiPython,
  SiReact,
  SiRuby,
  SiSass,
  SiRust,
  SiSvelte,
  SiTypescript,
  SiYaml,
  SiVuedotjs,
  SiCss3,
  SiXml,
  SiNodedotjs,
} from "react-icons/si";
import {
  FaCog,
  FaFileAlt,
  FaFileArchive,
  FaFileCsv,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaJava,
  FaFile,
} from "react-icons/fa";
import * as monaco from "monaco-editor";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";
import MonacoEditor from "@monaco-editor/react";
import { Terminal } from "xterm";
import TerminalView from "./Terminal";

export default function Component() {
  const [projectTree, setProjectTree] = useState<any>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const handleFolderImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const tree: any = {};
      Array.from(files).forEach((file) => {
        const parts = file.webkitRelativePath.split("/");
        let current = tree;
        parts.forEach((part, i) => {
          if (i === parts.length - 1) {
            current[part] = file;
          } else {
            if (!current[part]) current[part] = {};
            current = current[part];
          }
        });
      });
      setProjectTree(tree);
    }
  };

  interface CurrentFile {
    fileName: string;
    fileContent: string;
  }

  const [currentFile, setCurrentFile] = useState<CurrentFile | null>(null);

  const openFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      console.log("File Content:", content);
      setCurrentFile({ fileName: file.name, fileContent: content });
    };
    reader.readAsText(file);
  };

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  };

  const getFileIcon = (fileName: string) => {
    const parts = fileName.split(".");
    const fileExtension = parts.length > 1 ? parts[parts.length - 1] : "";
    switch (fileExtension) {
      case "tsx":
      case "jsx":
        return <SiReact size={16} color="#61DAFB" />;
      case "vue":
        return <SiVuedotjs size={16} color="#4FC08D" />;
      case "svelte":
        return <SiSvelte size={16} color="#FF3E00" />;
      case "js":
        return <SiJavascript size={16} color="#F7DF1E" />;
      case "ts":
        return <SiTypescript size={16} color="#3178C6" />;
      case "mjs":
        return <SiJavascript size={16} color="#F7DF1E" />;
      case "py":
        return <SiPython size={16} color="#3776AB" />;
      case "java":
        return <FaJava size={16} color="#ED8B00" />;
      case "php":
        return <SiPhp size={16} color="#777BB4" />;
      case "rb":
        return <SiRuby size={16} color="#CC342D" />;
      case "go":
        return <SiGo size={16} color="#00ADD8" />;
      case "rs":
        return <SiRust size={16} color="#000000" />;
      case "cpp":
      case "cc":
      case "cxx":
        return <SiCplusplus size={16} color="#00599C" />;
      case "c":
        return <SiC size={16} color="#A8B9CC" />;
      case "html":
        return <SiHtml5 size={16} color="#E34F26" />;
      case "css":
        return <SiCss3 size={16} color="#1572B6" />;
      case "scss":
      case "sass":
        return <SiSass size={16} color="#CC6699" />;
      case "less":
        return <SiLess size={16} color="#1D365D" />;
      case "json":
        return <SiNodedotjs size={16} color="#5FA04E" />;
      case "yaml":
      case "yml":
        return <SiYaml size={16} color="#CB171E" />;
      case "xml":
        return <SiXml size={16} color="#FF6600" />;
      case "csv":
        return <FaFileCsv size={16} color="#00A651" />;
      case "sql":
        return <SiMysql size={16} color="#4479A1" />;
      case "md":
      case "markdown":
        return <SiMarkdown size={16} color="#016EF5" />;
      case "txt":
        return <FaFileAlt size={16} color="#8A8A8A" />;
      case "pdf":
        return <FaFilePdf size={16} color="#FF0000" />;
      case "doc":
      case "docx":
        return <FaFileWord size={16} color="#2B579A" />;
      case "jpg":
      case "jpeg":
        return <SiJpeg size={16} color="#8A8A8A" />;
      case "png":
        return <FaFileImage size={16} color="#8A8A8A" />;
      case "svg":
        return <FaFileImage size={16} color="#FFB13B" />;
      case "gif":
        return <FaFileImage size={16} color="#8A8A8A" />;
      case "webp":
        return <FaFileImage size={16} color="#816a0dff" />;
      case "ico":
        return <FaFileImage size={16} color="#1abb6bff" />;
      case "dockerfile":
        return <SiDocker size={16} color="#2496ED" />;
      case "gitignore":
        return <SiGit size={16} color="#F05032" />;
      case "env":
        return <FaCog size={16} color="#8A8A8A" />;
      case "keras":
        return <SiKeras size={16} color="#D00000" />;
      case "ipynb":
        return <SiJupyter size={16} color="#F37626" />;
      case "sh":
      case "bash":
        return <SiGnubash size={16} color="#4EAA25" />;
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return <FaFileArchive size={16} color="#8A8A8A" />;
      default:
        return <FaFile size={16} color="#d3d3d3ff" />;
    }
  };

  const renderTree = (obj: any, path = "", depth = 0) => {
    return Object.keys(obj).map((key) => {
      const currentPath = `${path}/${key}`;
      const isFile = obj[key]?.name && obj[key]?.size !== undefined;
      const isExpanded = expanded.has(currentPath);

      return (
        <div key={currentPath}>
          <div
            className="flex items-center gap-2 p-1 text-white hover:bg-gray-700 cursor-pointer rounded-sm"
            style={{ paddingLeft: depth * 16 }}
            onClick={() => {
              if (isFile) {
                openFile(obj[key]);
              } else {
                toggle(currentPath);
              }
            }}
          >
            {isFile ? (
              getFileIcon(key)
            ) : isExpanded ? (
              <VscFolderOpened size={16} color="#c5c5c5" />
            ) : (
              <VscFolder size={16} color="#c5c5c5" />
            )}
            <span className="text-sm truncate">{key}</span>
          </div>
          {!isFile && isExpanded && (
            <div className="text-sm">
              {renderTree(obj[key], currentPath, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const closeFile = () => {
    setCurrentFile(null);
  };

  self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
      const getWorkerModule = (moduleUrl: any, label: any) => {
        const workerUrl = self.MonacoEnvironment?.getWorkerUrl
          ? self.MonacoEnvironment.getWorkerUrl(moduleUrl, label)
          : moduleUrl;

        return new Worker(workerUrl, {
          name: label,
          type: "module",
        });
      };

      switch (label) {
        case "json":
          return getWorkerModule(
            "/monaco-editor/esm/vs/language/json/json.worker?worker",
            label
          );
        case "css":
        case "scss":
        case "less":
          return getWorkerModule(
            "/monaco-editor/esm/vs/language/css/css.worker?worker",
            label
          );
        case "html":
        case "handlebars":
        case "razor":
          return getWorkerModule(
            "/monaco-editor/esm/vs/language/html/html.worker?worker",
            label
          );
        case "typescript":
        case "javascript":
          return getWorkerModule(
            "/monaco-editor/esm/vs/language/typescript/ts.worker?worker",
            label
          );
        default:
          return getWorkerModule(
            "/monaco-editor/esm/vs/editor/editor.worker?worker",
            label
          );
      }
    },
  };

  // Configure TypeScript for JSX support
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    jsx: monaco.languages.typescript.JsxEmit.React, // Enable JSX!
    allowJs: true,
    esModuleInterop: true,
  });
  const getLanguage = () => {
    const fileExtension = currentFile?.fileName.split(".").pop()?.toLowerCase();
    console.log(fileExtension);

    switch (fileExtension) {
      case "ts":
        return "typescript";
      case "tsx":
        return "typescript";
      case "js":
        return "javascript";
      case "jsx":
        return "javascript";
      case "json":
        return "json";
      case "css":
        return "css";
      case "html":
        return "html";
      case "md":
      case "markdown":
        return "markdown";
      case "xml":
        return "xml";
      case "yaml":
      case "yml":
        return "yaml";
      case "py":
        return "python";
      case "java":
        return "java";
      case "cpp":
      case "cc":
      case "cxx":
        return "cpp";
      case "c":
        return "c";
      case "go":
        return "go";
      case "php":
        return "php";
      case "sql":
        return "sql";
      case "sh":
      case "bash":
        return "shell";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col">
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className="w-64 lg:w-80 border-r border-neutral-800 bg-neutral-950 flex-shrink-0">
          <div className="p-3 border-b border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Explorer</span>
              <div className="flex gap-1">
                <label className="flex items-center justify-center h-6 w-6 cursor-pointer rounded-md hover:bg-neutral-800 text-white">
                  <Plus className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFolderImport}
                    {...({
                      webkitdirectory: "",
                      directory: "",
                      multiple: true,
                    } as any)}
                  />
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-neutral-800 rounded-md"
                >
                  <FolderOpen className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <ScrollArea className="max-h-[90%] overflow-y-auto">
            {renderTree(projectTree)}
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b border-neutral-800 bg-neutral-900 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentFile ? (
                  <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-md">
                    {getFileIcon(currentFile.fileName)}
                    <span className="text-white text-sm font-medium">
                      {currentFile.fileName}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-neutral-400 hover:text-white hover:bg-neutral-700"
                      onClick={closeFile}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-neutral-400 text-sm">
                    No file selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-neutral-800 gap-2"
                >
                  <Play className="h-4 w-4" />
                  Run
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-neutral-800 gap-2"
                >
                  <Users className="h-4 w-4" />
                  Invite
                </Button>
              </div>
            </div>
          </div>

          {currentFile ? (
            <MonacoEditor
              height="100%"
              language={getLanguage()}
              theme="vs-dark"
              value={currentFile.fileContent}
              onChange={(text) => {
                setCurrentFile({
                  fileName: currentFile?.fileName ?? "",
                  fileContent: text || "",
                });
              }}
              options={{
                lineNumbers: "on",
                minimap: {
                  enabled: false,
                  showSlider: "mouseover",
                  renderCharacters: false,
                },
                fontSize: 14,
                tabSize: 2,
                wordWrap: "off",
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-neutral-950">
              <div className="text-center text-neutral-400">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No file selected</p>
                <p className="text-sm">
                  Select a file from the explorer to start editing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Area */}
      <div className="border-t border-neutral-800 bg-neutral-900 h-40 flex-shrink-0">
        <Tabs defaultValue="terminal" className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
            <TabsList className="h-7 bg-transparent p-0 space-x-1">
              <TabsTrigger
                value="terminal"
                className="h-7 px-3 text-xs bg-neutral-800 data-[state=active]:bg-neutral-700 text-neutral-400 data-[state=active]:text-white rounded-lg"
              >
                Terminal
              </TabsTrigger>
              <TabsTrigger
                value="output"
                className="h-7 px-3 text-xs bg-neutral-800 data-[state=active]:bg-neutral-700 text-neutral-400 data-[state=active]:text-white rounded-lg"
              >
                <Zap className="h-3 w-3 mr-1" />
                Output
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="terminal"
            className="m-0 flex-1 min-h-0"
          ></TabsContent>
          <TabsContent
            value="output"
            className="m-0 flex-1 min-h-0"
          ></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
