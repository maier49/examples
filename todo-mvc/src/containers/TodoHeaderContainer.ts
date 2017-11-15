import { Container } from '@dojo/widget-core/Container';

import TodoHeader from '../widgets/TodoHeader';
import ApplicationContext from '../ApplicationContext';

function getProperties({ allCompleted, addTodo, toggleAllTodos, updateTodoItem, todoItem: value }: ApplicationContext) {
	return { allCompleted, addTodo, toggleAllTodos, updateTodoItem, value };
}

const TodoHeaderContainer = Container<TodoHeader>('todo-header', 'todo-store-injector', { getProperties });

export default TodoHeaderContainer;
