import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MoveHorizontalIcon } from '@/icons/MoveHorizantalIcon';
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; 

const SessionTable = ({ sessions, loading }: { sessions: any[]; loading: boolean }) => {
    return (
      <Card className="border-2 border-[#7f7ff5] w-full shadow-md">
        <CardHeader>
          <CardTitle>Your React Applications</CardTitle>
          <CardDescription>Manage and view details of your previously created React applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton count={5} height={40} className="mb-2" />
          ) : (
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
                {sessions?.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      <Link href={`/session/${session.id}`} className="hover:underline" prefetch={false}>
                        {session.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(session.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(session.createdAt).toLocaleDateString()}</TableCell>
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
                            <Link href={`/session/${session.id}`} prefetch={false}>
                              Open
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/session/${session.id}/settings`} prefetch={false}>
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{sessions?.length}</strong> of <strong>{sessions?.length}</strong> apps
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  export default SessionTable;
