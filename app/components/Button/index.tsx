import React from 'react';

type Props = React.ComponentProps<'button'>;

const Button = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <button
      className={`rounded bg-yellow-500 text-black px-2 font-bold ${className}`}
      {...rest}
    />
  );
};

export default Button;
