"use client";
import React, { ReactNode } from "react";

import { useCharacters } from "@/app/contexts/characterContexts";
import Aside from "@/app/components/organisms/aside/component";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { state } = useCharacters();
  const { selectedCharacter } = state;

  return (
    <div className="min-h-screen">
      <div className="flex h-full bg-white">
        <Aside />
        <main className={`bg-white shadow-main xl:w-3/4 md:w-2/3 w-screen h-screen md:relative absolute md:py-[40px] md:px-[100px] md:block ${selectedCharacter ? "block" : "hidden"}`}>
          {children}
        </main>
      </div>
      <footer className="text-center text-gray-400">Hecho por Maria Mesa Rojas</footer>
    </div>
  );
}
