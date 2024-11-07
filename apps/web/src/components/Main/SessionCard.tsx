import { CodeIcon } from '@/icons/CodeIcon';
import { Session } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Ellipsis } from 'lucide-react';

const SessionCard = ({ Details }: { Details: Session }) => {
    const createdAtDate = new Date(Details.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdAtDate.getTime();
    const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24));

    return (
        <Link href={`/session/${Details.id}`} className="bg-[#0A0A0A] border border-[#2D2D2D] p-6 rounded-lg transition-all hover:border-white block">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <CodeIcon className="h-6 w-6 text-white mr-2" />
                    <div className="font-semibold text-base text-white">{Details.name.toLowerCase()}</div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-white">
                            <Ellipsis className="h-4 w-4 text-white border-none outline-none" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        side="right"
                        sideOffset={5}
                        className="bg-black border border-[#2D2D2D] rounded-md text-left text-white"
                    >
                        <DropDownItem name="Open">{Details.id}</DropDownItem>
                        <DropDownItem name="Settings">{Details.id}</DropDownItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Button variant="destructive" className="text-red-600 text-left w-full">
                                Delete
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className="text-sm text-gray-400 mt-2">{Details.desc}</p>
            <div className="text-xs text-gray-500 mt-2">
                Created: {daysPassed === 0 ? 'Today' : `${daysPassed} ${daysPassed === 1 ? 'day' : 'days'} ago`}
            </div>
        </Link>
    );
};

export default SessionCard;

function DropDownItem({children,name}:{children: string,name?:string}) {
    return (
        <DropdownMenuItem>
        <Link href={`/session/${children}/settings`} prefetch={false} className="text-white text-center w-full block">
            {name}
        </Link>
    </DropdownMenuItem>
    )
}