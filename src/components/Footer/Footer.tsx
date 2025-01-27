import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  handleClearCompleted: () => Promise<void>;
}

export const Footer: React.FC<Props> = ({ todos, handleClearCompleted }) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  return (
    <footer className="todoapp__footer">
      <span data-cy="TodosCounter" className="todo-count">
        {activeTodosCount} items left
      </span>
      {completedTodosCount > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
