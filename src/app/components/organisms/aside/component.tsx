"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCharacters } from "@/app/contexts/characterContext";
import CharacterItem from "@/app/components/molecules/characterItem/component";
import SearchFilter, {
  FilterState,
} from "@/app/components/organisms/searchFilter/component";
import { Character} from "@/app/types/character";

const Component = () => {
  const router = useRouter();
  const {
    state,
    dispatch,
    fetchCharacters,
    fetchMoreCharacters,
    getFilteredCharacters,
    setFilters,
  } = useCharacters();

  const { selectedCharacter, hasMoreCharacters, loading, error, filters } =
    state;

  useEffect(() => {
    if (state.characters.length === 0) {
      fetchCharacters();
    }
  }, []);

  const { starredList, regularList } = getFilteredCharacters();

  const handleCharacterSelect = (character: Character) => {
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
    router.push(`/character/${character.id}`);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleShowMore = () => {
    fetchMoreCharacters();
  };

  if (error) {
    return (
      <aside
        className={`xl:w-1/4 md:w-1/3 w-screen h-[calc(100vh-24px)] bg-white`}
      >
        <div className="p-6">
          <div className="text-red-500 text-center">
            <p>Error: {error}</p>
            <button
              onClick={() => fetchCharacters()}
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
    <aside className="xl:w-1/4 md:w-1/3 w-screen h-[calc(100vh-24px)] bg-white overflow-hidden relative">
      <div className="h-1/5 !mb-4">
        <h2 className="leading-8 text-2xl font-normal text-text p-6">
          Rick and Morty list
        </h2>
        <SearchFilter
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
      </div>
      <nav
        className="flex flex-col gap-4 px-6 max-h-4/5 pb-8 overflow-y-auto"
        aria-label="Character list"
      >
        <ul className="list-none space-y-2">
          {starredList.length > 0 && (
            <>
              <li className="sticky top-0 bg-white py-2 z-3">
                <span className="text-gray-500 text-xs leading-4 font-semibold tracking-wider uppercase">
                  Starred Characters ({starredList.length})
                </span>
              </li>
              {starredList.map((character) => (
                <li
                  key={`starred-${character.id}`}
                  className="border-t border-gray-300"
                >
                  <CharacterItem
                    character={character}
                    handleCharacterSelect={() =>
                      handleCharacterSelect(character)
                    }
                  />
                </li>
              ))}
            </>
          )}

          {filters.characterType !== "starred" && (
            <>
              <li className="sticky top-0 bg-white py-2 z-3">
                <span className="text-gray-500 text-xs leading-4 font-semibold tracking-wider uppercase">
                  Characters ({regularList.length})
                </span>
              </li>

              {regularList.length > 0
                ? regularList.map((character) => (
                    <li
                      key={`character-${character.id}`}
                      className="border-t border-gray-300"
                    >
                      <CharacterItem
                        character={character}
                        handleCharacterSelect={() =>
                          handleCharacterSelect(character)
                        }
                      />
                    </li>
                  ))
                : ""}
            </>
          )}

          {starredList.length === 0 && regularList.length === 0 && !loading && (
            <li className="text-center text-gray-500 py-8">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-lg font-medium">No characters found</p>
                <p className="text-sm">{getNoResultsMessage(filters)}</p>
              </div>
            </li>
          )}
          {loading && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-500 text-sm">
                  Loading Characters...
                </span>
              </div>
            </div>
          )}
          { starredList.length === 0 && regularList.length === 0 || hasMoreCharacters.hasMore && (
            <button
              onClick={() => handleShowMore()}
              disabled={loading}
              className=" w-full !mt-6 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Show More
            </button>
          )}
        </ul>
      </nav>
    </aside>
  );
};

const getNoResultsMessage = (filters: FilterState): string => {
  const hasSearchTerm = filters.searchTerm.trim() !== "";
  const hasSpeciesFilter = filters.species !== "all";
  const hasTypeFilter = filters.characterType !== "all";

  if (hasSearchTerm && hasSpeciesFilter && hasTypeFilter) {
    return `No ${filters.characterType} ${filters.species} characters found matching "${filters.searchTerm}"`;
  } else if (hasSearchTerm && hasSpeciesFilter) {
    return `No ${filters.species} characters found matching "${filters.searchTerm}"`;
  } else if (hasSearchTerm && hasTypeFilter) {
    return `No ${filters.characterType} characters found matching "${filters.searchTerm}"`;
  } else if (hasSearchTerm) {
    return `No characters found matching "${filters.searchTerm}"`;
  } else if (hasSpeciesFilter && hasTypeFilter) {
    return `No ${filters.characterType} ${filters.species} characters available`;
  } else if (hasSpeciesFilter) {
    return `No ${filters.species} characters available`;
  } else if (hasTypeFilter) {
    return `No ${filters.characterType} characters available`;
  } else {
    return "No characters available";
  }
};

export default Component;
