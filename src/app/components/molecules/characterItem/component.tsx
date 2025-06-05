import React from 'react';
import { Character } from '@/app/types/character';

interface CharacterItemProps {
  character: Character;
  handleCharacterSelect: (character: Character) => void;
}

const Component = ({character, handleCharacterSelect}:CharacterItemProps) => {
  return (
    <div
      key={character.id}
      className="flex gap-[1rem] p-5 items-center rounded-lg hover:bg-primary-100 transition-colors duration-200"
      onClick={() => handleCharacterSelect(character)}
    >
      <img
        src={character.image}
        alt={character.name}
        className="w-8 h-8 rounded-full inline-block"
        loading="lazy"
      />
      <div className="select-none w-full">
        <h6 className="text-gray-900 text-baseleading-6 font-semibold ">{character.name}</h6>
        <p className="text-gray-500 text-base leading-6 font-normal">
          {character.species}
        </p>
      </div>
      <button>a</button>
    </div>
  );
};

export default Component;
