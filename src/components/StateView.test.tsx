import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState, ErrorState, LoadingState } from './StateView';

describe('StateView variants', () => {
  it('renders the empty state copy and optional action', () => {
    render(
      <EmptyState
        title="Nada por aqui"
        description="Comece adicionando o primeiro item."
        action={<button type="button">Adicionar</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Nada por aqui' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  it('renders loading and error states', () => {
    render(
      <div>
        <LoadingState title="Carregando" description="Sincronizando dados." />
        <ErrorState title="Falha" description="Tente novamente." />
      </div>,
    );

    expect(screen.getByRole('heading', { name: 'Carregando' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Falha' })).toBeInTheDocument();
  });
});
