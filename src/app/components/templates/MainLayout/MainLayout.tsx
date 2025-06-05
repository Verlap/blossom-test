"use client";
import React, { ReactNode } from "react";
import Aside from "@/app/components/organisms/aside/component";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex h-full bg-gray-100">
        <Aside />
        <main className="content shadow-main w-3/4 py-[40px] px-[100px]">
          {children}
        </main>
      </div>
      <footer className="text-center text-gray-400">Hecho por Maria Mesa Rojas</footer>
    </div>
  );
}
