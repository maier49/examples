import { Container } from '@dojo/widget-core/Container';

import TodoItem, { TodoItemProperties } from '../widgets/TodoItem';
import ApplicationContext from '../ApplicationContext';

function getProperties({ editTodo, toggleTodo, removeTodo, updateTodo }: ApplicationContext, { todo, key }: TodoItemProperties) {
	return { todo, key, editTodo, toggleTodo, removeTodo, updateTodo };
}

const TodoItemContainer = Container<TodoItem>('todo-item', 'todo-store-injector', { getProperties });

export default TodoItemContainer;
