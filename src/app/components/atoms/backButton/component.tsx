"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onBack?: () => void;
}

const Component = ({ onBack }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      className="p-2 rounded-full hover:bg-gray-400/40 transition ease-linear duration-200 text-primary-600 cursor-pointer"
      onClick={handleBack}
    >
      <ArrowLeft size={24} />
    </button>
  );
};

export default Component;
