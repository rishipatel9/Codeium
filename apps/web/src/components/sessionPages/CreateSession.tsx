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
import Navbar from "../Navbar"
import { PlusIcon } from "@/icons/PlusIcon"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import SessionTable from "./SessionTable"
import { Loader2 } from "lucide-react"

export function CreateSession() {
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [dbsession, setDbSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("/api/getsessions");
      setDbSessions(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    if (!name.trim()) {
      alert("Please enter a name for your app.");
      return;
    }
    try {
      setIsCreating(true);
      const res = await axios.post("/api/createsession", { name, desc });
      setDialogOpen(false);
      router.push(`/session/${encodeURIComponent(res.data.id)}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the session.");
    } finally {
      setIsCreating(false);
    }
  };

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
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-[#7f7ff5] text-white mt-2 hover:bg-[#6363f3]">
                      Create New App
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white border-2 border-[#6363f3]">
                    <DialogHeader>
                      <DialogTitle>Create New App</DialogTitle>
                      <DialogDescription>
                        Enter the details for your new React application.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                          onChange={(event) => setName(event.target.value)}
                          id="name"
                          className="col-span-3 border border-[#6363f3]"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input
                          onChange={(event) => setDesc(event.target.value)}
                          id="description"
                          className="col-span-3 border border-[#6363f3]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleClick} 
                        className="bg-[#6363f3] text-white"
                        disabled={isCreating} 
                      >
                        {isCreating ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </span>
                        ) : (
                          "Create App"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            <SessionTable sessions={dbsession} loading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}