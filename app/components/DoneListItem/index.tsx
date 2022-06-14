import { BsArrowCounterclockwise, BsXSquareFill } from 'react-icons/bs';

interface ListItemProps {
  title: string;
  endDate: string;
  setUndone: () => void;
  onDelete: () => void;
}

function DoneListItem(props: ListItemProps) {
  const { title, endDate, onDelete, setUndone } = props;

  return (
    <div className="flex flex-col items-center rounded mb-2 p-1 bg-gray-300">
      <div className="w-full text-left break-words">{title}</div>
      <div className="flex w-full justify-between">
        <div className="text-blue-500 font-bold">{endDate}</div>
        <div className="flex gap-1 items-center">
          <button
            onClick={setUndone}
            className="bg-yellow-600 rounded w-5 h-5 flex items-center justify-center"
          >
            <BsArrowCounterclockwise className="text-gray-300" />
          </button>
          <button onClick={onDelete}>
            <BsXSquareFill size="1.3rem" className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoneListItem;
