import { Container } from '@dojo/widget-core/Container';

import TodoList, { TodoListProperties } from '../widgets/TodoList';
import ApplicationContext from '../ApplicationContext';

function getProperties({ todos }: ApplicationContext, { activeFilter }: TodoListProperties) {
	return { todos, activeFilter };
}

const TodoListContainer = Container<TodoList>('todo-list', 'todo-store-injector', { getProperties });

export default TodoListContainer;
