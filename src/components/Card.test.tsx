import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  it('renders title, description and content', () => {
    render(
      <Card title="Resumo" description="Visao compacta">
        <p>Conteudo interno</p>
      </Card>,
    );

    expect(screen.getByRole('heading', { name: 'Resumo' })).toBeInTheDocument();
    expect(screen.getByText('Visao compacta')).toBeInTheDocument();
    expect(screen.getByText('Conteudo interno')).toBeInTheDocument();
  });
});
