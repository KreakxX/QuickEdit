"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  File,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  Menu,
  Play,
  Plus,
  Save,
  Search,
  Settings,
  Terminal,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import { themes } from "prism-react-renderer";
import { useState } from "react";

export default function Component() {
  const [projectTree, setProjectTree] = useState<any>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handleFolderInport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files; // get all the files
    if (files) {
      const tree: any = {}; // create a new tree empty object

      Array.from(files).forEach((file) => {
        const parts = file.webkitRelativePath.split("/"); // get all the parts from the directory
        let current = tree; // current is tree

        parts.forEach((part, i) => {
          if (i === parts.length - 1) {
            // if the part is the last than it must be a file
            current[part] = file; // so we say the current tree at the specific part like "header.tsx" is a file
          } else {
            if (!current[part]) current[part] = {}; // else create a directory at te currentPart
            current = current[part]; // and go into the directory
          }
        });
      });
      /*     this is how it looks like after for example
      tree = {
  "src": {
    "components": {
      "Header.tsx": File_Object
    },
    "utils": {
      "math.ts": File_Object  
    }
  },
  "package.json": File_Object
}
  */

      setProjectTree(tree); // and make the ProjectTree the tree
    }
  };

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev); // if its in close like remove not showing anymore not in and clicking adding it and showing itn ow
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  };

  const renderTree = (obj: any, path = "", depth = 0) => {
    return Object.keys(obj).map((key) => {
      const currentPath = `${path}/${key}`;
      const isFile = obj[key]?.name && obj[key]?.size !== undefined;
      const isExpanded = expanded.has(currentPath);
      // extension checken und dann richtiges und passendes icon machen und cleanr mchen
      return (
        <div key={currentPath}>
          <div
            className="flex items-center gap-2 p-1 text-white hover:bg-gray-700 cursor-pointer"
            style={{ paddingLeft: depth * 16 }}
            onClick={() => !isFile && toggle(currentPath)}
          >
            {isFile ? "📄" : isExpanded ? "📂" : "📁"} {key}
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

  return (
    <div className="h-screen w-full bg-black flex flex-col">
      <div className="flex-1 flex">
        <div className="w-64 border-r border-neutral-800 bg-neutral-950 rounded-bl-lg">
          <div className="p-3 border-b border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Explorer</span>
              <div className="flex gap-1">
                <label className="flex items-center justify-center h-5 w-8 cursor-pointer rounded-md  text-white text-xl font-bold ">
                  +
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFolderInport}
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

          <ScrollArea className=" ml-5 ">{renderTree(projectTree)}</ScrollArea>
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-neutral-900 rounded-b-lg">
        <Tabs defaultValue="terminal" className="w-full">
          <div className="flex items-center justify-between px-4 py-2">
            <TabsList className="h-7 bg-transparent p-0 space-x-1">
              <TabsTrigger
                value="terminal"
                className="h-7 px-3 text-xs bg-neutral-800 data-[state=active]:bg-neutral-700 text-neutral-400 data-[state=active]:text-white rounded-lg"
              >
                <Terminal className="h-3 w-3 mr-1" />
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

          <Separator className="bg-neutral-800" />

          <TabsContent value="terminal" className="m-0 h-32">
            <ScrollArea className="h-full">
              <div className="p-4 font-mono text-xs space-y-2">
                <div className="text-neutral-400">$ npm run dev</div>
                <div className="text-green-400">✓ Ready in 1.2s</div>
                <div className="text-neutral-400">
                  Local: http://localhost:3000
                </div>
                <div className="flex items-center">
                  <span className="text-neutral-400">$ </span>
                  <div className="w-2 h-4 bg-white ml-1 animate-pulse rounded-sm"></div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="output" className="m-0 h-32">
            <ScrollArea className="h-full">
              <div className="p-4 font-mono text-xs space-y-2">
                <div className="text-blue-400">
                  [INFO] Build completed successfully
                </div>
                <div className="text-neutral-400">No errors found</div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
