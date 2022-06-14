import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import Button from '.';

test('click button call event once', () => {
  const mockHandler = jest.fn();

  const component = render(<Button onClick={mockHandler}>lorem</Button>);
  const button = component.getByText('lorem');

  fireEvent.click(button);

  expect(mockHandler).toHaveBeenCalledTimes(1);
});
