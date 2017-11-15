import { Container } from '@dojo/widget-core/Container';

import TodoFooter from '../widgets/TodoFooter';
import ApplicationContext from '../ApplicationContext';

function getProperties({ todos, activeCount, completedItems, clearCompleted }: ApplicationContext) {
	return { todos: todos.length > 0, activeCount, completedItems, clearCompleted };
}

const TodoFooterContainer = Container<TodoFooter>('todo-footer', 'todo-store-injector', { getProperties });

export default TodoFooterContainer;
