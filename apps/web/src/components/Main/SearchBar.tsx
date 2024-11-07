import { Input } from "@/components/ui/input";

import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import AddNewSession from "./AddNewSession";


export default function SearchBar() {
  return (
    <div className="space-y-2 py-6">
      {/* <Label htmlFor="input-25"></Label> */}
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center w-full">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 text-[#8F8F8F]">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
          <Input
            id="input-25"
            className="pl-10 pr-10 bg-[#0A0A0A] border border-[#2D2D2D] text-[#8F8F8F] font-normal hover:border-2 hover:transition-all"
            placeholder="Search..."
            type="search"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pr-3 text-[#8F8F8F]">
            <kbd className="inline-flex h-5 max-h-full items-center rounded border border-[#2D2D2D] px-1 font-[inherit] text-[0.625rem] font-medium text-[#8F8F8F]">
              ⌘K
            </kbd>
          </div>
        </div>
        <AddNewSession/>
      </div>
    </div>
  );
}
