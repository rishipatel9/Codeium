"use client"
import { useState } from "react";
import axios from 'axios';
import { Editor } from "../../../../node_modules/@monaco-editor/react/dist/index";

export default function Page() {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [accepted,setAccepted]=useState<boolean | null>(null);

  function handleEditorChange(value, event) {
    setCode(value);
  }

  async function handleClick() {
    try {
      const response = await axios.post('http://localhost:3001/run-code', { code });
      setOutput(response.data.output); 
      if(response.status==200) setAccepted(true)
      else setAccepted(false)
      
    } catch (error:any) {
      console.log(error);
      setOutput(error.response?.data?.error || "Error executing code");
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-black">
      <Editor
        className="border border-gray-600"
        height="60vh"
        width="80vw"
        defaultLanguage="javascript"
        theme="vs-dark"
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
      <button className="bg-white h-10 w-20 mt-4" onClick={handleClick}>
        Submit
      </button>
      {
        accepted && 
        <div className=" p-4 m-2 rounded-md shadow-md text-green-500">  Accepted</div>
      }
      {accepted==false && 
      <div className=" p-4 m-2 rounded-md shadow-md text-red-500">Rejected</div>

      }
      <div className="text-white mt-4">{output && <pre>{output}</pre>}</div>
    </div>
  );
}
