import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
	it('shows a validation error when the title is empty', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<TaskForm onSubmit={onSubmit} />);

		await user.click(screen.getByRole('button', { name: 'Ajouter' }));

		expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('submits the trimmed title and description', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<TaskForm onSubmit={onSubmit} />);

		await user.type(screen.getByLabelText('Titre'), '  Ma tâche  ');
		await user.type(screen.getByLabelText('Description'), '  Détail  ');
		await user.click(screen.getByRole('button', { name: 'Ajouter' }));

		expect(onSubmit).toHaveBeenCalledWith({
			title: 'Ma tâche',
			description: 'Détail',
		});
	});

	it('clears the fields after a successful create', async () => {
		const user = userEvent.setup();
		render(<TaskForm onSubmit={vi.fn()} />);

		const title = screen.getByLabelText('Titre') as HTMLInputElement;
		await user.type(title, 'Tâche');
		await user.click(screen.getByRole('button', { name: 'Ajouter' }));

		expect(title.value).toBe('');
	});

	it('removes the validation error as soon as the user types', async () => {
		const user = userEvent.setup();
		render(<TaskForm onSubmit={vi.fn()} />);

		await user.click(screen.getByRole('button', { name: 'Ajouter' }));
		expect(screen.getByRole('alert')).toBeInTheDocument();

		await user.type(screen.getByLabelText('Titre'), 'x');
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});
