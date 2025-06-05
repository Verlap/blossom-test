export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto h-full text-center hidden md:flex flex-col items-center justify-center ">
      <h2 className="text-xl text-gray-600 mb-4 font-montserrat">
        Welcome to Rick & Morty Character Explorer
      </h2>
      <p className="text-gray-500 mb-6">
        Select a character from the sidebar to view their details
      </p>
    </div>
  );
}