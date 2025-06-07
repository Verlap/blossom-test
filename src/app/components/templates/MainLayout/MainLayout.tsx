"use client";
import React, { ReactNode } from "react";

import { useCharacters } from "@/app/contexts/characterContext";
import Aside from "@/app/components/organisms/aside/component";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { state } = useCharacters();
  const { selectedCharacter } = state;

  return (
    <div className="min-h-screen">
      <div className="flex h-full h-full bg-white">
        <Aside />
        <main className={`bg-white shadow-main xl:w-3/4 md:w-2/3 w-screen h-[calc(100vh-24px)] md:relative absolute md:py-[40px] md:px-[100px] md:block ${selectedCharacter ? "block" : "hidden"}`}>
          {children}
        </main>
      </div>
      <footer className="text-center text-gray-400">Hecho por Maria Mesa Rojas</footer>
    </div>
  );
}
