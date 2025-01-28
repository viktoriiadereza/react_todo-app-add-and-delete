import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null; // Додано tempTodo
  handleDeleteTodo: (todoId: number) => Promise<void>; // Додано handleDeleteTodo
  onToggle: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  onToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onToggle={onToggle}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={{ ...tempTodo, isLoading: true }}
              onDelete={handleDeleteTodo}
              onToggle={onToggle}
            />
          )}
    </section>
  );
};
