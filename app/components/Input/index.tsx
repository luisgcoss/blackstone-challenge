import React from 'react';

type Props = React.ComponentProps<'input'>;

const Input = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <input
      className={`rounded bg-gray-300 px-2 h-6 accent-blue-500 ${className}`}
      {...rest}
    />
  );
};

export default Input;
