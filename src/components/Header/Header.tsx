import React, { useEffect, useRef } from 'react';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  handleAddTodo: (
    event: React.FormEvent,
    focusInput: () => void,
  ) => Promise<void>;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all" />

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
