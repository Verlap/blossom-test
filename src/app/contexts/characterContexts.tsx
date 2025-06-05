"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
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
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_STARRED_FROM_STORAGE"; payload: Character[] };

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
      
      let updatedStarredCharacters: Character[];
      
      if (isStarred) {
        // Remover de favoritos
        updatedStarredCharacters = state.starredCharacters.filter(
          (character) => character.id !== characterId // ⚠️ Corregido: faltaba "return"
        );
      } else {
        // Agregar a favoritos
        const characterToAdd = state.characters.find(
          (character) => character.id === characterId
        );
        if (characterToAdd) {
          updatedStarredCharacters = [...state.starredCharacters, characterToAdd];
        } else {
          updatedStarredCharacters = state.starredCharacters;
        }
      }

      // Guardar en localStorage
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

    default:
      return state;
  }
}

// Contexto con funciones helper
interface CharacterContextType {
  state: CharacterState;
  dispatch: React.Dispatch<CharacterAction>;
  // Funciones helper para facilitar el uso
  toggleStarred: (characterId: number) => void;
  isStarred: (characterId: number) => boolean;
  fetchCharacters: () => Promise<void>;
  fetchCharacterById: (id: number) => Promise<void>;
  getStarredCharacters: () => Character[];
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  // Cargar favoritos del localStorage al inicializar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("starredCharacters");
      if (saved) {
        const starredCharacters: Character[] = JSON.parse(saved);
        dispatch({ type: "LOAD_STARRED_FROM_STORAGE", payload: starredCharacters });
      }
    } catch (error) {
      console.error("Error loading starred characters from localStorage:", error);
    }
  }, []);

  // Funciones helper
  const toggleStarred = (characterId: number) => {
    dispatch({ type: "TOGGLE_STARRED", payload: characterId });
  };

  const isStarred = (characterId: number): boolean => {
    return state.starredCharacters.some(character => character.id === characterId);
  };

  const getStarredCharacters = (): Character[] => {
    return state.starredCharacters;
  };

  const fetchCharacters = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      let allCharacters: Character[] = [];
      let nextPage = 'https://rickandmortyapi.com/api/character';
      
      while (nextPage) {
        const response = await fetch(nextPage);
        if (!response.ok) {
          throw new Error('Error al cargar personajes');
        }
        
        const data = await response.json();
        allCharacters = [...allCharacters, ...data.results];
        nextPage = data.info.next;
      }
      
      dispatch({ type: "SET_CHARACTERS", payload: allCharacters });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const fetchCharacterById = async (id: number): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar el personaje');
      }
      
      const character = await response.json();
      dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
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
    fetchCharacterById,
    getStarredCharacters,
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