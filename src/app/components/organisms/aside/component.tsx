"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCharacters } from "@/app/contexts/characterContexts";
import characterService from "@/app/services/characterService";
import CharacterItem from "@/app/components/molecules/characterItem/component";
import { Character, CharacterResponse } from "@/app/types/character";

const Component = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { state, dispatch } = useCharacters();
  const { characters, starredCharacters, loading, error } = state;

  useEffect(() => {
    fecthCharacters(page);
  }, [page]);

  const fecthCharacters = async (page: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response: CharacterResponse = await characterService.getCharacters(
        page
      );
      if (response) {
        dispatch({ type: "SET_CHARACTERS", payload: response.results });
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const filteredCharacters = useMemo(() => {
    const starredIds = new Set(starredCharacters.map((char) => char.id));
    return characters.filter((character) => !starredIds.has(character.id));
  }, [characters, starredCharacters]);

  const handleCharacterSelect = (character: Character) => {
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
    router.push(`/character/${character.id}`);
  };

  return (
    <aside className="w-1/4 h-full">
      <div className="p-6">
        <h2 className="leading-8 text-2xl font-normal text-text">Rick and Morty list</h2>
      </div>
      <div className="flex flex-col gap-4 p-6 h-[calc(100vh-104px)] overflow-y-auto">
        <ul className="list-none">
          <li>
            <span className="text-gray-500 text-xs leading-4 font-semibold tracking-wider uppercase">
              Starred Characters ({starredCharacters.length})
            </span>
          </li>
          {starredCharacters && starredCharacters.map((character) => (
            <li key={character.id}>
              <CharacterItem
                character={character}
                handleCharacterSelect={() => handleCharacterSelect(character)}
              />
            </li>
          ))}
          <li>
            <span className="text-gray-500 text-xs leading-4 font-semibold tracking-wider uppercase">
              Characters ({filteredCharacters.length})
            </span>
          </li>
          {filteredCharacters && filteredCharacters.map((character) => (
            <li key={`character-${character.id}`}>
              <CharacterItem
                character={character}
                handleCharacterSelect={() => handleCharacterSelect(character)}
              />
            </li>
          ))}
        </ul>
      </div>
      {loading && <span>Loading...</span>}
    </aside>
  );
};

export default Component;
