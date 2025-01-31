// 변수 선언
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoTemplate = document.getElementById('todo-template');

const STORAGE_KEY = 'todos';

// 로컬 스토리지에서 데이터 가져오기
const getTodos = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// 할 일 저장
const saveTodos = (todos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

// 할 일 추가 후 로컬스토리지 저장 (고유 ID 추가)
const saveTodoItem = (title) => {
    const todos = getTodos();
    const newTodo = { id: Date.now(), title }; // 고유 ID 추가
    todos.push(newTodo);
    saveTodos(todos);
    return newTodo; // 생성된 할 일 반환
};

// 할 일 삭제 후 로컬스토리지 업데이트
const deleteTodoItem = (id) => {
    const todos = getTodos().filter(todo => todo.id !== id);
    saveTodos(todos);
};

// 할 일 요소 생성
const createTodoItem = (todo) => {
    const { id, title } = todo;
    const todoItem = todoTemplate.content.cloneNode(true).querySelector('.todo-item');
    const itemTitleElement = todoItem.querySelector('.item-title');
    itemTitleElement.textContent = title;

    // 삭제 버튼 이벤트 추가
    const deleteBtn = todoItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        todoItem.remove();
        deleteTodoItem(id);
    });

    // 수정 버튼 이벤트 추가
    const editBtn = todoItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        const newValue = prompt('수정할 내용을 입력하세요:', title);
        if (newValue !== null && newValue.trim() !== '') {
            itemTitleElement.textContent = newValue.trim();
            const todos = getTodos().map(todo =>
                todo.id === id ? { ...todo, title: newValue.trim() } : todo
            );
            saveTodos(todos);
        }
    });

    return todoItem;
};

// 할 일 추가
const addTodoItem = (title) => {
    const newTodo = saveTodoItem(title); // 저장 후 객체 반환
    const todoItem = createTodoItem(newTodo);
    todoList.appendChild(todoItem);
};

// 로컬 스토리지에서 할 일 불러오기
const loadTodoItems = () => {
    getTodos().forEach(todo => {
        const todoItem = createTodoItem(todo);
        todoList.appendChild(todoItem);
    });
};

// 입력 필드 초기화
const clearTodoInput = () => {
    todoInput.value = '';
};

// 이벤트 핸들러
const handleFormSubmit = (event) => {
    event.preventDefault();

    // input 값 없으면 리턴
    const inputValue = todoInput.value.trim();
    if (inputValue === '') return;

    addTodoItem(inputValue); // 할 일 추가
    clearTodoInput(); // 입력 필드 초기화
};

// 앱 초기화
const initTodoApp = () => {
    todoForm.addEventListener('submit', handleFormSubmit);
    loadTodoItems();
};

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', initTodoApp);
