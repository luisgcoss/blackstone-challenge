import { BsXSquareFill } from 'react-icons/bs';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FaCheckSquare, FaPenSquare } from 'react-icons/fa';
import { ImRadioChecked, ImRadioUnchecked } from 'react-icons/im';

interface ListItemProps {
  title: string;
  endDate: string;
  isSelected: boolean;
  isOnSelectMode: boolean;
  toggleSelect: () => PayloadAction<number>;
  handleEditing: () => void;
  setDone: () => void;
  onDelete: () => void;
}

function ListItem(props: ListItemProps) {
  const {
    title,
    endDate,
    setDone,
    onDelete,
    isSelected,
    toggleSelect,
    handleEditing,
    isOnSelectMode,
  } = props;

  return (
    <div className="flex flex-col items-center rounded bg-gray-300 mb-2 p-1">
      <div className="flex justify-between w-full">
        <div className="break-words w-[90%]">{title}</div>
        <button onClick={toggleSelect} className="mr-1 h-fit">
          {isSelected ? (
            <ImRadioChecked size="1.5rem" className="text-blue-500" />
          ) : (
            <ImRadioUnchecked size="1.5rem" className="text-blue-500" />
          )}
        </button>
      </div>
      <div className="flex w-full justify-between">
        <div className="text-blue-500 font-bold">{endDate}</div>
        {!isOnSelectMode && (
          <div className="flex gap-1 items-center">
            <button onClick={handleEditing}>
              <FaPenSquare size="1.5rem" className="text-blue-500" />
            </button>
            <button onClick={setDone}>
              <FaCheckSquare size="1.5rem" className="text-green-500" />
            </button>
            <button onClick={onDelete}>
              <BsXSquareFill size="1.3rem" className="text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListItem;
