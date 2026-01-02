document.addEventListener('DOMContentLoaded', () => {
<<<<<<< Updated upstream
  const elements = {
      groupModal: document.getElementById('groupModal'),
      openGroupBtn: document.getElementById('openGroupModal'),
      closeGroupBtn: document.getElementById('closeGroupModal'),
      cancelGroupBtn: document.getElementById('cancelGroupModal'),
      groupForm: document.getElementById('groupForm'),
      taskModal: document.getElementById('taskModal'),
      openTaskBtn: document.getElementById('openTaskModal'),
      closeTaskBtn: document.getElementById('closeTaskModal'),
      cancelTaskBtn: document.getElementById('cancelTaskModal'),
      taskForm: document.getElementById('taskForm')
  };
=======
    const elements = {
        groupModal: document.getElementById('groupModal'),
        openGroupBtn: document.getElementById('openGroupModal'),
        closeGroupBtn: document.getElementById('closeGroupModal'),
        cancelGroupBtn: document.getElementById('cancelGroupModal'),
        groupForm: document.getElementById('groupForm'),
        taskModal: document.getElementById('taskModal'),
        openTaskBtn: document.getElementById('openTaskModal'),
        closeTaskBtn: document.getElementById('closeTaskModal'),
        cancelTaskBtn: document.getElementById('cancelTaskModal'),
        taskForm: document.getElementById('taskForm'),

        taskDetailsModal: document.getElementById('taskDetailsModal'),
        closeTaskDetails: document.getElementById('closeTaskDetails'),
        taskTitle: document.getElementById('taskTitle'),
        taskDetailsContent: document.getElementById('taskDetailsContent'),
        completeTaskBtn: document.getElementById('completeTaskBtn'),
        editTaskBtn: document.getElementById('editTaskBtn')
    };
>>>>>>> Stashed changes

  const menuItems = document.querySelectorAll('.menu li[data-section]');
  const contentSections = document.querySelectorAll('.content-section');
  let activeSection = localStorage.getItem('activeSection') || 'groups';
  activateSection(activeSection);
  menuItems.forEach(item => {
      item.addEventListener('click', () => {
          const sectionId = item.dataset.section;
          activateSection(sectionId);
          menuItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          localStorage.setItem('activeSection', sectionId);
      });
  });

  function activateSection(sectionId) {
      contentSections.forEach(section => {
          section.classList.remove('active');
          section.style.opacity = '0';
          section.style.transform = 'translateY(20px)';
      });

      const targetSection = document.getElementById(`${sectionId}-section`);
      if (targetSection) {
          setTimeout(() => {
              targetSection.classList.add('active');
              setTimeout(() => {
                  targetSection.style.opacity = '1';
                  targetSection.style.transform = 'translateY(0)';
              }, 50);
          }, 100);
      }

      if (sectionId === 'calendar' && !window.taskCalendar) {
          setTimeout(() => {
              window.taskCalendar = new TaskCalendar();
          }, 300);
      }
  }

  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.opacity = 1;
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);
  document.querySelectorAll('.stat-card, .task-group').forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
  });

<<<<<<< Updated upstream
  function animateNeonCards() {
      document.querySelectorAll('.stat-card').forEach((card, index) => {
          setTimeout(() => {
              let boxShadowColor = '';
              if (card.classList.contains('neon-success')) boxShadowColor = 'var(--neon-success)';
              else if (card.classList.contains('neon-streak')) boxShadowColor = 'var(--neon-streak)';
              else if (card.classList.contains('neon-warning')) boxShadowColor = 'var(--neon-warning)';
              
              if (boxShadowColor) {
                  card.style.boxShadow = `var(--shadow-md), ${boxShadowColor}`;
                  setTimeout(() => {
                      card.style.boxShadow = 'var(--shadow-md)';
                  }, 1500);
              }
          }, 300 * index);
      });
  }
  setTimeout(animateNeonCards, 1000);
=======

    const completeBtn = document.getElementById('completeTaskBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', async () => {
            if (!currentTaskId) return;

            try {
                const response = await fetch(`/toggle-task/${currentTaskId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const data = await response.json();
                if (data.ok) {
                     
                    document.getElementById('taskDetailsModal').classList.remove('show');
                    location.reload(); 
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось обновить статус задачи');
            }
        });
    }

     
    const editBtn = document.getElementById('editTaskBtn');

    if (editBtn) {
        editBtn.addEventListener('click', async () => {
            try {
                 
                const response = await fetch(`/tasks/edit/${currentTaskId}/`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                const taskData = await response.json();

                 
                document.getElementById('taskDetailsModal').classList.remove('show');

                 
                const taskModal = document.getElementById('taskModal');
                const form = document.getElementById('taskForm');
                
                 
                form.action = `/tasks/edit/${currentTaskId}/`;

                form.querySelector('[name="title"]').value = taskData.title;
                form.querySelector('[name="description"]').value = taskData.description;
                form.querySelector('[name="discipline"]').value = taskData.discipline;
                form.querySelector('[name="deadline"]').value = taskData.deadline;
                form.querySelector('[name="points"]').value = taskData.points;
                form.querySelector('[name="group"]').value = taskData.group;

                 
                taskModal.querySelector('h3').innerHTML = '<i class="fas fa-edit"></i> Редактирование задачи';
                form.querySelector('button[type="submit"]').textContent = "Сохранить изменения";

                 
                taskModal.classList.add('show');
                
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить данные задачи');
            }
        });
    }

     
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    document.querySelectorAll('.task-group.clickable').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button,a,form,.list-task-item')) return;  
            const href = card.dataset.href;
            if (href) window.location.href = href;
        });
    });

    let currentTaskId = null;

    function openTaskActionModal(data) {
        currentTaskId = data.id;
        const modal = document.getElementById('taskDetailsModal');
        
        document.getElementById('taskTitle').textContent = data.title;
        
         
        const date = new Date(data.deadline);
        const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        document.getElementById('taskDetailsContent').innerHTML = `
            <div class="task-detail-row"><strong>Срок:</strong> ${dateStr}</div>
            <div class="task-detail-row"><strong>Группа:</strong> ${data.group}</div>
            <div class="task-detail-row"><strong>Баллы:</strong> ${data.points}</div>
            <div class="task-detail-row"><strong>Описание:</strong><br>${data.description || 'Нет описания'}</div>
        `;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    document.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.list-task-item');
        if (taskItem) {
            e.stopPropagation();
            openTaskActionModal(taskItem.dataset);
        }
    });

    document.getElementById('completeTaskBtn')?.addEventListener('click', async () => {
        if (!currentTaskId) return;
        
        const response = await fetch(`/toggle-task/${currentTaskId}/`, {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': getCookie('csrftoken') }
        });
        
        if (response.ok) {
            location.reload();  
        }
    });

    document.getElementById('editTaskBtn')?.addEventListener('click', () => {
         
        window.location.href = `/tasks/edit/${currentTaskId}/`; 
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function openTaskModalFromList(taskElement) {
        const data = taskElement.dataset;
        currentTaskId = data.id;

        elements.taskTitle.textContent = data.title;

         
        const dateObj = new Date(data.deadline);
        const dateStr = dateObj.toLocaleDateString('ru-RU');
        const timeStr = dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});

         
        elements.taskDetailsContent.innerHTML = `
            <div class="task-detail-row">
                <div class="task-detail-label">Срок:</div>
                <div class="task-detail-value">
                    <span class="deadline-badge normal">
                        ${dateStr} в ${timeStr}
                    </span>
                </div>
            </div>
            <div class="task-detail-row">
                <div class="task-detail-label">Группа:</div>
                <div class="task-detail-value">
                     <span class="group-badge group">${data.group}</span>
                </div>
            </div>
            <div class="task-detail-row">
                <div class="task-detail-label">Предмет:</div>
                <div class="task-detail-value">${data.discipline || '—'}</div>
            </div>
            <div class="task-detail-row">
                <div class="task-detail-label">Баллы:</div>
                <div class="task-detail-value">
                    <span class="points-badge"><i class="fas fa-star"></i> ${data.points}</span>
                </div>
            </div>
            <div class="task-detail-row">
                <div class="task-detail-label">Описание:</div>
                <div class="task-detail-value">
                    <div class="task-description">${data.description || 'Нет описания'}</div>
                </div>
            </div>
        `;

         
        elements.completeTaskBtn.innerHTML = '<i class="fas fa-check"></i> Выполнить';
        elements.completeTaskBtn.disabled = false;
        elements.completeTaskBtn.classList.remove('btn-secondary');
        elements.completeTaskBtn.classList.add('btn-primary');

        elements.taskDetailsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('.list-task-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();  
            openTaskModalFromList(item);
        });
    });

    if (elements.completeTaskBtn) {
        elements.completeTaskBtn.addEventListener('click', async () => {
            if (!currentTaskId) return;

            const btn = elements.completeTaskBtn;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
            btn.disabled = true;

            try {
                const response = await fetch(`/toggle-task/${currentTaskId}/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const data = await response.json();
                
                if (data.ok) {
                    showNotification('Задача выполнена!', 'success');
                    elements.taskDetailsModal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                    
                     
                    setTimeout(() => {
                        location.reload(); 
                    }, 500);
                } else {
                    showNotification('Ошибка при обновлении статуса', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Ошибка сети', 'error');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    if (elements.editTaskBtn) {
        elements.editTaskBtn.addEventListener('click', () => {
             
            elements.taskDetailsModal.classList.remove('show');
            
             
             
            showNotification('Функция редактирования в разработке', 'info');
            
             
             
        });
    }

    if (elements.closeTaskDetails) {
        elements.closeTaskDetails.addEventListener('click', () => {
            elements.taskDetailsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
     
    if (elements.taskDetailsModal) {
        elements.taskDetailsModal.addEventListener('click', (e) => {
            if (e.target === elements.taskDetailsModal) {
                elements.taskDetailsModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    function animateNeonCards() {
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                let boxShadowColor = '';
                if (card.classList.contains('neon-success')) boxShadowColor = 'var(--neon-success)';
                else if (card.classList.contains('neon-streak')) boxShadowColor = 'var(--neon-streak)';
                else if (card.classList.contains('neon-warning')) boxShadowColor = 'var(--neon-warning)';
                
                if (boxShadowColor) {
                    card.style.boxShadow = `var(--shadow-md), ${boxShadowColor}`;
                    setTimeout(() => {
                        card.style.boxShadow = 'var(--shadow-md)';
                    }, 1500);
                }
            }, 300 * index);
        });
    }
    setTimeout(animateNeonCards, 1000);
>>>>>>> Stashed changes

  document.querySelectorAll('.task-group.clickable').forEach(card => {
      card.addEventListener('click', (e) => {
          if (e.target.closest('button,a,form,.task-item')) return;
          const href = card.dataset.href;
          if (href) window.location.href = href;
      });
  });

  setupModal(elements.groupModal, elements.openGroupBtn, elements.closeGroupBtn, elements.cancelGroupBtn, elements.groupForm, 'Группа успешно создана!');
  setupModal(elements.taskModal, elements.openTaskBtn, elements.closeTaskBtn, elements.cancelTaskBtn, elements.taskForm, 'Задача успешно создана!');

  function setupModal(modal, openBtn, closeBtn, cancelBtn, form, successMessage) {
      if (!modal || !openBtn) return;
      
      const formGroups = modal.querySelectorAll('.form-group');
      formGroups.forEach(group => {
          group.style.opacity = '0';
          group.style.transform = 'translateY(10px)';
          group.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      });

      const openModal = () => {
          modal.classList.add('show');
          document.body.style.overflow = 'hidden';
          setTimeout(() => {
              formGroups.forEach((group, index) => {
                  setTimeout(() => {
                      group.style.opacity = '1';
                      group.style.transform = 'translateY(0)';
                  }, 100 + (index * 70));
              });
          }, 100);
      };

      const closeModal = () => {
          formGroups.forEach((group, index) => {
              setTimeout(() => {
                  group.style.opacity = '0';
                  group.style.transform = 'translateY(10px)';
              }, index * 30);
          });
          setTimeout(() => {
              modal.classList.remove('show');
              document.body.style.overflow = 'auto';
              if (form) form.reset();
          }, 300);
      };

      openBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
      });

      if (form) {
          form.addEventListener('submit', function(e) {
              
              const submitBtn = this.querySelector('button[type="submit"]');
              if (!submitBtn) return;
              
              submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';
              submitBtn.disabled = true;
              submitBtn.style.opacity = '0.85';

<<<<<<< Updated upstream
              e.preventDefault();
              setTimeout(() => {
                    this.submit();    
                    closeModal();
                    submitBtn.innerHTML = submitBtn.innerHTML.includes('Группу') 
                        ? '<i class="fas fa-plus"></i> Создать группу' 
                        : '<i class="fas fa-plus"></i> Создать задачу';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    if (successMessage) showNotification(successMessage, 'success');
              }, 1500);
          });
      }
  }
=======
            });
        }
    }
>>>>>>> Stashed changes

  function showNotification(message, type = 'info') {
      if (document.getElementById('notification-styles')) {
          document.getElementById('notification-styles').remove();
      }
      
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
          .notification {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 9999;
              background: var(--glass-bg);
              border: 1px solid var(--glass-border);
              backdrop-filter: blur(10px);
              border-radius: var(--radius-md);
              padding: 1rem 1.5rem;
              display: flex;
              align-items: center;
              gap: 0.8rem;
              box-shadow: var(--shadow-lg);
              opacity: 0;
              transform: translateY(-20px);
              transition: var(--transition);
              min-width: 280px;
          }
          .notification.success { border-left: 4px solid var(--success); }
          .notification.error { border-left: 4px solid var(--danger); }
          .notification.info { border-left: 4px solid var(--primary); }
          .notification-content { display: flex; align-items: center; gap: 0.8rem; color: white; }
          .notification i { font-size: 1.2rem; }
          .notification.success i { color: var(--success); }
          .notification.error i { color: var(--danger); }
          .notification.info i { color: var(--primary); }
      `;
      document.head.appendChild(style);

      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
          <div class="notification-content">
              <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
              <span>${message}</span>
          </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
          notification.style.opacity = '1';
          notification.style.transform = 'translateY(0)';
      }, 10);
      
      setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transform = 'translateY(-20px)';
          setTimeout(() => {
              document.body.removeChild(notification);
              document.head.removeChild(style);
          }, 300);
      }, 3000);
  }

  class TaskCalendar {
      constructor() {
          this.currentDate = new Date();
          this.currentView = 'month';
          this.tasks = this.loadTasks();
          this.init();
      }

      init() {
          this.elements = {
              grid: document.getElementById('calendar-grid'),
              monthYear: document.getElementById('currentMonthYear'),
              prevBtn: document.getElementById('prevBtn'),
              nextBtn: document.getElementById('nextBtn'),
              viewButtons: document.querySelectorAll('.view-btn'),
              taskDetailsModal: document.getElementById('taskDetailsModal'),
              closeTaskDetails: document.getElementById('closeTaskDetails'),
              taskTitle: document.getElementById('taskTitle'),
              taskDetailsContent: document.getElementById('taskDetailsContent'),
              completeTaskBtn: document.getElementById('completeTaskBtn'),
              editTaskBtn: document.getElementById('editTaskBtn')
          };
          this.setupEventListeners();
          this.renderCalendar();
      }

<<<<<<< Updated upstream
      setupEventListeners() {
          if (this.elements.prevBtn) {
              this.elements.prevBtn.addEventListener('click', () => this.changeMonth(-1));
          }
          if (this.elements.nextBtn) {
              this.elements.nextBtn.addEventListener('click', () => this.changeMonth(1));
          }
          this.elements.viewButtons.forEach(btn => {
              btn.addEventListener('click', () => {
                  this.elements.viewButtons.forEach(b => b.classList.remove('active'));
                  btn.classList.add('active');
                  this.currentView = btn.dataset.view;
                  this.renderCalendar();
              });
          });
          if (this.elements.closeTaskDetails) {
              this.elements.closeTaskDetails.addEventListener('click', () => this.hideTaskDetails());
          }
          if (this.elements.taskDetailsModal) {
              this.elements.taskDetailsModal.addEventListener('click', (e) => {
                  if (e.target === this.elements.taskDetailsModal) this.hideTaskDetails();
              });
          }
          document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && this.elements.taskDetailsModal?.classList.contains('show')) {
                  this.hideTaskDetails();
              }
          });
          if (this.elements.completeTaskBtn) {
              this.elements.completeTaskBtn.addEventListener('click', () => {
                  showNotification('Задача успешно выполнена!', 'success');
                  this.hideTaskDetails();
                  this.renderCalendar();
              });
          }
          if (this.elements.editTaskBtn) {
              this.elements.editTaskBtn.addEventListener('click', () => {
                  showNotification('Редактирование задачи скоро будет доступно!', 'info');
              });
          }
      }

      loadTasks() {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          return [
              {
                  id: 1,
                  title: 'Создать landing page',
                  description: 'Разработать и сверстать одностраничный сайт для нового продукта',
                  deadline: tomorrow,
                  discipline: 'HTML/CSS',
                  group: 'Веб-разработка',
                  points: 15,
                  isCompleted: false,
                  isGroupTask: true
              },
              {
                  id: 2,
                  title: 'Решить задачу на BFS',
                  description: 'Решить задачу поиска в ширину из учебного курса',
                  deadline: new Date(2026, 5, 12),
                  discipline: 'C++',
                  group: 'Алгоритмы',
                  points: 10,
                  isCompleted: true,
                  isGroupTask: true
              },
              {
                  id: 3,
                  title: 'Подготовить презентацию',
                  description: 'Создать презентацию для защиты проекта',
                  deadline: nextWeek,
                  discipline: 'Soft Skills',
                  group: 'Личное',
                  points: 20,
                  isCompleted: false,
                  isGroupTask: false
              },
              {
                  id: 4,
                  title: 'Реализовать авторизацию',
                  description: 'Добавить систему аутентификации в веб-приложение',
                  deadline: new Date(2026, 5, 18),
                  discipline: 'Django',
                  group: 'Веб-разработка',
                  points: 25,
                  isCompleted: false,
                  isGroupTask: true
              },
              {
                  id: 5,
                  title: 'Реализовать бинарный поиск',
                  description: 'Написать алгоритм бинарного поиска и протестировать его',
                  deadline: new Date(2026, 5, 14),
                  discipline: 'Python',
                  group: 'Алгоритмы',
                  points: 12,
                  isCompleted: false,
                  isGroupTask: true
              },
              ...Array.from({length: 3}, (_, i) => ({
                  id: 100 + i + 1,
                  title: `Задача на сегодня ${i + 1}`,
                  description: `Описание задачи на сегодня ${i + 1}`,
                  deadline: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14 + i, 0),
                  discipline: `Дисциплина ${i + 1}`,
                  group: (i + 1) % 2 === 0 ? 'Личное' : 'Веб-разработка',
                  points: 5 * (i + 1),
                  isCompleted: i === 0,
                  isGroupTask: (i + 1) % 2 !== 0
              })),
              ...Array.from({length: 2}, (_, i) => {
                  const pastDate = new Date(today);
                  pastDate.setDate(today.getDate() - (i + 1));
                  return {
                      id: 200 + i + 1,
                      title: `Просроченная задача ${i + 1}`,
                      description: `Эта задача была просрочена ${i + 1} дня(ей) назад`,
                      deadline: pastDate,
                      discipline: `Просрочено ${i + 1}`,
                      group: 'Важное',
                      points: 8 * (i + 1),
                      isCompleted: false,
                      isGroupTask: true
                  };
              })
          ];
      }

      changeMonth(direction) {
          if (this.currentView === 'month') {
              this.currentDate.setMonth(this.currentDate.getMonth() + direction);
          } else {
              this.currentDate.setDate(this.currentDate.getDate() + (7 * direction));
          }
          this.renderCalendar();
      }
=======
        setupEventListeners() {
            if (this.elements.prevBtn) {
                this.elements.prevBtn.addEventListener('click', () => this.changeMonth(-1));
            }
            if (this.elements.nextBtn) {
                this.elements.nextBtn.addEventListener('click', () => this.changeMonth(1));
            }
            this.elements.viewButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elements.viewButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentView = btn.dataset.view;
                    this.renderCalendar();
                });
            });
        }

        async loadTasks(startDate = null, endDate = null) {
            try {
                if (!startDate || !endDate) {
                    const today = new Date();
                    startDate = new Date(today.getFullYear() - 1, 0, 1);  
                    endDate = new Date(today.getFullYear() + 1, 11, 31);  
                }

                const startParam = startDate.toISOString().split('T')[0];
                const endParam = endDate.toISOString().split('T')[0];
                
                const response = await fetch(`/api/calendar-tasks/?start=${startParam}&end=${endParam}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                return data.map(task => ({
                    ...task,
                    deadline: new Date(task.deadline)
                }));
                
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
                showNotification('Не удалось загрузить задачи.', 'error');
                return [];
            }
        }
>>>>>>> Stashed changes

      renderCalendar() {
          if (!this.elements.grid) return;
          this.updateMonthYearDisplay();
          this.elements.grid.innerHTML = '';
          this.currentView === 'month' ? this.renderMonthView() : this.renderWeekView();
      }

      updateMonthYearDisplay() {
          if (!this.elements.monthYear) return;
          const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
              'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
          
          if (this.currentView === 'month') {
              this.elements.monthYear.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
          } else {
              const startDate = new Date(this.currentDate);
              startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + 6);
              this.elements.monthYear.textContent = `${startDate.getDate()} - ${endDate.getDate()} ${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
          }
      }

      renderMonthView() {
          const year = this.currentDate.getFullYear();
          const month = this.currentDate.getMonth();
          const firstDay = new Date(year, month, 1);
          const startDay = firstDay.getDay() || 7;
          const lastDay = new Date(year, month + 1, 0);
          const daysInMonth = lastDay.getDate();
          const endDay = lastDay.getDay() || 7;
          const prevMonthDays = startDay - 1;
          const nextMonthDays = 7 - endDay;
          const today = new Date();
          const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
          const prevMonth = new Date(year, month - 1, 1);
          const daysInPrevMonth = new Date(year, month, 0).getDate();

          for (let i = prevMonthDays; i > 0; i--) {
              const dayNum = daysInPrevMonth - i + 1;
              this.renderDay(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayNum), true);
          }

          for (let i = 1; i <= daysInMonth; i++) {
              const date = new Date(year, month, i);
              const isToday = isCurrentMonth && i === today.getDate();
              this.renderDay(date, false, isToday);
          }

          const nextMonth = new Date(year, month + 1, 1);
          for (let i = 1; i <= nextMonthDays; i++) {
              this.renderDay(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i), true);
          }
      }

      renderWeekView() {
          const startOfWeek = new Date(this.currentDate);
          const dayOfWeek = startOfWeek.getDay() || 7;
          startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
          const today = new Date();
          const isCurrentWeek = this.isSameWeek(startOfWeek, today);

          for (let i = 0; i < 7; i++) {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + i);
              const isToday = isCurrentWeek && this.isSameDate(date, today);
              this.renderDay(date, false, isToday);
          }
      }

      isSameWeek(date1, date2) {
          const d1 = new Date(date1);
          const d2 = new Date(date2);
          d1.setDate(d1.getDate() - (d1.getDay() || 7) + 1);
          d2.setDate(d2.getDate() - (d2.getDay() || 7) + 1);
          return d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate();
      }

      isSameDate(date1, date2) {
          return date1.getFullYear() === date2.getFullYear() &&
              date1.getMonth() === date2.getMonth() &&
              date1.getDate() === date2.getDate();
      }

      renderDay(date, isOtherMonth = false, isToday = false) {
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day';
          if (isOtherMonth) dayElement.classList.add('other-month');
          if (isToday && !isOtherMonth) dayElement.classList.add('today');

          const dayNumber = document.createElement('div');
          dayNumber.className = 'day-number';
          dayNumber.innerHTML = `<span>${date.getDate()}</span><div class="day-marker"></div>`;
          
          if (isToday && this.currentView === 'month') {
              dayNumber.querySelector('.day-marker').style.backgroundColor = 'var(--primary)';
          }
          
          dayElement.appendChild(dayNumber);

          const dayTasks = this.getTasksForDate(date);
          if (dayTasks.length > 0) {
              dayTasks.sort((a, b) => {
                  if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
                  if (!a.isCompleted && !b.isCompleted) return a.deadline - b.deadline;
                  return 0;
              });

              dayTasks.slice(0, 3).forEach(task => {
                  const taskElement = document.createElement('div');
                  taskElement.className = `task-item-calendar ${task.isGroupTask ? 'group' : 'personal'} ${task.isCompleted ? 'completed' : ''}`;
                  taskElement.dataset.taskId = task.id;
                  
                  const timeStr = task.deadline.getHours() === 0 && task.deadline.getMinutes() === 0
                      ? '' : ` · ${this.formatTime(task.deadline)}`;
                  
                  taskElement.innerHTML = `<div class="task-title">${task.title}<span class="task-time">${timeStr}</span></div>`;
                  taskElement.addEventListener('click', (e) => {
                      e.stopPropagation();
                      this.showTaskDetails(task);
                  });
                  dayElement.appendChild(taskElement);
              });

              if (dayTasks.length > 3) {
                  const moreElement = document.createElement('div');
                  moreElement.className = 'task-item-calendar more-tasks';
                  moreElement.innerHTML = `<i class="fas fa-plus"></i> +${dayTasks.length - 3} еще`;
                  moreElement.addEventListener('click', (e) => {
                      e.stopPropagation();
                      this.showTaskDetails({ date, tasks: dayTasks });
                  });
                  dayElement.appendChild(moreElement);
              }
          } else {
              const noTasks = document.createElement('div');
              noTasks.className = 'no-tasks';
              noTasks.innerHTML = '<i class="fas fa-plus-circle"></i>';
              dayElement.appendChild(noTasks);
          }

          dayElement.addEventListener('click', () => {
              if (!dayElement.querySelector('.no-tasks')) return;
              this.createTaskForDate(date);
          });

          this.elements.grid.appendChild(dayElement);
      }

      getTasksForDate(date) {
          return this.tasks.filter(task => {
              const taskDate = new Date(task.deadline);
              return this.isSameDate(taskDate, date);
          });
      }

      formatTime(date) {
          return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
      }

      formatDate(date) {
          return date.toLocaleDateString('ru', { year: 'numeric', month: 'long', day: 'numeric' });
      }

      formatDeadline(date) {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const taskDate = new Date(date);
          
          [today, tomorrow, taskDate].forEach(d => {
              d.setHours(0, 0, 0, 0);
          });

          if (taskDate.getTime() === today.getTime()) return 'Сегодня';
          if (taskDate.getTime() === tomorrow.getTime()) return 'Завтра';
          return this.formatDate(date);
      }

      getDeadlineClass(date) {
          const now = new Date();
          const deadline = new Date(date);
          const timeDiff = deadline.getTime() - now.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          if (timeDiff < 0) return 'urgent';
          if (daysDiff <= 1) return 'urgent';
          if (daysDiff <= 3) return 'warning';
          return 'normal';
      }

      showTaskDetails(task) {
          if (!task) return;
          
          if (task.tasks) {
              this.renderMultipleTasks(task.date, task.tasks);
          } else {
              this.renderSingleTask(task);
          }
          
          this.elements.taskDetailsModal?.classList.add('show');
          document.body.style.overflow = 'hidden';
      }

<<<<<<< Updated upstream
      renderSingleTask(task) {
          if (!this.elements.taskTitle || !this.elements.taskDetailsContent) return;
          
          this.elements.taskTitle.textContent = task.title;
          const deadlineClass = this.getDeadlineClass(task.deadline);
          
          this.elements.taskDetailsContent.innerHTML = `
              <div class="task-detail-row">
                  <div class="task-detail-label">Дата:</div>
                  <div class="task-detail-value">
                      <span class="deadline-badge ${deadlineClass}">
                          ${this.formatDeadline(task.deadline)} · ${this.formatTime(task.deadline)}
                      </span>
                  </div>
              </div>
              <div class="task-detail-row">
                  <div class="task-detail-label">Группа:</div>
                  <div class="task-detail-value">
                      <span class="group-badge ${task.isGroupTask ? 'group' : 'personal'}">
                          ${task.group}
                      </span>
                  </div>
              </div>
              <div class="task-detail-row">
                  <div class="task-detail-label">Дисциплина:</div>
                  <div class="task-detail-value">${task.discipline}</div>
              </div>
              <div class="task-detail-row">
                  <div class="task-detail-label">Баллы:</div>
                  <div class="task-detail-value">
                      <span class="points-badge">
                          <i class="fas fa-star"></i> ${task.points}
                      </span>
                  </div>
              </div>
              <div class="task-detail-row">
                  <div class="task-detail-label">Описание:</div>
                  <div class="task-detail-value">
                      <div class="task-description">
                          ${task.description || 'Без описания'}
                      </div>
                  </div>
              </div>
              <div class="task-detail-row">
                  <div class="task-detail-label">Статус:</div>
                  <div class="task-detail-value">
                      <span class="status-badge ${task.isCompleted ? 'completed' : 'pending'}">
                          ${task.isCompleted ? 'Выполнено' : 'В процессе'}
                      </span>
                  </div>
              </div>
          `;
          
          if (this.elements.completeTaskBtn) {
              if (task.isCompleted) {
                  this.elements.completeTaskBtn.disabled = true;
                  this.elements.completeTaskBtn.innerHTML = '<i class="fas fa-check"></i> Выполнено';
              } else {
                  this.elements.completeTaskBtn.disabled = false;
                  this.elements.completeTaskBtn.innerHTML = '<i class="fas fa-check"></i> Выполнить';
              }
          }
      }
=======
        showTaskDetails(task) {
             currentTaskId = task.id;  
             
             const modal = document.getElementById('taskDetailsModal');
             document.getElementById('taskTitle').textContent = task.title;
             
             const dateStr = task.deadline.toLocaleDateString('ru-RU');
             const timeStr = task.deadline.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
             
             document.getElementById('taskDetailsContent').innerHTML = `
                <div class="task-detail-row">
                    <div class="task-detail-label">Срок:</div>
                    <div class="task-detail-value">${dateStr} ${timeStr}</div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Группа:</div>
                    <div class="task-detail-value">${task.group}</div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Описание:</div>
                    <div class="task-detail-value">${task.description || '—'}</div>
                </div>
             `;
             
             const btn = document.getElementById('completeTaskBtn');
             if (task.isCompleted) {
                 btn.innerHTML = '<i class="fas fa-check"></i> Выполнено';
                 btn.disabled = true;
             } else {
                 btn.innerHTML = '<i class="fas fa-check"></i> Выполнить';
                 btn.disabled = false;
             }

             modal.classList.add('show');
             document.body.style.overflow = 'hidden';
        }
>>>>>>> Stashed changes

      renderMultipleTasks(date, tasks) {
          if (!this.elements.taskTitle || !this.elements.taskDetailsContent) return;
          
          this.elements.taskTitle.textContent = `Задачи на ${this.formatDate(date)}`;
          let tasksHTML = '';
          
          tasks.forEach(task => {
              const deadlineClass = this.getDeadlineClass(task.deadline);
              const timeStr = this.formatTime(task.deadline);
              tasksHTML += `
                  <div class="task-item-calendar ${task.isGroupTask ? 'group' : 'personal'} ${task.isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
                      <div class="task-content">
                          <div class="task-title">
                              ${task.title}
                              <span class="task-time">${timeStr}</span>
                          </div>
                          <div class="task-meta">
                              <span class="discipline">${task.discipline}</span>
                              <span class="points">
                                  <i class="fas fa-star"></i> ${task.points}
                              </span>
                          </div>
                      </div>
                  </div>
              `;
          });
          
          this.elements.taskDetailsContent.innerHTML = `<div class="tasks-list-full">${tasksHTML}</div>`;
          
          setTimeout(() => {
              document.querySelectorAll('.task-item-calendar[data-task-id]').forEach(item => {
                  item.addEventListener('click', (e) => {
                      e.stopPropagation();
                      const taskId = parseInt(item.dataset.taskId);
                      const task = this.tasks.find(t => t.id === taskId);
                      if (task) this.renderSingleTask(task);
                  });
              });
          }, 100);
      }

      hideTaskDetails() {
          this.elements.taskDetailsModal?.classList.remove('show');
          document.body.style.overflow = 'auto';
      }

      createTaskForDate(date) {
          showNotification(`Создание задачи на ${this.formatDate(date)} скоро будет доступно!`, 'info');
          const taskModal = document.getElementById('taskModal');
          if (taskModal) {
              taskModal.classList.add('show');
              document.body.style.overflow = 'hidden';
              const dateField = taskModal.querySelector('[name="deadline"]');
              if (dateField) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  dateField.value = `${year}-${month}-${day}`;
              }
          }
      }
  }

  if (document.getElementById('calendar-section')?.classList.contains('active')) {
      window.taskCalendar = new TaskCalendar();
  }
});