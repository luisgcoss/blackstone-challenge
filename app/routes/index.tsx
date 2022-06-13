import * as Yup from 'yup';
import { Field, useFormik } from 'formik';
import Input from '~/components/Input';
import { FaUserCircle } from 'react-icons/fa';
import Button from '~/components/Button';
import { useActionData } from '@remix-run/react';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Field requiered')
    .min(6, 'User name must have at least six characters'),
  password: Yup.string()
    .required('Field requiered')
    .min(6, 'Password must have at least six characters'),
});

export default function Index() {
  const actionData = useActionData();

  const handleFormSubmit = (values) => {
    console.log(values);
  };
  const form = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema,
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col bg-black rounded text-white p-4 shadow-md shadow-yellow-500 h-60 w-full md:max-w-[400px] mb-4">
        <div className="flex justify-between items-center font-bold text-2xl border-b border-yellow-500 mb-2">
          <h1 className="font-bold text-2xl">Log In</h1>
          <FaUserCircle size={35} className="text-yellow-500 mb-1" />
        </div>
        <form className="flex flex-col flex-1" onSubmit={form.handleSubmit}>
          <fieldset className="flex justify-between mb-4">
            <legend className="sr-only">Login or Register?</legend>
            <label className="flex items-center">
              <Input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label className="flex items-center">
              <Input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              Register
            </label>
          </fieldset>
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col w-full">
              <Input
                type="text"
                placeholder="Username"
                className="mb-2"
                {...form.getFieldProps('username')}
              />
              <Input
                type="password"
                placeholder="Password"
                className="mb-2"
                {...form.getFieldProps('password')}
              />
            </div>
            <Button>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
