import React from "react";
import { Search, Moon, Globe, User, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-6xl z-10 px-4">
      <div className="bg-white backdrop-blur-sm rounded-md h-14 shadow-lg px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="EOTCBible Logo" className="w-8 h-8" />
              <span className="font-bold text-xl">EOTCBible</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Button asChild variant={"outline"}
                // className="text-black hover:text-gray-900"
              >
                <Link href="#">Bible</Link>
              </Button>
              <Button asChild variant={"outline"}>
                <Link href="#" className="text-black hover:text-gray-900">
                  Plans
                </Link>
              </Button>
              <Button asChild variant={"outline"}>
                <Link href="#" className="text-black hover:text-gray-900">
                  Notes
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center border rounded-lg overflow-hidden h-[42px]">
              <div className="p-3 bg-red-900 h-full flex items-center">
                <Search className="text-white" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 py-2 px-4 w-full h-full focus:outline-none"
              />
            </div>
            <button className="bg-red-900 text-white pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 h-[42px]">
              <span>Get the app</span>
              <div className="bg-white text-red-900 rounded-sm p-1 flex items-center justify-center w-7 h-7">
                <ArrowUpRight size={20} />
              </div>
            </button>
            <Link href="/login">
              <button className="bg-white text-red-900 border border-red-900 px-6 py-2 rounded-lg h-[42px] hover:bg-red-900 hover:text-white">
                Login
              </button>
            </Link>
            <div className="flex items-center space-x-2 border rounded-md p-1 h-[42px]">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <Moon size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200">
                <Globe size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
