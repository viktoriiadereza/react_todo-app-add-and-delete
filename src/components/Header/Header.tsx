import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  handleAddTodo: (
    event: React.FormEvent,
    focusInput: () => void,
  ) => Promise<void>;
  isLoading: boolean;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  isLoading,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isLoading, todos.length]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleAddTodo(event, focusInput)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
