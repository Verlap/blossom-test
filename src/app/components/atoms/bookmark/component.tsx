import { Heart } from "lucide-react";

interface BookmarkProps {
  isStarred?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: number;
  className?: string;
}

const Component = ({ 
  isStarred = false, 
  onClick, 
  size = 20,
  className = "" 
}: BookmarkProps) => {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        p-2 rounded-full
        transition-all duration-200 ease-in-out
        hover:scale-110 
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
        ${isStarred 
          ? "bg-white text-secondary-600 hover:bg-green-50" 
          : "text-slate-300 hover:text-green-400 hover:bg-slate-400/20"
        }
        ${className}
      `}
      aria-label={isStarred ? 'Remover de favoritos' : 'Agregar a favoritos'}
      title={isStarred ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        size={size}
        fill={isStarred ? "#53C629" : "transparent"}
        className={`
          transition-all duration-200 ease-in-out
          ${isStarred ? 'drop-shadow-sm' : ''}
        `}
      />
    </button>
  );
};

export default Component;