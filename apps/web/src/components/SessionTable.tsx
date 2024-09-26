import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { MoveHorizontalIcon } from '@/icons/MoveHorizantalIcon'
import prisma from '@/lib/prisma'
import { AuthOptions, getServerSession } from 'next-auth'
import { NEXT_AUTH } from '@/lib/auth'
import { Usr } from '@/types'
const SessionTable =async () => {
    const sessions=await prisma.session.findMany({
        where:{

        }
    })
    return (

        <Card className="border-2 border-[#7f7ff5] w-full shadow-md">
            <CardHeader>
                <CardTitle>Your React Applications</CardTitle>
                <CardDescription>Manage and view details of your previously created React applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Created At</TableHead>
                            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">
                                <Link href="#" className="hover:underline" prefetch={false}>
                                    Example App
                                </Link>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">2023-04-15</TableCell>
                            <TableCell className="hidden md:table-cell">2023-06-30</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoveHorizontalIcon className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Link href="#" prefetch={false}>
                                                Open
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="#" prefetch={false}>
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Button variant="destructive">Delete</Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>1-3</strong> of <strong>3</strong> apps
                </div>
            </CardFooter>
        </Card>

    )
}

export default SessionTable
