import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import { w, v } from '@dojo/widget-core/d';

import * as css from './styles/todoApp.css';

export const TodoAppBase = ThemedMixin(WidgetBase);

@theme(css)
export default class TodoApp extends TodoAppBase {
	render() {
		return v('section', { classes: this.theme(css.todoapp) }, [
			w('todo-header-container', {}),
			v('section', {}, [
				w('todo-list-container', {})
			]),
			w('todo-footer-container', {})
		]);
	}
}
