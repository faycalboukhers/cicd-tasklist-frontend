import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTasks } from '../hooks/useTasks';
import * as taskApi from '../api/taskApi';
import type { Task } from '../types/task';

vi.mock('../api/taskApi');
const api = vi.mocked(taskApi);

const task: Task = {
	id: 1,
	title: 'A',
	description: null,
	completed: false,
	createdAt: '2026-01-15T10:00:00Z',
	updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('useTasks', () => {
	it('loads the tasks on mount', async () => {
		api.getTasks.mockResolvedValue([task]);

		const { result } = renderHook(() => useTasks());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.tasks).toEqual([task]);
		expect(result.current.error).toBeNull();
	});

	it('exposes an error message when loading fails', async () => {
		api.getTasks.mockRejectedValue(new Error('service down'));

		const { result } = renderHook(() => useTasks());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.error).toBe('service down');
	});

	it('adds a task at the top of the list', async () => {
		api.getTasks.mockResolvedValue([]);
		api.createTask.mockResolvedValue(task);

		const { result } = renderHook(() => useTasks());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.addTask({ title: 'A' });
		});

		expect(result.current.tasks).toEqual([task]);
	});

	it('replaces a task when editing it', async () => {
		api.getTasks.mockResolvedValue([task]);
		api.updateTask.mockResolvedValue({ ...task, title: 'B' });

		const { result } = renderHook(() => useTasks());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.editTask(1, { title: 'B' });
		});

		expect(result.current.tasks[0].title).toBe('B');
	});

	it('toggles completion using the current state', async () => {
		api.getTasks.mockResolvedValue([task]);
		api.updateTask.mockResolvedValue({ ...task, completed: true });

		const { result } = renderHook(() => useTasks());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.toggleComplete(1);
		});

		expect(api.updateTask).toHaveBeenCalledWith(1, { completed: true });
		expect(result.current.tasks[0].completed).toBe(true);
	});

	it('removes a task from the list', async () => {
		api.getTasks.mockResolvedValue([task]);
		api.deleteTask.mockResolvedValue(undefined);

		const { result } = renderHook(() => useTasks());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.removeTask(1);
		});

		expect(result.current.tasks).toEqual([]);
	});
});
