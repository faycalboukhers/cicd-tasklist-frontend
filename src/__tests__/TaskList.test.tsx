import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from '../components/TaskList';
import type { Task } from '../types/task';

const mockTasks: Task[] = [
	{
		id: 1,
		title: 'Première tâche',
		description: 'Description 1',
		completed: false,
		createdAt: '2026-01-15T10:00:00Z',
		updatedAt: '2026-01-15T10:00:00Z',
	},
	{
		id: 2,
		title: 'Deuxième tâche',
		description: null,
		completed: true,
		createdAt: '2026-01-16T10:00:00Z',
		updatedAt: '2026-01-16T10:00:00Z',
	},
];

const noop = {
	onToggle: vi.fn(),
	onDelete: vi.fn(),
	onEdit: vi.fn(),
};

describe('TaskList', () => {
	it('shows loading state', () => {
		render(<TaskList tasks={[]} loading={true} error={null} {...noop} />);

		expect(screen.getByTestId('loading')).toBeInTheDocument();
		expect(screen.getByText('Chargement des tâches...')).toBeInTheDocument();
	});

	it('shows the error state', () => {
		render(
			<TaskList tasks={[]} loading={false} error="Boom" {...noop} />
		);

		expect(screen.getByTestId('error')).toBeInTheDocument();
		expect(screen.getByText(/Boom/)).toBeInTheDocument();
	});

	it('shows the empty state when there is no task', () => {
		render(<TaskList tasks={[]} loading={false} error={null} {...noop} />);

		expect(screen.getByTestId('empty')).toBeInTheDocument();
		expect(screen.getByText('Aucune tâche')).toBeInTheDocument();
	});

	it('renders the list of tasks with the counters', () => {
		render(
			<TaskList tasks={mockTasks} loading={false} error={null} {...noop} />
		);

		expect(screen.getByTestId('task-list')).toBeInTheDocument();
		expect(screen.getByText('Première tâche')).toBeInTheDocument();
		expect(screen.getByText('Deuxième tâche')).toBeInTheDocument();
		expect(screen.getByText('2 tâches')).toBeInTheDocument();
		expect(screen.getByText('1 terminée')).toBeInTheDocument();
	});
});
