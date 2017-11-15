import Injector from '@dojo/widget-core/Injector';
import {
	addTodo,
	clearCompleted,
	editTodo,
	removeTodo,
	toggleAllTodos,
	toggleTodo,
	updateTodo,
	updateTodoItem,
	todoStore,
	Todo
} from './todoStore';

export default class ApplicationContext extends Injector {
	addTodo = addTodo;
	clearCompleted = clearCompleted;
	editTodo = editTodo;
	removeTodo = removeTodo;
	toggleAllTodos = toggleAllTodos;
	toggleTodo = toggleTodo;
	updateTodo = updateTodo;
	updateTodoItem = updateTodoItem;

	constructor() {
		super({});

		todoStore.on('invalidate', () => {
			this.emit({ type: 'invalidate' });
		});
	}

	get allCompleted() {
		return todoStore.get('/completedCount') === todoStore.get('/todos/length');
	}

	get todoItem() {
		return todoStore.get('/todoItem');
	}

	get todos() {
		return todoStore.get<Todo[]>('/todos');
	}

	get activeCount() {
		return todoStore.get('/activeCount');
	}

	get completedItems() {
		return todoStore.get('/completedCount') > 0;
	}

	get() {
		return this;
	}
}
