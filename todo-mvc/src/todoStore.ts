import { CommandRequest, createProcess } from '@dojo/stores/process';
import { PatchOperation } from '@dojo/stores/state/Patch';
import { add, remove, replace } from '@dojo/stores/state/operations';
import Store from '@dojo/stores/Store';
import uuid from '@dojo/core/uuid';
import { assign } from '@dojo/shim/object';

function findById(get: <T>(pointer: string) => T, id: string) {
	const todos: Todo[] = get('/todos');
	let foundIndex;

	todos.forEach((todo: Todo, index: number) => {
		if (todo.id === id) {
			foundIndex = index;
		}
	});

	return foundIndex;
}

export interface Todo {
	id: string;
	label: string;
	completed: boolean;
	editing?: boolean;
}

function addTodoCommand({ get, payload }: CommandRequest): PatchOperation[] {
	const todos = get('/todos');
	const todo = payload[0];

	todo.label = todo.label && todo.label.trim();

	return [
		add(`/todos/${todos.length}`, { ...todo, id: uuid() }),
		replace('/todoItem', '')
	];
}

function removeTodoCommand({ get, payload }: CommandRequest): PatchOperation[] {
	const indexToRemove = findById(get, payload[0]);

	return typeof indexToRemove === 'undefined' ? [] : [ remove(`/todos/${indexToRemove}`) ];
}

function toggleTodoCommand({ get, payload }: CommandRequest): PatchOperation[] {
	const indexToToggle = findById(get, payload[0]);
	const operations = [];
	if (typeof indexToToggle !== 'undefined') {
		const completed = get(`/todos/${indexToToggle}/completed`);
		operations.push(replace(`/todos/${indexToToggle}/completed`, !completed));
	}

	return operations;
}

function toggleAllTodosCommand({ get }: CommandRequest): PatchOperation[] {
	const completedCount = get('/completedCount');
	const todosSize = get('/todos/length');
	const completed = completedCount !== todosSize;
	const operations = [];

	for (let i = 0; i < todosSize; i++) {
		operations.push(replace(`/todos/${i}/completed`, completed));
	}

	return operations;
}

function editTodoCommand({ get, payload }: CommandRequest): PatchOperation[] {
	const indexToEdit = findById(get, payload[0]);
	return typeof indexToEdit === 'undefined' ? [] : [ replace(`/todos/${indexToEdit}/editing`, true) ];
}

function clearCompletedCommand({ get }: CommandRequest): PatchOperation[] {
	const todos: Todo[] = get('/todos');
	return todos.map(({ completed }, index) => ({ completed, index }))
		.filter(({ completed }) => completed)
		.reverse()
		.map(({ index }) => remove(`/todos/${index}`));
}

function updateTodoCommand({ get, payload }: CommandRequest): PatchOperation[] {
	const [ todo, id ] = payload;
	const indexToUpdate = findById(get, id);
	if (typeof indexToUpdate === 'undefined') {
		return [];
	}

	todo.label = todo.label && todo.label.trim();
	if (!todo.label && typeof indexToUpdate !== 'undefined') {
		return [ remove(`/todos/${indexToUpdate}`) ];
	}

	return [ replace(`/todos/${indexToUpdate}`, assign({}, get(`/todos/${indexToUpdate}`), todo)) ];
}

function updateTodoItemCommand({ payload }: CommandRequest): PatchOperation[] {
	return [ replace('/todoItem', payload[0]) ];
}

function calculateCountsCommand({ get }: CommandRequest): PatchOperation[] {
	const todos = get('/todos');
	const completedTodos = todos.filter((todo: any) => todo.completed);
	return [
		replace('/activeCount', todos.length - completedTodos.length),
		replace ('/completedCount', completedTodos.length)
	];
}

function initialStateCommand() {
	return [
		add('/todoItem', ''),
		add('/todos', []),
		add('/currentTodo', ''),
		add('/activeCount', 0),
		add('/completedCount', 0)
	];
}

const initialStateProcess = createProcess([ initialStateCommand ]);

// creates the store, initializes the state and runs the `getTodosProcess`.
export const todoStore = new Store();
initialStateProcess(todoStore)();

export const addTodo = createProcess([ addTodoCommand, calculateCountsCommand ])(todoStore);

export const removeTodo = createProcess([ removeTodoCommand, calculateCountsCommand ])(todoStore);

export const toggleTodo = createProcess([ toggleTodoCommand, calculateCountsCommand ])(todoStore);

export const toggleAllTodos = createProcess([ toggleAllTodosCommand, calculateCountsCommand ])(todoStore);

export const editTodo = createProcess([ editTodoCommand ])(todoStore);

export const clearCompleted = createProcess([ clearCompletedCommand, calculateCountsCommand ])(todoStore);

export const updateTodoItem = createProcess([ updateTodoItemCommand ])(todoStore);

export const updateTodo = createProcess([ updateTodoCommand ])(todoStore);

export default todoStore;
