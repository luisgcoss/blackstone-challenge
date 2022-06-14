import * as Yup from 'yup';
import { useFormik } from 'formik';
import { redirect } from '@remix-run/node';
import { FaUserCircle } from 'react-icons/fa';
import { useActionData, useSubmit } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';

import Input from '~/components/Input';
import Button from '~/components/Button';
import { parseDataToSubmit } from '~/utils/parseDataToSubmit';
import { apiCall, getUser, storage } from '~/utils/api';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Field requiered')
    .min(6, 'User name must have at least six characters'),
  password: Yup.string()
    .required('Field requiered')
    .min(6, 'Password must have at least six characters'),
});

export const loader: LoaderFunction = async ({ request }) => {
  const { isSessionActive } = await getUser(request);

  if (isSessionActive) {
    return redirect('/todos');
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const data = JSON.parse(
    (await request.formData()).get('data')?.toString() ?? ''
  );

  const { route, ...rest } = data;

  try {
    const req = await apiCall(route, 'post', rest);

    if (req.status !== 201) {
      return {
        formError:
          (await req.json().then((data) => data.message)) ||
          'Password or username incorrects',
      };
    } else {
      const { accessToken, userId } = await req.json();

      const session = await storage.getSession();
      session.set('userId', userId);
      session.set('token', accessToken);

      return redirect('/todos', {
        headers: {
          'Set-Cookie': await storage.commitSession(session),
        },
      });
    }
  } catch (error) {
    return {
      formError:
        error instanceof Error
          ? error.message
          : 'Something unexpected just happen',
    };
  }
};

export default function Index() {
  const actionData = useActionData();
  const submit = useSubmit();

  const handleFormSubmit = (values: {
    username: string;
    password: string;
    route: string;
  }) => submit(parseDataToSubmit(values), { method: 'post' });

  const initialValues = {
    username: actionData?.username || '',
    password: actionData?.password || '',
    route: actionData?.route || 'auth/login',
  };

  const form = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema,
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col rounded p-4 shadow-xl h-60 w-full md:max-w-[400px] mb-4">
        <div className="flex justify-between items-center font-bold text-2xl border-b-2 border-blue-500 mb-2">
          <h1 className="font-bold text-2xl">Log In</h1>
          <FaUserCircle size={35} className="text-blue-500 mb-1" />
        </div>
        <form className="flex flex-col flex-1" onSubmit={form.handleSubmit}>
          <fieldset className="flex justify-evenly mb-4">
            <legend className="sr-only">Login or Register?</legend>
            <label className="flex items-center">
              <Input
                type="radio"
                defaultChecked={form.values.route === 'auth/login'}
                {...form.getFieldProps('route')}
                value="auth/login"
              />{' '}
              Login
            </label>
            <label className="flex items-center">
              <Input
                type="radio"
                defaultChecked={form.values.route === 'user'}
                {...form.getFieldProps('route')}
                value="user"
              />{' '}
              Register
            </label>
          </fieldset>
          {actionData?.formError ? (
            <p className="text-xs text-red-500" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col w-full">
              <Input
                type="text"
                placeholder="Username"
                className="mt-2"
                {...form.getFieldProps('username')}
              />
              {form.touched.username && form.errors.username ? (
                <div className="text-xs text-red-500">
                  {form.errors.username}
                </div>
              ) : null}
              <Input
                type="password"
                placeholder="Password"
                className="mt-2"
                {...form.getFieldProps('password')}
              />
              {form.touched.password && form.errors.password ? (
                <div className="text-xs text-red-500">
                  {form.errors.password}
                </div>
              ) : null}
            </div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
