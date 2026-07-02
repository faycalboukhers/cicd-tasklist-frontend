import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from '../components/TaskItem';
import type { Task } from '../types/task';

const task: Task = {
	id: 1,
	title: 'Ma tâche',
	description: 'Une description',
	completed: false,
	createdAt: '2026-01-15T10:00:00Z',
	updatedAt: '2026-01-15T10:00:00Z',
};

function renderItem(overrides = {}) {
	const handlers = {
		onToggle: vi.fn(),
		onDelete: vi.fn(),
		onEdit: vi.fn(),
		...overrides,
	};
	render(<TaskItem task={task} {...handlers} />);
	return handlers;
}

describe('TaskItem', () => {
	it('displays the task content', () => {
		renderItem();

		expect(screen.getByText('Ma tâche')).toBeInTheDocument();
		expect(screen.getByText('Une description')).toBeInTheDocument();
	});

	it('calls onToggle when the checkbox is clicked', async () => {
		const user = userEvent.setup();
		const { onToggle } = renderItem();

		await user.click(screen.getByRole('checkbox'));

		expect(onToggle).toHaveBeenCalledWith(1);
	});

	it('edits the task and saves the new values', async () => {
		const user = userEvent.setup();
		const { onEdit } = renderItem();

		await user.click(screen.getByRole('button', { name: 'Modifier' }));

		const title = screen.getByLabelText('Modifier le titre');
		await user.clear(title);
		await user.type(title, 'Titre modifié');
		await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

		expect(onEdit).toHaveBeenCalledWith(1, {
			title: 'Titre modifié',
			description: 'Une description',
		});
	});

	it('requires a confirmation before deleting', async () => {
		const user = userEvent.setup();
		const { onDelete } = renderItem();

		const deleteButton = screen.getByRole('button', { name: 'Supprimer' });
		await user.click(deleteButton);
		expect(onDelete).not.toHaveBeenCalled();

		await user.click(deleteButton);
		expect(onDelete).toHaveBeenCalledWith(1);
	});
});
