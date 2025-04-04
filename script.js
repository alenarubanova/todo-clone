// Variables
const state = { // состояние приложения
    todos: getDataFromStorage()
}


// DOM ELEMENTS 
const formElement = document.querySelector('#form')
const titleInputELement = document.querySelector('#titleInput')
const buttonDeleteAllElement = document.querySelector('#buttonDeleteAll')
const todoListElement = document.querySelector('#todoList')

// Init
render(state.todos)

// Listeners 

// Models
class Todo {
    id = crypto.randomUUID()
    isCompleted = false
    createdAt = new Date().toString()
    
    constructor(title) {
        this.title = title
    }
}


//Helpers
function getDataFromStorage() {
    const data = localStorage.getItem('todos')

    return data ? JSON.parse(data) : []
}

function saveDataToStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos))
}


formElement.addEventListener('submit', handleSubmitForm)
buttonDeleteAllElement.addEventListener('click', handleClickButtonDeleteAll)
todoListElement.addEventListener('click', handleClickButtonRemove)
todoListElement.addEventListener('click', handleChangeCheckbox)

function buildTemplateTodo({ title, id, createdAt, isCompleted }) {
    const checkedAttr = isCompleted ? 'checked' : ''
    const date = prepareDate(createdAt)

    return `
      <div class="todo d-flex align-items-center rounded-3 bg-danger-subtle gap-3 p-3" data-id ="${id}">
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="checkbox${id}" ${checkedAttr}>
            <label class="form-check-label" for="checkbox${id}">
                ${title}
            </label>
        </div>
        <span class="text-body-secondary ms-auto">${date}</span>
        <button class="btn btn-outline-danger btn-sm" data-role="remove">X</button>
      </div>
    `
}

function prepareDate(date = '') {
    const dateInstance = new Date(date)
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    
      return new Intl.DateTimeFormat('ru-RU', options).format(dateInstance)
}

function render(todos = []) {
    todoListElement.innerHTML = ''

    const html = todos.reduce((acc, todo)  => acc + buildTemplateTodo(todo), '')

    todoListElement.innerHTML = html
}


// Handlers

function handleSubmitForm(event) {
    event.preventDefault()
    const title = titleInputELement.value
    const todo = new Todo(title)
    state.todos.push(todo)

    formElement.reset()

    render(state.todos)
    saveDataToStorage(state.todos)
}


function handleClickButtonDeleteAll() {
    state.todos = []
    render(state.todos)
}

function handleClickButtonRemove(event) {
    const target = event.target // dataset — это способ получить все data-* атрибуты HTML-элемента как объект
    const role = target.dataset.role
    if (role === 'remove') {
        console.log('Delete')
        const cardElement = target.closest('.todo') // ищет ближайший родительский элемент (включая сам target), который подходит под CSS-селектор .card
        const id = cardElement.dataset.id
        const newTodos = state.todos.filter((todo) => todo.id !== id)

        state.todos = newTodos

        render(state.todos)
        saveDataToStorage(state.todos)
    }
}


function handleChangeCheckbox(event) {
    const target = event.target
    if (target.type === 'checkbox') {
        const cardElement = target.closest('.todo') // ищет ближайший родительский элемент (включая сам target), который подходит под CSS-селектор .card
        const id = cardElement.dataset.id
        const newTodos = state.todos.map(todo => {
            if (todo.id === id) {  // Сравниваем строки
                todo.isCompleted = target.checked // Обновляем isCompleted
            }
            return todo
        })

        state.todos = newTodos
        render(state.todos)
        saveDataToStorage(state.todos)
    }
}

