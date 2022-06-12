import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { FaPenSquare } from 'react-icons/fa';
import { useTransition } from '@remix-run/react';
import { BsFillPlusSquareFill } from 'react-icons/bs';

import Input from '~/components/Input';
import ListItem from '~/components/ListItem';
import DoneListItem from '~/components/DoneListItem';

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

  const handleFormSubmit = (values) => {};

  const mainForm = useFormik({
    initialValues: mainFormInitialValues,
    validationSchema: mainFormValidationSchema,
    validateOnMount: true,
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col bg-black rounded text-white p-4 shadow-md shadow-yellow-500 h-96 md:max-w-[600px] mb-4">
        <h1 className="font-bold text-2xl border-b border-yellow-500 mb-2">
          Todo List
        </h1>
        <div className="mb-2">
          <form onSubmit={mainForm.handleSubmit}>
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Buy a coffe"
                className="mr-2 w-32 md:w-full"
                {...mainForm.getFieldProps('title')}
              />
              <Input
                type="date"
                className="mr-2 text-xs md:text-md"
                {...mainForm.getFieldProps('endDate')}
              />
              <button
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
        </div>
        <div className="bg-gray-600 rounded p-2 h-full overflow-y-auto">
          {data.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              endDate={item.endDate}
              isSelected={item.isSelected}
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
              isSelected={item.isSelected}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
