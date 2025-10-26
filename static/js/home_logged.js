document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.toggle-sidebar');
  const accountMenu = document.querySelector('.account-menu');
  const accountBtn = document.querySelector('.account-btn');
  const modal = document.getElementById('taskModal');
  const closeBtn = document.querySelector('.close-btn');
  const modalTasks = document.getElementById('modal-tasks');
  const modalTitle = document.getElementById('modal-title');

  // Боковая панель
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Меню аккаунта
  accountBtn.addEventListener('click', () => {
    accountMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!accountMenu.contains(e.target) && accountMenu.classList.contains('show')) {
      accountMenu.classList.remove('show');
    }
  });

  // Обработчики для карточек задач
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Если клик по ссылке или кнопке внутри карточки, не открываем модалку
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        return;
      }
      
      openTaskModal(card);
    });
  });

  // Закрытие модалки
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  function openTaskModal(card) {
    const groupId = card.dataset.groupId;
    const isPersonal = card.dataset.personal;
    
    // Устанавливаем заголовок
    modalTitle.textContent = card.querySelector('h2').textContent;
    
    // Очищаем предыдущее содержимое
    modalTasks.innerHTML = '';
    
    // Группируем задачи по предметам
    const tasksByDiscipline = {};
    const taskItems = card.querySelectorAll('li');
    
    taskItems.forEach(item => {
      const title = item.querySelector('strong').textContent;
      const deadlineElem = item.querySelector('small');
      const deadline = deadlineElem ? deadlineElem.textContent.replace('до ', '') : '';
      
      // Извлекаем дисциплину (если есть)
      let discipline = 'Без дисциплины';
      const disciplineElem = item.querySelector('em');
      if (disciplineElem) {
        discipline = disciplineElem.textContent;
      }
      
      if (!tasksByDiscipline[discipline]) {
        tasksByDiscipline[discipline] = [];
      }
      
      tasksByDiscipline[discipline].push({
        title: title,
        deadline: deadline
      });
    });
    
    // Создаем HTML для сгруппированных задач
    for (const [discipline, tasks] of Object.entries(tasksByDiscipline)) {
      const disciplineSection = document.createElement('div');
      disciplineSection.className = 'modal-discipline';
      
      const disciplineTitle = document.createElement('h3');
      disciplineTitle.textContent = discipline;
      disciplineSection.appendChild(disciplineTitle);
      
      const tasksList = document.createElement('ul');
      tasksList.className = 'modal-tasks-list';
      
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'modal-task';
        
        taskItem.innerHTML = `
          <input type="checkbox" id="task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}">
          <label>
            <strong>${task.title}</strong>
            ${task.deadline ? `<br><small>до ${task.deadline}</small>` : ''}
          </label>
        `;
        
        tasksList.appendChild(taskItem);
      });
      
      disciplineSection.appendChild(tasksList);
      modalTasks.appendChild(disciplineSection);
    }
    
    // Показываем модалку
    modal.style.display = 'flex';
  }
});