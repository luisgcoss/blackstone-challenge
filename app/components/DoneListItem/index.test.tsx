import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import DoneListItem from '.';

test('click every button call event once', () => {
  const mockHandler = jest.fn();

  const component = render(
    <DoneListItem
      title="hi"
      endDate="hi"
      onDelete={mockHandler}
      setUndone={mockHandler}
    />
  );

  component.getAllByRole('button').forEach((button) => fireEvent.click(button));

  expect(mockHandler).toHaveBeenCalledTimes(2);
});
