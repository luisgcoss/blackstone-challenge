import React from 'react';

type Props = React.ComponentProps<'button'>;

const Button = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <button
      className={`rounded bg-blue-500 px-2 text-white font-bold ${className}`}
      {...rest}
    />
  );
};

export default Button;
