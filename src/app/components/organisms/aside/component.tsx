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
    fetchCharacters(page);
  }, [page]);

  const fetchCharacters = async (page: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response: CharacterResponse = await characterService.getCharacters(page);
      
      if (response) {
        dispatch({ type: "SET_CHARACTERS", payload: response.results });
        dispatch({ type: "SET_ERROR", payload: null });
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Separar personajes en starred y no-starred para mejor organización
  const { starredList, regularList } = useMemo(() => {
    const starredIds = new Set(starredCharacters.map((char) => char.id));
    
    return {
      starredList: starredCharacters,
      regularList: characters.filter((character) => !starredIds.has(character.id))
    };
  }, [characters, starredCharacters]);

  const handleCharacterSelect = (character: Character) => {
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
    router.push(`/character/${character.id}`);
  };

  if (error) {
    return (
      <aside className="xl:w-1/4 md:w-1/3 w-screen h-[calc(100vh-24px)] bg-white">
        <div className="p-6">
          <div className="text-red-500 text-center">
            <p>Error: {error}</p>
            <button 
              onClick={() => fetchCharacters(page)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="xl:w-1/4 md:w-1/3 w-screen h-[calc(100vh-24px)] bg-white">
      <div className="p-6 border-b border-gray-100">
        <h2 className="leading-8 text-2xl font-normal text-text">
          Rick and Morty list
        </h2>
      </div>

      <div className="flex flex-col gap-4 px-6 max-h-[calc(100vh-104px)] overflow-y-auto">
        <ul className="list-none space-y-2">
          {starredList.length > 0 && (
            <>
              <li className="sticky top-0 bg-white py-2">
                <span className="text-gray-500 text-xs leading-4 font-semibold tracking-wider uppercase">
                  Starred Characters ({starredList.length})
                </span>
              </li>
              {starredList.map((character) => (
                <li key={`starred-${character.id}`}>
                  <CharacterItem
                    character={character}
                    handleCharacterSelect={() => handleCharacterSelect(character)}
                  />
                </li>
              ))}
              
              {/* Separator */}
              <li className="py-2">
                <hr className="border-gray-200" />
              </li>
            </>
          )}

          {/* Regular Characters Section */}
          <li className="sticky top-0 bg-white py-2">
            <span className="text-gray-500 text-xs leading-4 font-semibold tracking-wider uppercase">
              Characters ({regularList.length})
            </span>
          </li>
          
          {regularList.length > 0 ? (
            regularList.map((character) => (
              <li key={`character-${character.id}`}>
                <CharacterItem
                  character={character}
                  handleCharacterSelect={() => handleCharacterSelect(character)}
                />
              </li>
            ))
          ) : (
            !loading && (
              <li className="text-center text-gray-500 py-4">
                {starredList.length > 0 
                  ? "All Characters are starred"
                  : "No characters available"
                }
              </li>
            )
          )}
        </ul>
      </div>

      {loading && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-gray-500 text-sm">Loading Character...</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Component;