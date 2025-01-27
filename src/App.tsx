/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (!USER_ID) return;

    const loadTodos = async (): Promise<void> => {
      setError(null);
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
      } catch {
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddTodo = async (title: string, focusInput: () => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setTimeout(() => focusInput(), 0);
      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsLoading(true);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setNewTodoTitle(''); // Очищаємо поле тільки після успіху
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo
      )
    );

    try {
      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, isDeleting: false } : todo
        )
      );
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      await Promise.all(
        completedTodos.map((todo) => deleteTodo(todo.id))
      );
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch {
      setError('Unable to delete some completed todos');
    }
  };

  const handleFormSubmit = async (event: React.FormEvent, focusInput: () => void) => {
    event.preventDefault();
    await handleAddTodo(newTodoTitle, focusInput);
  };

  const toggleTodo = (todoId: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>
          <div className="todoapp__content">
            <Header
              newTodoTitle={newTodoTitle}
              setNewTodoTitle={setNewTodoTitle}
              handleAddTodo={handleFormSubmit}
              isLoading={isLoading}
            />
            <TodoList
              todos={filteredTodos}
              isLoading={isLoading}
              tempTodo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              onToggle={toggleTodo}
            />
            {todos.length > 0 && (
              <>
                <Footer
                  todos={todos}
                  handleClearCompleted={clearCompletedTodos}
                />
                <Filter
                  filter={filter}
                  setFilter={setFilter}
                />
              </>
            )}
          </div>
          <ErrorNotification error={error} setError={setError} />
        </>
      )}
    </div>
  );
};
