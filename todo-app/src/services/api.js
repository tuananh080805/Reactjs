// Sử dụng JSONPlaceholder API cho demo
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const todoApi = {
  // Lấy tất cả todos
  getAllTodos: () => fetch(`${BASE_URL}/todos?_limit=10`),
  
  // Lấy todo theo ID
  getTodoById: (id) => fetch(`${BASE_URL}/todos/${id}`),
  
  // Tạo todo mới
  createTodo: (todo) => fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  }),
  
  // Cập nhật todo
  updateTodo: (id, todo) => fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  }),
  
  // Xóa todo
  deleteTodo: (id) => fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  }),
};

// Hoặc tạo mock data cho development
export const mockTodos = [
  { id: 1, title: 'Học ReactJS', completed: false },
  { id: 2, title: 'Làm bài tập', completed: true },
  { id: 3, title: 'Đọc sách', completed: false },
];