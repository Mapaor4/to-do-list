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
            <span class="del"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"/></svg></span>
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
    const del = e.target.closest('.del');
    const drag = e.target.closest('.drag');

    if (del) {
        tasks.splice(i, 1);
    } else if (!drag) {
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