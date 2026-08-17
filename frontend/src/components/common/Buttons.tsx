// import React from "react";

interface PrimaryButtonProps {
  name: string;
  onClick?: () => void;
}
export const PrimaryButton = ({
  name,
  onClick = () => {},
}: PrimaryButtonProps) => {
  const onButtonClick = () => {
    onClick();
  };
  return (
    <button
      className="bg-main-color text-start text-white px-4 py-2 rounded hover:bg-second-color h-10"
      onClick={onButtonClick}
    >
      {name}
    </button>
  );
};
