import { CodeIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import SignOut from './SignOut';


const Navbar =  () => {
    return (
        <nav className="bg-white text-[#7f7ff5] border-b mb-2 ">
            <div className="max-w-7xl h-14 mx-auto flex justify-between items-center px-4 py-3 md:py-4">
                <Link href="" className="flex items-center justify-center" >
                    <CodeIcon className="h-6 w-6" />
                    <span className="font-bold text-xl">Codeium</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <SignOut />
                </nav>
            </div>
        </nav>
    );
};



export default Navbar;
