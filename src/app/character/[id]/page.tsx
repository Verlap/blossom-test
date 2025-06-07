"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import InfoField from "@/app/components/atoms/infoField/component";
import CharacterHeader from "@/app/components/molecules/characterHeader/component";
import BackButton from "@/app/components/atoms/backButton/component";
import { useCharacters } from "@/app/contexts/characterContext";
import characterService from "@/app/services/characterService";
import { Character } from "@/app/types/character";

export default function CharacterPage() {
  const router = useRouter();
  const params = useParams();
  const { state, dispatch } = useCharacters();
  const { selectedCharacter } = state;

  useEffect(() => {
    if (!params.id) {
      router.push("/");
      return;
    }
    getCharacter();
  }, [params.id, state.characters, dispatch, router]);

  const getCharacter = async () => {
      const character = state.characters.find(
        (char) => char.id === parseInt(String(params.id))
      );
      if (character) {
        dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
      } else {
        try{
          const response:Character = await characterService.getCharactersById(String(params.id));
          if (response) {
            dispatch({ type: "SET_SELECTED_CHARACTER", payload:  response });
          } else {
            dispatch({ type: "SET_SELECTED_CHARACTER", payload: null });
            router.push("/");
          }
        }
        catch (error: any) {
          console.error("Error fetching character:", error);
          dispatch({ type: "SET_SELECTED_CHARACTER", payload: null });
          router.push("/");
        }
      }
    }

  const handleBack = () => {
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: null });
    router.push("/");
  };

  return (
    <div className="content bg-white content w-full h-full relative z-10">
      {selectedCharacter ? (
        <>
          <div className="md:hidden flex p-4">
            <BackButton onBack={()=> handleBack()} />
          </div>
          <CharacterHeader {...selectedCharacter} />
          <div>
            <InfoField title="Name" value={selectedCharacter.name} />
            <InfoField title="Status" value={selectedCharacter.status} />
            <InfoField title="Species" value={selectedCharacter.species} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">Character not found</p>
        </div>
      )}
    </div>
  );
}