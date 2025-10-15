'use client'
import React from 'react'
import { Search, Moon, Globe, User, Menu, X, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useUIStore } from '@/stores/uiStore'

const Navbar = () => {
  const { isNavMenuOpen, isNavSearchOpen, toggleNavMenu, toggleNavSearch, closeNavSearch } =
    useUIStore()

  return (
    <div className="fixed top-4 left-1/2 z-10 w-full max-w-6xl -translate-x-1/2 px-4">
      <div className="h-14 rounded-md bg-white px-4 py-2 shadow-lg backdrop-blur-sm md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="EOTCBible Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">EOTCBible</span>
            </div>
            <div className="hidden items-center space-x-8 md:flex">
              <Link href="/read-online">Bible</Link>
              <Link href="#" className="text-black hover:text-gray-900">
                Plans
              </Link>
              <Link href="#" className="text-black hover:text-gray-900">
                Notes
              </Link>
            </div>
          </div>
          <div className="hidden items-center justify-between space-x-4 md:flex">
            <div className="flex h-[42px] items-center overflow-hidden rounded-lg border">
              <div className="flex h-full items-center bg-red-900 p-3">
                <Search className="text-white" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="h-full w-full bg-gray-100 px-4 py-2 focus:outline-none"
              />
            </div>
            <button className="flex h-[42px] w-fit items-center space-x-2 rounded-lg bg-red-900 py-2 pr-2 pl-6 text-white md:w-fit">
              <span>Get the app</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
                <ArrowUpRight size={20} />
              </div>
            </button>
            <Link href="/login">
              <button className="h-[42px] rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
                Login
              </button>
            </Link>
            <div className="flex h-[42px] items-center space-x-2 rounded-md border p-1">
              <button className="rounded-full p-2 hover:bg-gray-200">
                <Moon size={20} />
              </button>
              <button className="rounded-full p-2 hover:bg-gray-200">
                <Globe size={20} />
              </button>
              <button className="rounded-full p-2 hover:bg-gray-200">
                <User size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={toggleNavSearch} className="rounded-lg bg-red-900 p-2 text-white">
              <Search size={24} />
            </button>
            <button onClick={toggleNavMenu}>
              {isNavMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isNavSearchOpen && (
        <div className="absolute top-0 left-0 z-20 w-full">
          <div className="mt-2 rounded-md bg-white p-4">
            <div className="flex h-[42px] items-center overflow-hidden rounded-lg border">
              <div className="flex h-full items-center bg-red-900 p-3">
                <Search className="text-white" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="h-full w-full bg-gray-100 px-4 py-2 focus:outline-none"
              />
              <button onClick={closeNavSearch} className="p-2">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
      {isNavMenuOpen && (
        <div className="mt-2 space-y-4 rounded-md bg-white p-4 md:hidden">
          <a href="/read-online" className="block text-black hover:text-gray-900">
            Bible
          </a>
          <a href="#" className="block text-black hover:text-gray-900">
            Plans
          </a>
          <a href="#" className="block text-black hover:text-gray-900">
            Notes
          </a>
          <button className="flex h-[42px] w-full items-center justify-between rounded-lg bg-red-900 py-2 pr-2 pl-6 text-lg text-white">
            <span>Get the app</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
              <ArrowUpRight size={20} />
            </div>
          </button>
          <Link href="/login">
            <button className="h-[42px] w-full rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navbar
