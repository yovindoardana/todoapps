const todos = [];
const RENDER_EVENT = 'render-todo';

// Event Listener pada Form
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    // Set Event Listener pada Form, event = 'submit'
    submitForm.addEventListener('submit', function (event) {
        // Mencegah refresh halaman
        event.preventDefault();
        // Saat form disubmit, akan menjalankan fungi addTodo()
        addTodo();
    });
});


document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';
    
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';
    
    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted)
        uncompletedTODOList.append(todoElement);
        else
        completedTODOList.append(todoElement);
    }
});

// generate id dengan timestamp saat submit ditekan
function generateId() {
    return +new Date();
}

// Membuat object baru menggunakan data pada parameter
function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

// fungsi untuk menambah task
function addTodo() {
    // title task disimpan di variabel textTodo
    const textTodo = document.getElementById('title').value;
    // date disimpan di variabel timestamp
    const timestamp = document.getElementById('date').value;
    
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    
    if (todoTarget === -1) return;
    
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    
    if (todoTarget == null) return;
    
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    
    return -1;
}

function makeTodo(todoObject) {
    // membuat elemen h2 dan disimpan di variabel text.Title
    const textTitle = document.createElement('h2');
    // mengisi h2 dengan value dari key task pada objek todoObject
    textTitle.innerText = todoObject.task;
    
    // membuat elemen p dan disimpan di variabel textTimestamp
    const textTimestamp = document.createElement('p');
    // mengisi p dengan value dari key timestamp pada objek todoObject
    textTimestamp.innerText = todoObject.timestamp;
    
    // membuat elemen div dan disimpan di variabel textContainer
    const textContainer = document.createElement('div');
    // memberi class 'inner' pada div yang dipanggil menggunakan variabel textContainer
    textContainer.classList.add('inner');
    // mengisi div dengan textTitle dan textTimestamp
    textContainer.append(textTitle, textTimestamp);
    
    // membuat elemen div dan disimpan di variabel container
    const container = document.createElement('div');
    // menambahkan class item dan shadow pada elemen div
    container.classList.add('item', 'shadow');
    // memasukkan div textContainer ke dalam div container
    container.append(textContainer);
    // memberikan div-container attribute id yang valuenya adalah id dari objek
    container.setAttribute('id', `todo-${todoObject.id}`);
    
    function findTodo(todoId) {
        for (const todoItem of todos) {
            if (todoItem.id === todoId) {
                return todoItem;
            }
        }
        return null;
    }
    
    function addTaskToCompleted (todoId) {
        const todoTarget = findTodo(todoId);
        
        if (todoTarget == null) return;
        
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
    
    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });
        
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });
        
        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });
        
        container.append(checkButton);
    }
    
    return container;
}