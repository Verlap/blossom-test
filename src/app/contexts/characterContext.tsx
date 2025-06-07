"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Character, CharacterResponse, HasMoreCharacters } from "@/app/types/character";
import characterService from "@/app/services/characterService";

export interface FilterState {
  searchTerm: string;
  characterType: "all" | "starred" | "regular";
  species: "all" | "human" | "alien";
}

interface CharacterState {
  characters: Character[];
  starredCharacters: Character[];
  selectedCharacter: Character | null;
  loading: boolean;
  hasMoreCharacters: HasMoreCharacters;
  error: string | null;
  filters: FilterState;
}

type CharacterAction =
  | { type: "SET_CHARACTERS"; payload: Character[] }
  | { type: "SET_SELECTED_CHARACTER"; payload: Character | null }
  | { type: "TOGGLE_STARRED"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_STARRED_FROM_STORAGE"; payload: Character[] }
  | { type: "SET_FILTERS"; payload: FilterState }
  | { type: "LOAD_MORE_CHARACTERS"; payload: HasMoreCharacters };

const initialState: CharacterState = {
  characters: [],
  starredCharacters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
  hasMoreCharacters: {
    nextPage: 1,
    hasMore: false,
    count: 0,
  },
  filters: {
    searchTerm: "",
    characterType: "all",
    species: "all",
  },
};

function characterReducer(
  state: CharacterState,
  action: CharacterAction
): CharacterState {
  switch (action.type) {
    case "SET_CHARACTERS":
      return {
        ...state,
        characters: action.payload,
        loading: false,
      };

    case "SET_SELECTED_CHARACTER":
      return {
        ...state,
        selectedCharacter: action.payload,
      };

    case "TOGGLE_STARRED":
      const characterId = action.payload;
      const isStarred = state.starredCharacters.some(
        (character) => character.id === characterId
      );

      let updatedStarredCharacters: Character[];

      if (isStarred) {
        updatedStarredCharacters = state.starredCharacters.filter(
          (character) => character.id !== characterId
        );
      } else {
        const characterToAdd = state.characters.find(
          (character) => character.id === characterId
        );
        if (characterToAdd) {
          updatedStarredCharacters = [
            ...state.starredCharacters,
            characterToAdd,
          ];
        } else {
          updatedStarredCharacters = state.starredCharacters;
        }
      }

      localStorage.setItem(
        "starredCharacters",
        JSON.stringify(updatedStarredCharacters)
      );

      return {
        ...state,
        starredCharacters: updatedStarredCharacters,
      };

    case "LOAD_STARRED_FROM_STORAGE":
      return {
        ...state,
        starredCharacters: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
      };

    case "LOAD_MORE_CHARACTERS":
      return {
        ...state,
        hasMoreCharacters: action.payload,
      };

    default:
      return state;
  }
}

interface CharacterContextType {
  state: CharacterState;
  dispatch: React.Dispatch<CharacterAction>;
  toggleStarred: (characterId: number) => void;
  isStarred: (characterId: number) => boolean;
  fetchCharacters: () => Promise<void>;
  fetchMoreCharacters: () => Promise<void>;
  fetchCharacterById: (id: number) => Promise<void>;
  getStarredCharacters: () => Character[];
  getFilteredCharacters: () => {
    starredList: Character[];
    regularList: Character[];
  };
  setFilters: (filters: FilterState) => void;
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("starredCharacters");
      if (saved) {
        const starredCharacters: Character[] = JSON.parse(saved);
        dispatch({
          type: "LOAD_STARRED_FROM_STORAGE",
          payload: starredCharacters,
        });
      }
    } catch (error) {
      console.error(
        "Error loading starred characters from localStorage:",
        error
      );
    }
  }, []);

  const toggleStarred = (characterId: number) => {
    dispatch({ type: "TOGGLE_STARRED", payload: characterId });
  };

  const isStarred = (characterId: number): boolean => {
    return state.starredCharacters.some(
      (character) => character.id === characterId
    );
  };

  const getStarredCharacters = (): Character[] => {
    return state.starredCharacters;
  };

  const setFilters = (filters: FilterState) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const filterCharactersBySearch = (
    characters: Character[],
    searchTerm: string
  ): Character[] => {
    if (!searchTerm.trim()) return characters;

    const searchLower = searchTerm.toLowerCase();
    return characters.filter(
      (character) =>
        character.name.toLowerCase().includes(searchLower) ||
        character.species.toLowerCase().includes(searchLower) ||
        character.status.toLowerCase().includes(searchLower)
    );
  };

  const filterCharactersBySpecies = (
    characters: Character[],
    species: "all" | "human" | "alien"
  ): Character[] => {
    if (species === "all") return characters;

    return characters.filter((character) => {
      const charSpecies = character.species.toLowerCase();
      if (species === "human") {
        return charSpecies === "human";
      } else if (species === "alien") {
        return charSpecies !== "human";
      }
      return true;
    });
  };

  const getFilteredCharacters = () => {
    const { searchTerm, characterType, species } = state.filters;

    let filteredCharacters = filterCharactersBySearch(
      state.characters,
      searchTerm
    );
    filteredCharacters = filterCharactersBySpecies(filteredCharacters, species);

    let filteredStarredCharacters = filterCharactersBySearch(
      state.starredCharacters,
      searchTerm
    );
    filteredStarredCharacters = filterCharactersBySpecies(
      filteredStarredCharacters,
      species
    );

    const starredIds = new Set(state.starredCharacters.map((char) => char.id));
    const filteredStarredIds = new Set(
      filteredStarredCharacters.map((char) => char.id)
    );

    let starredList: Character[] = [];
    let regularList: Character[] = [];

    switch (characterType) {
      case "starred":
        starredList = filteredStarredCharacters;
        regularList = [];
        break;

      case "regular":
        starredList = [];
        regularList = filteredCharacters.filter(
          (char) => !starredIds.has(char.id)
        );
        break;

      case "all":
      default:
        starredList = filteredStarredCharacters;
        regularList = filteredCharacters.filter(
          (char) => !starredIds.has(char.id)
        );
        break;
    }

    return { starredList, regularList };
  };

  const fetchCharacters = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      let page = 1;
      let hasNextPage = true;

      const response:CharacterResponse = await characterService.getCharacters(page);
      hasNextPage = response.info.next !== null;

      dispatch({ type: "SET_CHARACTERS", payload: response.results });
      if (hasNextPage) {
        const hasMoreCharacters = {
          hasMore: hasNextPage,
          nextPage: (page += 1),
          count: response.info.count,
        };
        dispatch({ type: "LOAD_MORE_CHARACTERS", payload: hasMoreCharacters });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar personajes";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const fetchMoreCharacters = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      let hasNextPage = true;
      const moreCharacters = state.hasMoreCharacters;
      if (moreCharacters.hasMore) {
        console.log(moreCharacters);
        const response:CharacterResponse = await characterService.getCharacters(
          moreCharacters.nextPage
        );
        dispatch({ type: "SET_CHARACTERS", payload: response.results });

        hasNextPage = response.info.next !== null;
        if (hasNextPage) {
          const hasMoreCharacters = {
            hasMore: hasNextPage,
            nextPage: (moreCharacters.nextPage += 1),
            count: response.info.count
          };
          dispatch({
            type: "LOAD_MORE_CHARACTERS",
            payload: hasMoreCharacters,
          });
        }
      } else {
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cargar más personajes";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchCharacterById = async (id: number): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const character = await characterService.getCharactersById(id.toString());
      dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar el personaje";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const contextValue: CharacterContextType = {
    state,
    dispatch,
    toggleStarred,
    isStarred,
    fetchCharacters,
    fetchMoreCharacters,
    fetchCharacterById,
    getStarredCharacters,
    getFilteredCharacters,
    setFilters,
  };

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacters must be used within a CharacterProvider");
  }
  return context;
}
