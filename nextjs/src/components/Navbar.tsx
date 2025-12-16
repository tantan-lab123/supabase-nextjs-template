"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import AuthAwareButtons from "@/components/AuthAwareButtons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const productName = "LeadAlert";

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              {productName}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900"
            >
              פיצ&apos;רים
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              מחירים
            </Link>
            <AuthAwareButtons variant="nav" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              פיצ&apos;רים
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              מחירים
            </Link>
            <div className="pt-2 px-3 flex flex-col gap-3">
              <AuthAwareButtons variant="nav" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
