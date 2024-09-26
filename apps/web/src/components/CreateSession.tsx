'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardTitle,
  CardContent,

} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "./Navbar"
import { PlusIcon } from "@/icons/PlusIcon"
import {  useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export function CreateSession() {
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [sessions, setSessions] = useState();
  const router=useRouter();

  const handleClick = async () => {
    try {
      const res = await axios.post('/api/session', 
       { name, desc },
      );
      console.log(res.data.id);
      router.push(`/session/${encodeURIComponent(res.data.id)}`);
      
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6">
            <Card className="group border-2 border-[#7f7ff5] w-64 h-64 flex flex-col justify-center items-center shadow-md">
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                <PlusIcon className="h-16 w-16 text-muted-foreground group-hover:text-primary" />
                <CardTitle className="text-lg font-medium group-hover:text-primary">Create New App</CardTitle>
                <p className="text-sm text-muted-foreground">Set up a new React application with customizable options.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-[#7f7ff5] text-white mt-2 hover:bg-[#6363f3]">Create New App</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white border-2 border-[#6363f3]">
                    <DialogHeader>
                      <DialogTitle className="">Create New App</DialogTitle>
                      <DialogDescription className="">
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right ">
                          Name
                        </Label>
                        <Input
                          onChange={(event: any) => setName(event?.target?.value)}
                          id="name"
                          className="col-span-3 border border-[#6363f3]"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right ">
                          Description
                        </Label>
                        <Input
                          onChange={(event: any) => setDesc(event?.target?.value)}
                          id="description"
                          className="col-span-3 border border-[#6363f3]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleClick} className="bg-[#6363f3] text-white">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
