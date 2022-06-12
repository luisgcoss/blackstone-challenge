import { useTransition } from '@remix-run/react';
import { BsArrowCounterclockwise, BsXSquareFill } from 'react-icons/bs';
import { FaCheckSquare } from 'react-icons/fa';
import { ImRadioChecked, ImRadioUnchecked } from 'react-icons/im';

interface ListItemProps {
  title: string;
  endDate: string;
  setUndone: () => {};
  onDelete: () => {};
}

function ListItem(props: ListItemProps) {
  const transition = useTransition();

  const { title, endDate, onDelete, setUndone } = props;

  return (
    <div className="flex flex-col items-center rounded bg-black mb-2 p-1 bg-yellow-500">
      <div className="text-black">{title}</div>
      <div className="flex w-full justify-end">
        <div className="text-yellow-500">{endDate}</div>
        <div className="flex gap-1 items-center">
          <button
            onClick={setUndone}
            disabled={transition.state === 'submitting'}
            className="bg-yellow-600 rounded w-6 h-6 flex items-center justify-center"
          >
            <BsArrowCounterclockwise className="text-black" />
          </button>
          <button
            onClick={onDelete}
            disabled={transition.state === 'submitting'}
          >
            <BsXSquareFill size="1.5rem" className="text-red-800" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
