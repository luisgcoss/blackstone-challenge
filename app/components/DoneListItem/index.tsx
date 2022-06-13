import { useTransition } from '@remix-run/react';
import { BsArrowCounterclockwise, BsXSquareFill } from 'react-icons/bs';

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
    <div className="flex flex-col items-center rounded mb-2 p-1 bg-gray-300">
      <div>{title}</div>
      <div className="flex w-full justify-between">
        <div className="text-blue-500 font-bold">{endDate}</div>
        <div className="flex gap-1 items-center">
          <button
            onClick={setUndone}
            disabled={transition.state === 'submitting'}
            className="bg-yellow-500 rounded w-6 h-6 flex items-center justify-center"
          >
            <BsArrowCounterclockwise className="text-black" />
          </button>
          <button
            onClick={onDelete}
            disabled={transition.state === 'submitting'}
          >
            <BsXSquareFill size="1.5rem" className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
