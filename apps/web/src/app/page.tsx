"use client"
import { useState } from "react";
import axios from 'axios';
import { Editor } from "../../../../node_modules/@monaco-editor/react/dist/index";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {
  const [code, setCode] = useState<string>("");  
  const [output, setOutput] = useState<string>("");
  const [accepted, setAccepted] = useState<boolean | null>(null); 
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");  

  const handleEditorChange=(value: any, event: any)=> {
    setCode(value);
  }
  const handleLanguageChange=(language: string)=> {
    setSelectedLanguage(language);
    switch (language) {
      case "cpp":
        setCode(`#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`);
        break;
      case "py":
        setCode(`print("Hello, World!")`);
        break;
      case "js":
        setCode(`console.log("Hello, World!");`);
        break;
      case "java":
        setCode(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`);
        break;
      default:
        setCode("// Start coding here...");
    }
  }
  const handleClick=async ()=> {
    try {
      const response = await axios.post('http://localhost:3001/run-code', { code,selectedLanguage });
      setOutput(response.data.output);
      if (response.status === 200) setAccepted(true);
    } catch (error: any) {
      console.log(error);
      setAccepted(false);
      setOutput(error.response?.data?.error || "Error executing code");
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-black p-10">
      <Editor
        className="border border-gray-600"
        height="60vh"
        width="60vw"
        language={selectedLanguage}  
        theme="vs-dark"
        value={code}  
        onChange={handleEditorChange}  
      />
      <div className="flex p-2 justify-center items-center">
        <div className="p-2">
          <Select onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] text-white border border-[#27272B]">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="text-white">
                <SelectLabel>Language</SelectLabel>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="py">Python</SelectItem>
                <SelectItem value="js">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="ts">TypeScript</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-2">
          <Button className="bg-white h-10 w-20 mt-4" onClick={handleClick}>
            Submit
          </Button>
          {accepted && (
            <div className="p-4 m-2 rounded-md shadow-md text-green-500">Accepted</div>
          )}
          {accepted === false && (
            <div className="p-4 m-2 rounded-md shadow-md text-red-500">Rejected</div>
          )}
          <div className="text-white mt-4">
            {output && <pre>{output}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}
