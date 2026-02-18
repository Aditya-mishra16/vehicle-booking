"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-tight">
            VehicleBooking
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/vehicles">
              <Button variant="ghost">Vehicles</Button>
            </Link>

            <Link href="/drivers">
              <Button variant="ghost">Drivers</Button>
            </Link>

            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>

            <ThemeToggle />

            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex flex-col gap-4 mt-6">
                {/* Required for accessibility */}
                <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>

                <Link href="/vehicles">
                  <Button variant="ghost" className="w-full justify-start">
                    Vehicles
                  </Button>
                </Link>

                <Link href="/drivers">
                  <Button variant="ghost" className="w-full justify-start">
                    Drivers
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="ghost" className="w-full justify-start">
                    Contact
                  </Button>
                </Link>

                <ThemeToggle />

                <Link href="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
