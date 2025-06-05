"use client";
import React, {use, useEffect} from "react";
import { useParams, useRouter } from "next/navigation";

import { useCharacters } from "@/app/contexts/characterContexts";

export default function CharacterPage() {
  const router = useRouter();
  const params = useParams();
  const { state, dispatch } = useCharacters();
  const {selectedCharacter, loading, error} = state;

  useEffect(() => {
    if (!params.id) {
      router.push("/");
      return;
    }

    const character = state.characters.find((char) => char.id === parseInt(String(params.id)));
    if (character) {
      dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
    } else {
      dispatch({ type: "SET_ERROR", payload: "Character not found" });
      router.push("/");
    }
  }, [params.id, state.characters, dispatch, router]);
  



  return (
    <div className="content">
      <div className="pb-2">
        <img src={selectedCharacter?.image} alt={selectedCharacter?.name} className="w-[75px] h-[75px] rounded-full inline-block mb-2" />
        <h1 className="text-2xl leading-8 font-bold">{selectedCharacter?.name}</h1>
      </div>
      <div>
        <div className="border-b border-gray-300 py-4 mb-4">
          <p className="text-base leading-6 font-semibold text-slate-900">Specie</p>
          <p className="text-base leading-6 font-medium text-slate-500">{selectedCharacter?.species}</p>
        </div>
        <div className="border-b border-gray-300 py-4 mb-4">
          <p className="text-base leading-6 font-semibold text-slate-900">Status</p>
          <p className="text-base leading-6 font-medium text-slate-500">{selectedCharacter?.status}</p>
        </div>
        <div className="border-b border-gray-300 py-4 mb-4">
          <p className="text-base leading-6 font-semibold text-slate-900">Location</p>
          <p className="text-base leading-6 font-medium text-slate-500">{selectedCharacter?.location.name}</p>
        </div>
      </div>
    </div>
  );
}