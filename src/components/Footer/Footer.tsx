import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter';

interface Props {
  todos: Todo[];
  handleClearCompleted: () => Promise<void>;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

export const Footer: React.FC<Props> = ({ todos, handleClearCompleted, filter, setFilter }) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  return (
    <footer className="todoapp__footer">
      <span data-cy="TodosCounter" className="todo-count">
        {activeTodosCount} items left
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
