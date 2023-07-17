import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../../api/todosApi';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: todos,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    select: (data) => data.sort((a, b) => b.id - a.id),
  });

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      //Invalidate cache and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      //Invalidate cache and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      //Invalidate cache and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false });
    setNewTodo('');
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor='new-todo'>Enter a new todo item</label>
      <div className='new-todo'>
        <input
          type='text'
          id='new-todo'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder='Enter new Todo'
        />
      </div>
      <button hidden={isError} disabled={isLoading} className='submit'>
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <pre>Loading....</pre>;
  } else if (isError) {
    content = <pre>{error.message}</pre>;
  } else {
    //content = JSON.stringify(todos);
    content = todos.map((todo) => {
      return (
        <article key={todo.id}>
          <div className='todo'>
            <input
              type='checkbox'
              checked={todo.completed}
              id={todo.id}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button
            className='trash'
            onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  }

  return (
    <main>
      <h1>Todo List.</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;
