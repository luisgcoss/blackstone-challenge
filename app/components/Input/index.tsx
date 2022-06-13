import React from 'react';

type Props = React.ComponentProps<'input'>;

const Input = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <input
      className={`rounded bg-gray-600 px-2 h-6 accent-yellow-500 ${className}`}
      {...rest}
    />
  );
};

export default Input;
