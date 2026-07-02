import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	getTasks,
	getTask,
	createTask,
	updateTask,
	deleteTask,
} from '../api/taskApi';

const mockTask = {
	id: 1,
	title: 'Test',
	description: null,
	completed: false,
	createdAt: '2026-01-15T10:00:00Z',
	updatedAt: '2026-01-15T10:00:00Z',
};

function mockFetchOk(body: unknown) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(body),
		})
	);
}

function mockFetchError(status: number, message = 'error') {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: false,
			status,
			text: () => Promise.resolve(message),
		})
	);
}

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('taskApi', () => {
	describe('getTasks', () => {
		it('returns the list of tasks', async () => {
			mockFetchOk([mockTask]);

			const tasks = await getTasks();

			expect(tasks).toEqual([mockTask]);
			expect(fetch).toHaveBeenCalledWith('/api/tasks');
		});

		it('throws when the response is not ok', async () => {
			mockFetchError(500, 'server error');

			await expect(getTasks()).rejects.toThrow('HTTP 500: server error');
		});
	});

	describe('getTask', () => {
		it('requests a single task by id', async () => {
			mockFetchOk(mockTask);

			const task = await getTask(1);

			expect(task).toEqual(mockTask);
			expect(fetch).toHaveBeenCalledWith('/api/tasks/1');
		});
	});

	describe('createTask', () => {
		it('sends a POST request with the payload', async () => {
			mockFetchOk(mockTask);

			const task = await createTask({ title: 'Test' });

			expect(task).toEqual(mockTask);
			expect(fetch).toHaveBeenCalledWith('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: 'Test' }),
			});
		});
	});

	describe('updateTask', () => {
		it('sends a PUT request with the payload', async () => {
			mockFetchOk({ ...mockTask, completed: true });

			const task = await updateTask(1, { completed: true });

			expect(task.completed).toBe(true);
			expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: true }),
			});
		});
	});

	describe('deleteTask', () => {
		it('sends a DELETE request', async () => {
			vi.stubGlobal(
				'fetch',
				vi.fn().mockResolvedValue({ ok: true })
			);

			await deleteTask(1);

			expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
				method: 'DELETE',
			});
		});

		it('throws when the deletion fails', async () => {
			mockFetchError(404, 'not found');

			await expect(deleteTask(1)).rejects.toThrow('HTTP 404: not found');
		});
	});
});
