import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { Todo } from '../todoStore';

import * as css from './styles/todoList.css';

export interface TodoListProperties extends WidgetProperties {
	todos: Todo[];
	updated: string;
	activeFilter?: 'all' | 'active' | 'completed';
}

export const TodoListBase = ThemedMixin(WidgetBase);

function filter(filterName: string = 'all', todo: Todo): boolean {
	switch (filterName) {
		case 'completed':
			return !!todo.completed;
		case 'active':
			return !todo.completed;
		default:
			return true;
	}
}

@theme(css)
export default class TodoList extends TodoListBase<TodoListProperties> {
	render() {
		const { properties: { activeFilter, todos } } = this;
		const todoItems = todos.filter(todo => filter(activeFilter, todo));

		return v('ul', { id: 'todo-list', classes: this.theme(css.todoList) }, todoItems.map(todo =>
			w('todo-item-container', { key: todo.id, todo } as any)
		));
	}
}
