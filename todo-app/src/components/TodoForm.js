import React, { useState, useEffect } from 'react';

const TodoForm = ({ onSubmit, editTodo, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
    }
  }, [editTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Tiêu đề không được để trống');
      return;
    }

    setError('');
    onSubmit(title);
    setTitle('');
  };

  const handleCancel = () => {
    setTitle('');
    setError('');
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập công việc mới..."
          className="todo-input"
        />
        {error && <span className="error">{error}</span>}
      </div>
      <div className="form-actions">
        <button type="submit">
          {editTodo ? 'Cập nhật' : 'Thêm'}
        </button>
        {editTodo && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;