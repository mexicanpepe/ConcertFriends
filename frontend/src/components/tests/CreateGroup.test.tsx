// src/components/tests/CreateGroup.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CreateGroup from '../CreateGroup';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          festivalid: 1,
          festival_name: 'Coachella',
          year: 2025,
          days: 3
        }
      ])
  })
) as jest.Mock;

describe('CreateGroup UI', () => {
  it('renders festival tiles after fetch', async () => {
    render(
      <BrowserRouter>
        <CreateGroup />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/coachella/i)).toBeInTheDocument();
    });
  });
});
