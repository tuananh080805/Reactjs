import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.title}</span>
      <div className="todo-actions">
        <button onClick={() => onEdit(todo)}>Sửa</button>
        <button onClick={() => onDelete(todo.id)}>Xóa</button>
      </div>
    </div>
  );
};

export default TodoItem;