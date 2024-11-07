'use client'
import React, { useState } from 'react';
import { Button } from "../ui/button";
import { PlusIcon } from '@/icons/PlusIcon';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { DescInput, NameInput } from '../Signup/InputBox';
import clsx from 'clsx'; 
import { LabelInputContainer } from '../ui/LabelInputContainer';

const AddNewSession = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Name is required!");
            return;
        }
        setIsCreating(true);
        try {
            const response = await fetch('/api/createsession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, desc: description }),
            });

            if (!response.ok) throw new Error("Failed to create session.");
            console.log("Session created successfully!");
            setName('');
            setDescription('');
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error creating session:", error);
            alert("Failed to create session.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className={clsx({ 'blur-background': isDialogOpen })}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="flex items-center px-4 py-2 md:px-8 bg-white text-[#2D2D2D] font-medium rounded-md hover:bg-[#f0f0f0] h-[2.5rem]">
                        <PlusIcon className="h-5 w-5 md:hidden" />
                        <span className="hidden md:inline">Create</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-md bg-[#0A0A0A] text-white border-2 border-[#2D2D2D]">
                    <DialogHeader>
                        <DialogTitle>Create New App</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new React application.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className=" items-center gap-4">
                        <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">App's Name <span className="text-red-500">*</span></Label>
                            <NameInput
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                id="name"
                                required
                                placeholder='Landing Page'
                            />
                            </LabelInputContainer>
                        </div>
                        <div className="items-center gap-4">
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="description" >Description</Label>
                            <DescInput
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                id="description"
                                placeholder='A simple landing page for your app.'
                            />
                            </LabelInputContainer>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleSubmit}
                            className="bg-white  text-black w-full"
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
        </div>
    );
};

export default AddNewSession;
