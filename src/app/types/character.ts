export interface Location {
  name: string;
  url: string;
}

export interface Origin {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Origin;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
  isStarred?: boolean;
}

export interface CharacterStrict {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Origin;
  location: Location;
  image: string; 
  episode: string[]; 
  url: string; 
  created: string;
}

export interface CharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export interface HasMoreCharacters{
  nextPage: number;
  hasMore: boolean;
  count: number;
}