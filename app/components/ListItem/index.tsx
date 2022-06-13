import { BsXSquareFill } from 'react-icons/bs';
import { useTransition } from '@remix-run/react';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FaCheckSquare, FaPenSquare } from 'react-icons/fa';
import { ImRadioChecked, ImRadioUnchecked } from 'react-icons/im';

interface ListItemProps {
  title: string;
  endDate: string;
  isOnEdit: boolean;
  isSelected: boolean;
  isOnSelectMode: boolean;
  toggleSelect: () => PayloadAction<number>;
  handleEditing: () => {};
  setDone: () => {};
  onDelete: () => {};
}

function ListItem(props: ListItemProps) {
  const transition = useTransition();

  const {
    title,
    endDate,
    setDone,
    onDelete,
    isOnEdit,
    isSelected,
    toggleSelect,
    handleEditing,
    isOnSelectMode,
  } = props;

  return (
    <div className="flex flex-col items-center rounded bg-black mb-2 p-1">
      <div className="flex">
        <div>{title}</div>
        <button onClick={toggleSelect} className="mr-1 h-fit">
          {isSelected ? (
            <ImRadioChecked size="1.5rem" className="text-yellow-500" />
          ) : (
            <ImRadioUnchecked size="1.5rem" className="text-yellow-500" />
          )}
        </button>
      </div>
      <div className="flex w-full justify-between">
        <div className="text-yellow-500">{endDate}</div>
        {!isOnSelectMode && (
          <div className="flex gap-1 items-center">
            <button
              onClick={handleEditing}
              disabled={transition.state === 'submitting'}
            >
              <FaPenSquare size="1.5rem" className="text-yellow-800" />
            </button>
            <button
              onClick={setDone}
              disabled={transition.state === 'submitting'}
            >
              <FaCheckSquare size="1.5rem" className="text-green-600" />
            </button>
            <button
              onClick={onDelete}
              disabled={transition.state === 'submitting'}
            >
              <BsXSquareFill size="1.3rem" className="text-red-800" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListItem;
