document.addEventListener('DOMContentLoaded', () => {
    const elements = {
      listSelect: document.getElementById('listSelect'),
      newListName: document.getElementById('newListName'),
      addListBtn: document.getElementById('addListBtn'),
      newTask: document.getElementById('newTask'),
      addTaskBtn: document.getElementById('addTaskBtn'),
      taskList: document.getElementById('taskList'),
      clearCompletedBtn: document.getElementById('clearCompletedBtn')
    };
  
    let todoLists = JSON.parse(localStorage.getItem('todoLists')) || {};
  
    const saveLists = () => localStorage.setItem('todoLists', JSON.stringify(todoLists));
  
    const renderListSelect = () => {
      elements.listSelect.innerHTML = Object.keys(todoLists).map(list =>
        `<option value="${list}">${list}</option>`
      ).join('');
    };
  
    const renderTasks = () => {
      const selectedList = elements.listSelect.value;
      if (!selectedList) return;
      elements.taskList.innerHTML = todoLists[selectedList].map((task, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <input type="checkbox" class="form-check-input" ${task.completed ? 'checked' : ''} data-index="${index}">
          <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">${task.text}</span>
          <button class="btn btn-danger btn-sm" data-index="${index}">Delete</button>
        </li>
      `).join('');
    };
  
    const addTask = () => {
      const taskText = elements.newTask.value.trim();
      if (!taskText) return;
      todoLists[elements.listSelect.value].push({ text: taskText, completed: false });
      elements.newTask.value = '';
      saveLists();
      renderTasks();
    };
  
    const handleTaskActions = e => {
      const index = e.target.dataset.index;
      const selectedList = elements.listSelect.value;
      if (e.target.tagName === 'INPUT') {
        todoLists[selectedList][index].completed = e.target.checked;
      } else if (e.target.tagName === 'BUTTON') {
        todoLists[selectedList].splice(index, 1);
      }
      saveLists();
      renderTasks();
    };
  
    const addList = () => {
      const listName = elements.newListName.value.trim();
      if (listName && !todoLists[listName]) {
        todoLists[listName] = [];
        elements.newListName.value = '';
        saveLists();
        renderListSelect();
        elements.listSelect.value = listName;
        renderTasks();
      }
    };
  
    const clearCompletedTasks = () => {
      const selectedList = elements.listSelect.value;
      todoLists[selectedList] = todoLists[selectedList].filter(task => !task.completed);
      saveLists();
      renderTasks();
    };
  
    elements.addListBtn.addEventListener('click', addList);
    elements.addTaskBtn.addEventListener('click', addTask);
    elements.clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    elements.taskList.addEventListener('click', handleTaskActions);
    elements.listSelect.addEventListener('change', renderTasks);
  
    renderListSelect();
    renderTasks();
  });
  