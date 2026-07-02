import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

vi.mock('../hooks/useTasks');
const mockedUseTasks = vi.mocked(useTasks);

const baseReturn = {
	tasks: [] as Task[],
	loading: false,
	error: null as string | null,
	loadTasks: vi.fn(),
	addTask: vi.fn(),
	editTask: vi.fn(),
	removeTask: vi.fn(),
	toggleComplete: vi.fn(),
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('App', () => {
	it('renders the form and the empty state without stats', () => {
		mockedUseTasks.mockReturnValue({ ...baseReturn });

		render(<App />);

		expect(screen.getByTestId('task-form')).toBeInTheDocument();
		expect(screen.getByTestId('empty')).toBeInTheDocument();
		expect(screen.queryByText('Total')).not.toBeInTheDocument();
	});

	it('shows the header stats when tasks exist', () => {
		const tasks: Task[] = [
			{
				id: 1,
				title: 'Tâche',
				description: null,
				completed: true,
				createdAt: '2026-01-15T10:00:00Z',
				updatedAt: '2026-01-15T10:00:00Z',
			},
		];
		mockedUseTasks.mockReturnValue({ ...baseReturn, tasks });

		render(<App />);

		expect(screen.getByText('Total')).toBeInTheDocument();
		expect(screen.getByText('Terminées')).toBeInTheDocument();
		expect(screen.getByText('En cours')).toBeInTheDocument();
	});
});
