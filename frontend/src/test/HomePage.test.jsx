import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ productos: [] }) });
  });
  it('renders hero title', () => {
    render(<MemoryRouter><AuthProvider><HomePage /></AuthProvider></MemoryRouter>);
    expect(screen.getByText('TUKI BIKES')).toBeInTheDocument();
  });
});