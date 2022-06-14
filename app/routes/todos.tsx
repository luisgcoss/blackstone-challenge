import {
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from '@remix-run/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import type { ReactElement } from 'react';
import { redirect } from '@remix-run/node';
import { FaCheckSquare, FaPenSquare } from 'react-icons/fa';
import { BsFillPlusSquareFill, BsXSquareFill } from 'react-icons/bs';

import Input from '~/components/Input';
import type { RootState } from '~/redux';
import Button from '~/components/Button';
import ListItem from '~/components/ListItem';
import DoneListItem from '~/components/DoneListItem';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, getUser, storage } from '~/utils/api';
import { parseDataToSubmit } from '~/utils/parseDataToSubmit';
import { claearSelection, toggleItem } from '~/redux/slices/todosSlice';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';

type Todo = {
  id: number;
  title: string;
  isMarkedAsDone: boolean;
  endDate: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { userId, isSessionActive, jwt } = await getUser(request);

  if (!isSessionActive) {
    return redirect('/');
  }

  return {
    data: await (
      await apiCall(`user/${userId}/todos`, 'get', null, jwt)
    ).json(),
  };
};

const formValidationSchema = Yup.object({
  title: Yup.string().required('A title is required'),
  endDate: Yup.date()
    .required('An end date is required')
    .min(new Date(Date.now() - 86400000), 'The end date have to be in future'),
});

export const action: ActionFunction = async ({ request }) => {
  const { type, id, ...rest } = JSON.parse(
    (await request.formData()).get('data')?.toString() ?? ''
  );
  try {
    const { userId, jwt } = await getUser(request);

    switch (type) {
      case 'CREATE':
        return await apiCall(`user/${userId}/todos`, 'post', rest, jwt);
      case 'DELETE':
        return await apiCall(`todo/${id}`, 'delete', null, jwt);
      case 'DELETE_MANY':
        return await apiCall(`todo`, 'delete', rest, jwt);
      case 'UPDATE':
        return await apiCall(`todo/${id}`, 'patch', rest, jwt);
      case 'UPDATE_MANY':
        return await apiCall(`todo/${id}`, 'patch', rest, jwt);
      case 'LOGOUT':
        const session = await storage.getSession(
          request?.headers.get('Cookie')
        );
        session.unset('token');
        session.unset('userId');
        return redirect('/', {
          headers: { 'Set-Cookie': await storage.commitSession(session) },
        });
    }
  } catch (error) {
    return {
      formError: 'Something unexpected just happen',
    };
  }

  return null;
};

export default function Todos() {
  const { data } = useLoaderData();
  const transition = useTransition();
  const submit = useSubmit();
  const dispatch = useDispatch();
  const actionData = useActionData();

  const selectedItems = useSelector(
    (state: RootState) => state.todosSlice.selectedItems
  );

  const handleTodoCreate = (payload: Pick<Todo, 'title' | 'endDate'>) => {
    submit(parseDataToSubmit({ ...payload, type: 'CREATE' }), {
      method: 'post',
    });
  };

  const handleTodoDelete = (id: number) =>
    submit(parseDataToSubmit({ id: id.toString(), type: 'DELETE' }), {
      method: 'delete',
    });

  const handleTodoDeleteMany = (list: number[]) => {
    dispatch(claearSelection());
    submit(parseDataToSubmit({ todos: list, type: 'DELETE_MANY' }), {
      method: 'delete',
    });
  };

  const handleTodoUpdate = (payload: Partial<Todo>) =>
    submit(parseDataToSubmit({ ...payload, type: 'UPDATE' }), {
      method: 'patch',
    });

  const handleTodoSetDoneMany = (list: number[]) =>
    submit(parseDataToSubmit({ todos: list, type: 'SET_DONE_MANY' }), {
      method: 'patch',
    });

  const handleFormSubmit = (values: Pick<Todo, 'endDate' | 'id' | 'title'>) => {
    form.resetForm();

    if (values.id) {
      form.setFieldValue('id', 0);
      handleTodoUpdate(values);
    } else {
      handleTodoCreate(values);
    }
  };

  const handleEdit = (payload: Partial<Todo>) => {
    form.setFieldValue('id', payload.id);
    form.setFieldValue('title', payload.title);
    form.setFieldValue('endDate', payload.endDate);
  };

  const formInitialValues = {
    title: '',
    endDate: '',
    id: 0,
  };

  const form = useFormik({
    initialValues: formInitialValues,
    validationSchema: formValidationSchema,
    validateOnMount: true,
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col rounded bg-gray-100 p-4 shadow-xl max-h-96 w-full md:max-w-[600px] mb-4">
        <div className="flex justify-between items-center border-b-2 border-blue-500 mb-2">
          <h1 className="font-bold text-2xl ">Todo List</h1>
          <Button
            className="h-fit"
            onClick={() =>
              submit(parseDataToSubmit({ type: 'LOGOUT' }), { method: 'post' })
            }
          >
            LogOut
          </Button>
        </div>
        <div className="mb-2">
          {!(selectedItems.length >= 1) ? (
            <form onSubmit={form.handleSubmit}>
              {actionData?.formError ? (
                <p className="text-xs text-red-500" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Buy a coffe"
                  className="mr-2 flex-1 w-full"
                  {...form.getFieldProps('title')}
                />
                <Input
                  type="date"
                  className="mr-2 text-xs w-20 md:text-md md:w-auto"
                  onChange={(e) => {
                    form.setFieldValue(
                      'endDate',
                      e.target.valueAsDate?.toISOString()
                    );
                  }}
                  value={form.values.endDate.substring(0, 10)}
                />
                <button
                  type="submit"
                  className="flex flex-col text-blue-500 disabled:tex-red-800"
                  disabled={
                    !form.isValid ||
                    transition.state === 'submitting' ||
                    !form.dirty
                  }
                >
                  {form.values.id ? (
                    <FaPenSquare
                      size="1.5rem"
                      className={`${
                        !form.isValid ||
                        transition.state === 'submitting' ||
                        !form.dirty
                          ? 'text-gray-300'
                          : 'text-blue-500'
                      }`}
                    />
                  ) : (
                    <BsFillPlusSquareFill
                      size="1.5rem"
                      className={`${
                        !form.isValid ||
                        transition.state === 'submitting' ||
                        !form.dirty
                          ? 'text-gray-300'
                          : 'text-blue-500'
                      }`}
                    />
                  )}
                </button>
              </div>
              {!form.isValid && (
                <div className="text-xs text-red-500">
                  {Object.entries(form.errors)
                    .filter((field) =>
                      Object.keys(form.touched).some((key) => key === field[0])
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
                  onClick={() => handleTodoSetDoneMany(selectedItems)}
                  disabled={transition.state === 'submitting'}
                  className="mr-2"
                >
                  <FaCheckSquare size="1.5rem" className="text-green-600" />
                </button>
                <button
                  onClick={() => handleTodoDeleteMany(selectedItems)}
                  disabled={transition.state === 'submitting'}
                >
                  <BsXSquareFill size="1.3rem" className="text-red-800" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-blue-300 rounded p-2 h-full overflow-y-auto">
          {data?.find((todo: Todo) => !todo.isMarkedAsDone) ? (
            data.reduce((prv: ReactElement[], crr: Todo) => {
              if (!crr.isMarkedAsDone)
                return [
                  <ListItem
                    key={crr.id}
                    title={crr.title}
                    endDate={crr.endDate.substring(0, 10)}
                    onDelete={() => handleTodoDelete(crr.id)}
                    setDone={() =>
                      handleTodoUpdate({ id: crr.id, isMarkedAsDone: true })
                    }
                    isSelected={selectedItems.includes(crr.id)}
                    toggleSelect={() => dispatch(toggleItem(crr.id))}
                    isOnSelectMode={selectedItems.length >= 1}
                    handleEditing={() =>
                      handleEdit({
                        id: crr.id,
                        title: crr.title,
                        endDate: crr.endDate,
                      })
                    }
                  />,
                  ...prv,
                ];
              return prv;
            }, [])
          ) : (
            <p>Your todos will appear here</p>
          )}
        </div>
      </div>
      <div className="flex flex-col rounded p-4 shadow-xl max-h-96 w-full md:max-w-[600px]">
        <h1 className="font-bold text-2xl border-b-2 border-blue-500 mb-2">
          Done
        </h1>
        <div className="bg-blue-300 rounded p-2 h-full overflow-y-auto">
          {!data?.find((todo: Todo) => todo.isMarkedAsDone) ? (
            <p>Your done todos will appear here</p>
          ) : (
            data.reduce((prv: ReactElement[], crr: Todo) => {
              if (crr.isMarkedAsDone)
                return [
                  <DoneListItem
                    key={crr.id}
                    title={crr.title}
                    endDate={crr.endDate.substring(0, 10)}
                    onDelete={() => handleTodoDelete(crr.id)}
                    setUndone={() =>
                      handleTodoUpdate({ id: crr.id, isMarkedAsDone: false })
                    }
                  />,
                  ...prv,
                ];
              return prv;
            }, [])
          )}
        </div>
      </div>
    </div>
  );
}
