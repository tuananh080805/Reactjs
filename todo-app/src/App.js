import React, { useState, useEffect, useCallback } from 'react';
import useApi from './hooks/useApi';
import { todoApi, mockTodos } from './services/api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Loading from './components/Loading';
import './App.css';

function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
function App() {
  useTitle("tuananh");
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const { loading, error, get, post, put, delete: del } = useApi();

  // Lấy danh sách todos
  const fetchTodos = useCallback(async () => {
    try {
      // Sử dụng mock data cho development
      setTodos(mockTodos);
      
      // Hoặc sử dụng API thật
      // const response = await get('https://jsonplaceholder.typicode.com/todos?_limit=10');
      // setTodos(response.data);
    } catch (err) {
      console.error('Lỗi khi tải todos:', err);
    }
  }, [get]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Thêm todo mới
  const handleAddTodo = async (title) => {
    try {
      const newTodo = {
        id: Date.now(), // Tạm thời dùng timestamp làm ID
        title,
        completed: false,
      };

      if (editTodo) {
        // Cập nhật todo
        const updatedTodo = { ...editTodo, title };
        setTodos(todos.map(todo => 
          todo.id === editTodo.id ? updatedTodo : todo
        ));
        setEditTodo(null);
        
        // Gọi API update
        // await put(`https://jsonplaceholder.typicode.com/todos/${editTodo.id}`, updatedTodo);
      } else {
        // Thêm todo mới
        setTodos([...todos, newTodo]);
        
        // Gọi API create
        // await post('https://jsonplaceholder.typicode.com/todos', newTodo);
      }
    } catch (err) {
      console.error('Lỗi khi thêm/cập nhật todo:', err);
    }
  };

  // Xóa todo
  const handleDeleteTodo = async (id) => {
    try {
      setTodos(todos.filter(todo => todo.id !== id));
      
      // Gọi API delete
      // await del(`https://jsonplaceholder.typicode.com/todos/${id}`);
    } catch (err) {
      console.error('Lỗi khi xóa todo:', err);
    }
  };

  // Toggle trạng thái completed
  const handleToggleTodo = async (id) => {
    try {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));

      const todoToUpdate = todos.find(todo => todo.id === id);
      if (todoToUpdate) {
        // Gọi API update
        // await put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        //   ...todoToUpdate,
        //   completed: !todoToUpdate.completed
        // });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật todo:', err);
    }
  };

  // Chỉnh sửa todo
  const handleEditTodo = (todo) => {
    setEditTodo(todo);
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditTodo(null);
  };

  if (loading && todos.length === 0) {
    return <Loading />;
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Quản lý công việc</h1>
        
        {error && (
          <div className="error-message">
            Lỗi: {error}
          </div>
        )}

        <TodoForm
          onSubmit={handleAddTodo}
          editTodo={editTodo}
          onCancelEdit={handleCancelEdit}
        />

        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;