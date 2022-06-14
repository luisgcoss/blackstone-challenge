import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import ListItem from '.';

test('click every button call event once', () => {
  const mockHandler = jest.fn();

  const component = render(
    <ListItem
      title="hi"
      endDate="hi"
      onDelete={mockHandler}
      handleEditing={mockHandler}
      setDone={mockHandler}
      isSelected={false}
      isOnSelectMode={false}
      toggleSelect={mockHandler}
    />
  );

  const buttons = component.getAllByRole('button');
  buttons.forEach((button) => fireEvent.click(button));

  expect(mockHandler).toHaveBeenCalledTimes(buttons.length);
});
