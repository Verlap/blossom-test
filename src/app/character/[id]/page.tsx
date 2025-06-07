import characterService from "@/app/services/characterService";
import { CharacterResponse } from "@/app/types/character";
import CharacterView from "./view"

export default function CharacterPage(){
 return <CharacterView />
}

export async function generateStaticParams() {

  const response:CharacterResponse = await characterService.getCharacters(1);
  const count = response.info.count
  
  let pages = []

  for(let i = 1; i <= count; i++){
    pages.push({
      id: `${i}`
    })
  }

  return pages;
}
