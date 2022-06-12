import { useTransition } from '@remix-run/react';
import { BsXSquareFill } from 'react-icons/bs';
import { FaCheckSquare, FaPenSquare } from 'react-icons/fa';
import { ImRadioChecked, ImRadioUnchecked } from 'react-icons/im';

interface ListItemProps {
  title: string;
  endDate: string;
  isSelected: boolean;
  handleEditing: () => {};
  toggleSelect: () => {};
  setDone: () => {};
  onDelete: () => {};
}

function ListItem(props: ListItemProps) {
  const transition = useTransition();

  const {
    title,
    endDate,
    toggleSelect,
    setDone,
    onDelete,
    isSelected,
    handleEditing,
  } = props;

  return (
    <div
      className={`flex flex-col items-center rounded bg-black mb-2 p-1 ${
        isSelected && 'border-l-2 border-yellow-500'
      }`}
    >
      <div className="flex">
        <button onClick={toggleSelect} className="mr-1 h-fit">
          {isSelected ? (
            <ImRadioChecked size="1.5rem" className="text-yellow-500" />
          ) : (
            <ImRadioUnchecked size="1.5rem" className="text-yellow-500" />
          )}
        </button>
        <div className="">{title}</div>
      </div>
      <div className="flex w-full justify-end">
        <div className="text-yellow-500">{endDate}</div>
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
      </div>
    </div>
  );
}

export default ListItem;
