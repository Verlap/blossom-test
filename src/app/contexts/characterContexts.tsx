"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";

import { Character } from "@/app/types/character";

interface CharacterState {
  characters: Character[];
  starredCharacters: Character[];
  selectedCharacter: Character | null;
  loading: boolean;
  error: string | null;
}

type CharacterAction =
  | { type: "SET_CHARACTERS"; payload: Character[] }
  | { type: "SET_SELECTED_CHARACTER"; payload: Character | null }
  | { type: "TOGGLE_STARRED"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: CharacterState = {
  characters: [],
  starredCharacters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
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
      const updatedStarredCharacters = isStarred
        ? state.starredCharacters.filter(
            (character) => character.id !== characterId
          )
        : [
            ...state.starredCharacters,
            state.characters.find((character) => character.id === characterId)!,
          ];
      return {
        ...state,
        starredCharacters: updatedStarredCharacters,
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

    default:
      return state;
  }
}

const CharacterContext = createContext<{
  state: CharacterState;
  dispatch: React.Dispatch<CharacterAction>;
} | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);
  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters(){
  const context = useContext(CharacterContext);
   if (!context) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  return context;
}