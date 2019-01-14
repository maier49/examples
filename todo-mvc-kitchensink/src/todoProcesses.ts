import { createCommandFactory, createProcess } from '@dojo/framework/stores/process';
import { PatchOperation } from '@dojo/framework/stores/state/Patch';
import { add, remove, replace } from '@dojo/framework/stores/state/operations';
import { uuid } from '@dojo/framework/core/util';

export type TodoStore = {
	completedCount: number;
	completed: boolean;
	currentSearch: string;
	currentTodo: string;
	editedTodo: Todo | undefined;
	todoCount: number;
	todos: Todos;
};

const commandFactory = createCommandFactory<TodoStore>();

export interface Todo {
	id: string;
	label: string;
	completed?: boolean;
	editing?: boolean;
}

export interface Todos {
	[key: string]: Todo;
}

const addTodoCommand = commandFactory(({ state }) => {
	const id = uuid();
	const label = state && state.currentTodo && state.currentTodo.trim();
	if (state && label) {
		state.todos = state.todos || {};
		state.todos[id] = { label, id };
		state.currentTodo = '';
	}
});

const updateCompletedFlagCommand = commandFactory(({ state }) => {
	if (state) {
		state.completed = state.todoCount > 0 && state.todoCount === state.completedCount;
	}
});

const updateTodoCountsCommand = commandFactory(({ state }) => {
	if (state) {
		const todos = state.todos;
		const todoArray = Object.keys(todos).map(key => todos[key]);

		state.todoCount = todoArray.length;
		state.completedCount = todoArray.filter(({ completed }) => completed).length;
	}
});

const setCurrentTodoCommand = commandFactory(({ payload: { todo }, state }) => {
	if (state) {
		state.currentTodo = todo;
	}
});

const removeTodoCommand = commandFactory(({ payload: { id }, state }) => {
	if (state && state.todos) {
		delete state.todos[id];
	}
});

const toggleTodoCommand = commandFactory(({ state, payload: { id } }) => {
	if (state) {
		const todo = state.todos && state.todos[id];
		if (todo) {
			todo.completed = !todo.completed;
		}
	}
});

const toggleTodosCommand = commandFactory(({ state }) => {
	if (state) {
		const completed = state.completed = !state.completed;
		Object.keys(state.todos || {}).forEach((id) => {
			if (state.todos[id]) {
				state.todos[id].completed = completed;
			}
		});
	}
});

const editTodoCommand = commandFactory(({ payload: { todo }, state }) => {
	if (state) {
		state.editedTodo = todo;
	}
});

const clearCompletedCommand = commandFactory(({ state }) => {
	if (state) {
		const todos: Todos = state.todos || {};

		Object.keys(todos).forEach(id => {
			if (todos[id] && todos[id].completed) {
				delete todos[id];
			}
		});
	}
});

const saveTodoCommand = commandFactory(({ state }) => {
	const editedTodo = state && state.editedTodo;
	if (state && editedTodo) {
		state.todos[editedTodo.id] = editedTodo;
		delete state.editedTodo;
	}
});

const searchCommand = commandFactory(({ payload: { search }, state }) => {
	if (state) {
		state.currentSearch = search;
	}
});

const initialStateCommand = commandFactory(({ state }) => {
	if (state) {
		state.completedCount = 0;
		state.completed = false;
		state.currentSearch = '';
		state.currentTodo = '';
		state.editedTodo = undefined;
		state.todoCount = 0;
		state.todos = {};
	}
});

export const initialStateProcess = createProcess('initial-state', [ initialStateCommand ]);

export const addTodoProcess = createProcess('add-todo', [ addTodoCommand, updateTodoCountsCommand, updateCompletedFlagCommand ]);

export const removeTodoProcess = createProcess('remove-todo', [ removeTodoCommand, updateTodoCountsCommand, updateCompletedFlagCommand ]);

export const toggleTodoProcess = createProcess('toggle-todo', [ toggleTodoCommand, updateTodoCountsCommand, updateCompletedFlagCommand ]);

export const toggleTodosProcess = createProcess('toggle-todos', [ toggleTodosCommand, updateTodoCountsCommand, updateCompletedFlagCommand ]);

export const editTodoProcess = createProcess('edit-todo', [ editTodoCommand ]);

export const clearCompletedProcess = createProcess('clear-completed', [ clearCompletedCommand, updateTodoCountsCommand, updateCompletedFlagCommand ]);

export const saveTodoProcess = createProcess('save-todo', [ saveTodoCommand ]);

export const searchProcess = createProcess('search', [ searchCommand ]);

export const setCurrentTodoProcess = createProcess('current-todo', [ setCurrentTodoCommand ]);
