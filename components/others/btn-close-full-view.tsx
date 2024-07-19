import { IoCloseOutline } from "react-icons/io5";

interface Props {
  onClick?: () => void;
}

export const ButtonCloseFullView = ({ onClick }: Props) => {
  return (
    <div
      className="absolute top-6 right-6 size-11 rounded-full text-neutral-500 bg-neutral-800/75 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
      onClick={onClick}
    >
      <IoCloseOutline className="size-6" />
    </div>
  );
};
