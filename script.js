const input = document.getElementById('input');
const list = document.getElementById('list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let draggedIndex = null;

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
    list.innerHTML = tasks.map((task, i) => `
        <li class="${task.done ? 'done' : ''}" data-i="${i}" draggable="true">
            <span class="drag">⠿</span>
            <span class="check"></span>
            <span class="text">${task.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
            <span class="del">🗙</span>
        </li>
    `).join('');
}

input.addEventListener('keypress', e => {
    if (e.key === 'Enter' && input.value.trim()) {
        tasks.push({ text: input.value.trim(), done: false });
        input.value = '';
        save();
        render();
    }
});

list.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const i = li.dataset.i;
    
    if (e.target.classList.contains('del')) {
        tasks.splice(i, 1);
    } else if (!e.target.classList.contains('drag')) {
        tasks[i].done = !tasks[i].done;
    }
    save();
    render();
});

list.addEventListener('dragstart', e => {
    const li = e.target.closest('li');
    if (!li) return;
    draggedIndex = parseInt(li.dataset.i);
    li.classList.add('dragging');
});

list.addEventListener('dragend', e => {
    const li = e.target.closest('li');
    if (li) li.classList.remove('dragging');
});

list.addEventListener('dragover', e => {
    e.preventDefault();
    const li = e.target.closest('li');
    if (!li || draggedIndex === null) return;
    
    const overIndex = parseInt(li.dataset.i);
    if (draggedIndex !== overIndex) {
        const draggedTask = tasks[draggedIndex];
        tasks.splice(draggedIndex, 1);
        tasks.splice(overIndex, 0, draggedTask);
        draggedIndex = overIndex;
        render();
    }
});

render();