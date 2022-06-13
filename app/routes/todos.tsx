import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { FaCheckSquare, FaPenSquare } from 'react-icons/fa';
import { useTransition } from '@remix-run/react';
import { BsFillPlusSquareFill, BsXSquareFill } from 'react-icons/bs';

import Input from '~/components/Input';
import type { RootState } from '~/redux';
import ListItem from '~/components/ListItem';
import DoneListItem from '~/components/DoneListItem';
import { useDispatch, useSelector } from 'react-redux';
import { claearSelection, toggleItem } from '~/redux/slices/todosSlice';
import Button from '~/components/Button';

const mainFormInitialValues = {
  title: '',
  endDate: '',
};

const data = [
  {
    id: 1,
    isSelected: false,
    title:
      ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, aliquid.',
    endDate: '23/30/33',
  },
  {
    id: 2,
    isSelected: true,
    title:
      ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, aliquid.',
    endDate: '23/30/33',
  },
  {
    id: 3,
    isSelected: false,
    title:
      ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, aliquid.',
    endDate: '23/30/33',
  },
  {
    id: 4,
    isSelected: true,
    title:
      ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, aliquid.',
    endDate: '23/30/33',
  },
];

const mainFormValidationSchema = Yup.object({
  title: Yup.string().required('A title is required'),
  endDate: Yup.date()
    .required('An end date is required')
    .min(new Date(Date.now() - 86400000), 'The end date have to be in future'),
});

export default function Todos() {
  const transition = useTransition();
  const [isOnEdit, setIsOnEdit] = useState(false);
  const dispatch = useDispatch();

  const selectedItems = useSelector(
    (state: RootState) => state.todosSlice.selectedItems
  );

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const mainForm = useFormik({
    initialValues: mainFormInitialValues,
    validationSchema: mainFormValidationSchema,
    validateOnMount: true,
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col bg-black rounded text-white p-4 shadow-md shadow-yellow-500 h-96 w-full md:max-w-[600px] mb-4">
        <h1 className="font-bold text-2xl border-b border-yellow-500 mb-2">
          Todo List
        </h1>
        <div className="mb-2">
          {!(selectedItems.length >= 1) ? (
            <form onSubmit={mainForm.handleSubmit}>
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Buy a coffe"
                  className="mr-2 flex-1 w-full"
                  {...mainForm.getFieldProps('title')}
                />
                <Input
                  type="date"
                  className="mr-2 text-xs w-20 md:text-md md:w-auto"
                  {...mainForm.getFieldProps('endDate')}
                />
                <button
                  type="submit"
                  className="flex flex-col text-yellow-500 disabled:tex-red-800"
                  disabled={
                    !mainForm.isValid ||
                    transition.state === 'submitting' ||
                    !mainForm.dirty
                  }
                >
                  {isOnEdit ? (
                    <FaPenSquare
                      size="1.5rem"
                      className={`${
                        !mainForm.isValid ||
                        transition.state === 'submitting' ||
                        !mainForm.dirty
                          ? 'text-yellow-700'
                          : 'text-yellow-500'
                      }`}
                    />
                  ) : (
                    <BsFillPlusSquareFill
                      size="1.5rem"
                      className={`${
                        !mainForm.isValid ||
                        transition.state === 'submitting' ||
                        !mainForm.dirty
                          ? 'text-yellow-700'
                          : 'text-yellow-500'
                      }`}
                    />
                  )}
                </button>
              </div>
              {!mainForm.isValid && (
                <div className="text-xs text-red-500">
                  {Object.entries(mainForm.errors)
                    .filter((field) =>
                      Object.keys(mainForm.touched).some(
                        (key) => key === field[0]
                      )
                    )
                    .map((error, i) => (
                      <p key={i} role="alert">
                        {error[1]}
                      </p>
                    ))}
                </div>
              )}
            </form>
          ) : (
            <div className="flex items-center justify-between h-6">
              <Button onClick={() => dispatch(claearSelection())}>
                Cancel
              </Button>
              <div className="flex items-center">
                <button
                  // onClick={console.log('tod')}
                  disabled={transition.state === 'submitting'}
                  className="mr-2"
                >
                  <FaCheckSquare size="1.5rem" className="text-green-600" />
                </button>
                <button
                  // onClick={onDelete}
                  disabled={transition.state === 'submitting'}
                >
                  <BsXSquareFill size="1.3rem" className="text-red-800" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-600 rounded p-2 h-full overflow-y-auto">
          {data.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              endDate={item.endDate}
              isSelected={selectedItems.includes(item.id)}
              toggleSelect={() => dispatch(toggleItem(item.id))}
              isOnSelectMode={selectedItems.length >= 1}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col bg-black rounded text-white p-4 shadow-md shadow-yellow-500 h-96 w-full md:max-w-[600px]">
        <h1 className="font-bold text-2xl border-b border-yellow-500 mb-2">
          Done
        </h1>

        <div className="bg-gray-600 rounded p-2 h-full overflow-y-auto">
          {data.map((item) => (
            <DoneListItem
              key={item.id}
              title={item.title}
              endDate={item.endDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
