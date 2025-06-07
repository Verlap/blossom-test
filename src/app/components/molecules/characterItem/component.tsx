import React from "react";
import BookMark from "@/app/components/atoms/bookmark/component";

import { useCharacters } from "@/app/contexts/characterContext";
import { Character } from "@/app/types/character";

interface CharacterItemProps {
  character: Character;
  handleCharacterSelect: (character: Character) => void;
}

const Component = ({
  character,
  handleCharacterSelect,
}: CharacterItemProps) => {
  const { state, dispatch } = useCharacters();
  const { starredCharacters } = state;

  const isStarred = starredCharacters.some(
    (starredChar) => starredChar.id === character.id
  );

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "TOGGLE_STARRED", payload: character.id });
  };

  const handleItemClick = () => {
    handleCharacterSelect(character);
  };

  return (
    <div
      className={"flex gap-[1rem] p-5 items-center rounded-lg hover:bg-primary-100 transition-colors duration-200 cursor-pointer"}
      onClick={handleItemClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleItemClick();
        }
      }}
      aria-label={`See details of ${character.name}`}
    >
      <div className="flex-shrink-0">
        <img
          src={character.image}
          alt={character.name}
          className={`w-8 h-8 rounded-full object-cover transition-all duration-200`}
          loading="lazy"
        />
      </div>
      <div className="select-none flex-1 min-w-0">
        <h6
          className={`text-base leading-6 font-semibold truncate text-gray-900`}
        >
          {character.name}
        </h6>
        <p className={`text-base leading-6 font-normal truncate text-gray-500`}>
          {character.species}
        </p>
      </div>
      <div className="flex-shrink-0">
        <BookMark
          onClick={handleBookmarkClick}
          isStarred={isStarred}
          size={20}
          className="transition-transform hover:scale-110"
        />
      </div>
    </div>
  );
};

export default Component;
