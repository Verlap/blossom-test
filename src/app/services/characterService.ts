
/* fetch all characters */
const getCharacters = async (page: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/character/?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  return response.json();
}

/* fetch characters by id */
const getCharactersById = async (id: string) => {
  console.log(`Fetching character with id: ${id}`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/character/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch character with id ${id}`);
  }
  return response.json();
}

/* export all functions */
const characterService = {
  getCharacters,
  getCharactersById,
};

export default characterService;