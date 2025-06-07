import React from "react";
import { useCharacters } from "@/app/contexts/characterContext";
import { Character } from "@/app/types/character";
import BookMark from "@/app/components/atoms/bookmark/component";

const Component = (selectedCharacter: Character) => {
  const { state ,dispatch } = useCharacters();
  const { id, name, image } = selectedCharacter;
  const { starredCharacters } = state;

  const handleBookmarkClick = (id: number) => {
    dispatch({ type: "TOGGLE_STARRED", payload: id });
  };

    const isStarred = starredCharacters.some(
    (starredChar) => starredChar.id === id
  );

  return (
    <div className="pb-2 p-4">
      <div className="relative w-[75px] h-[75px] inline-block mb-2">
        <BookMark
          className="absolute bottom-0 -right-2"
          onClick={() => handleBookmarkClick(id)}
          isStarred={isStarred}
          size={24}
        />
        <img
          src={image}
          alt={name}
          className="w-[75px] h-[75px] rounded-full inline-block mb-2"
        />
      </div>
      <h1 className="text-2xl leading-8 font-bold">{name}</h1>
    </div>
  );
};

export default Component;
