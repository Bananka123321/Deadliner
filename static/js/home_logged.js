document.addEventListener('DOMContentLoaded', () => {
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

        completeTaskBtn: document.getElementById('completeTaskBtn'),
        editTaskBtn: document.getElementById('editTaskBtn'),
        taskDetailsModal: document.getElementById('taskDetailsModal'),
        closeTaskDetails: document.getElementById('closeTaskDetails'),
        taskTitle: document.getElementById('taskTitle'),
        taskDetailsContent: document.getElementById('taskDetailsContent'),

        menuToggle: document.getElementById('menuToggle')
    };
    
    let currentTaskId = null;
    let currentTaskFullData = null;
    
    const menuItems = document.querySelectorAll('.menu li[data-section]');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.querySelector('.sidebar');

    const menuToggle = elements.menuToggle;
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            menuToggle.querySelector('i').className = 
            sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

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

    document.querySelectorAll('.task-group.clickable').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button,a,form,.list-task-item,.task-item')) return;  
            const href = card.dataset.href;
            if (href) window.location.href = href;
        });
    });

    function closeAnyModal(modal) {
        if (!modal || !modal.classList.contains('show')) return;

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('show');
        }

        modal.classList.remove('show');
        document.body.style.overflow = 'auto';

        const form = modal.querySelector('form');
        if (form) form.reset();
        }

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            const activeModal = document.querySelector('.modal-overlay.show, .task-details-modal.show');
            if (activeModal){    
                closeAnyModal(activeModal);
            }
        }
    })

    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('modal-overlay') || target.classList.contains('task-details-modal')) {
            closeAnyModal(target);
            return;
        }

        const closeButton = target.closest('.modal-close, .btn-secondary#cancelGroupModal, .btn-secondary#cancelTaskModal');

        if (closeButton) {
            const modal = closeButton.closest('.modal-overlay, .task-details-modal');
            if (modal) {
                closeAnyModal(modal);
            }
        }
    })

    function resetTaskModalToDefault() {
        const form = elements.taskForm;
        const modal = elements.taskModal;
        if (!form || !modal) return;

        const titleH3 = modal.querySelector('h3');
        if (titleH3) titleH3.innerHTML = '<i class="fas fa-tasks"></i> Новая задача';

        form.action = "/tasks/create/"; 

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Создать задачу';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }

        form.reset();
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

    function openTaskModalFromList(taskElement) {
        const data = taskElement.dataset;
        currentTaskId = data.id;

        const parseBoolean = (val) => {
             return val === 'true' || val === 'True' || val === '1' || val === true || val === 1;
        };

        const isCompleted = parseBoolean(data.isCompleted);

        currentTaskFullData = {
            id: data.id,
            title: data.title,
            description: data.description,
            deadline: data.deadline, 
            discipline: data.discipline,
            points: data.points,
            group: data.group,
            isCompleted: isCompleted            
        }

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

        const btn = elements.completeTaskBtn;
        const now = new Date();

        btn.className = 'btn-primary';
         
        if (isCompleted) {
            btn.innerHTML = '<i class="fas fa-check-double"></i> Выполнено';
            btn.classList.add('btn-secondary');
        } else if (dateObj < now) {
            btn.innerHTML = '<i class="fas fa-fire"></i> Просрочено';
            btn.classList.add('btn-expired');
        } else {
            btn.innerHTML = '<i class="fas fa-check"></i> Выполнить';
        }

        elements.taskDetailsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('.list-task-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();  
            openTaskModalFromList(item);
        });
    });

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
    
    function openCommonTaskModal(date = null) {
        const modal = elements.taskModal;
        const form = elements.taskForm;

        resetTaskModalToDefault();

        if (date) {
            const dateField = form.querySelector('[name="deadline"]');
            dateField.value = formatDateTimeForInput(date);
        }
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        const formGroups = modal.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(10px)';
        });

        setTimeout(() => {
            formGroups.forEach((group, index) => {
                setTimeout(() => {
                    group.style.opacity = '1';
                    group.style.transform = 'translateY(0)';
                }, 100 + (index * 70));
            });
        }, 100);
    } 

    setupModal(elements.groupModal, elements.openGroupBtn, elements.closeGroupBtn, elements.cancelGroupBtn, elements.groupForm, 'Группа успешно создана!');
    setupModal(elements.taskModal, null, elements.closeTaskBtn, elements.cancelTaskBtn, elements.taskForm, 'Задача успешно создана!');

    if (elements.openTaskBtn) {
        elements.openTaskBtn.addEventListener('click', () => {
            openCommonTaskModal(null); 
        });
    }

    function setupModal(modal, openBtn, closeBtn, cancelBtn, form, successMessage) {
        if (!modal) return;

        const modalContent = modal.querySelector('.modal-content');

        const openModal = () => {
            if (form) form.reset();

            modal.classList.add('show');
            if (modalContent) modalContent.classList.add('show');
            document.body.style.overflow = 'hidden';

            const formGroups = modal.querySelectorAll('.form-group');
            formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(10px)';
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 100 + index * 70);
            });
        };

        if (openBtn) {
            openBtn.addEventListener('click', openModal);
        }

        [closeBtn, cancelBtn].forEach(btn => {
            if (btn) {
            btn.addEventListener('click', () => closeAnyModal(modal));
            }
        });

        if (form) {
            form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
                submitBtn.disabled = true;
            }
            });
        }
        }

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

    document.getElementById('completeTaskBtn').addEventListener('click', (e) => {
        e.preventDefault(); 
        if (currentTaskId) {
            completeTask(currentTaskId);
        }
    });

    async function completeTask(taskId) {
        const btn = elements.completeTaskBtn;

        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';

        try {
            const response = await fetch(`/toggle-task/${taskId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();

            if (!response.ok || data.status !== 'success') {
                throw new Error(data.message || 'Ошибка сервера');
            }

            const newStatus = data.isCompleted; 

            btn.disabled = false;
            if (newStatus) {
                btn.innerHTML = '<i class="fas fa-check-double"></i> Выполнено';
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-expired'); 
            } else {
                btn.innerHTML = '<i class="fas fa-check"></i> Выполнить';
                btn.classList.remove('btn-secondary');
            }

            if (window.taskCalendar && window.taskCalendar.tasks) {
                const task = window.taskCalendar.tasks.find(t => t.id == taskId); 
                if (task) {
                    task.isCompleted = newStatus;
                    window.taskCalendar.renderCalendar();
                }
            }

            const listItem = document.querySelector(`.list-task-item[data-id="${taskId}"]`);
            if (listItem) {
                listItem.dataset.isCompleted = newStatus.toString();
                if (newStatus) {
                    listItem.classList.add('completed'); 
                } else {
                    listItem.classList.remove('completed');
                }
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            alert('Ошибка соединения с сервером');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    function formatDateTimeForInput(date) {
        if (!date) return '' 
        
        const d = date;

        formattedDateTime  = ``;
        
        try{
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');

            formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        } 
        catch 
        {
            const datas = new Date(date);

            const year = datas.getUTCFullYear();     
            const month = datas.getUTCMonth() + 1;  
            const day = datas.getUTCDate();        
            const hours = datas.getUTCHours();     
            const minutes = datas.getUTCMinutes(); 

            formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        return formattedDateTime;
        
    }

    function openEditTaskModal(taskData) {
        closeAnyModal(elements.taskDetailsModal);

        const modal = elements.taskModal;
        const modalContent = modal.querySelector('.modal-content.task-modal');
        const form = elements.taskForm;

        modal.querySelector('h3').innerHTML = '<i class="fas fa-edit"></i> Редактирование задачи';
        form.action = `/tasks/edit/${taskData.id}/`;         

        form.querySelector('[name="title"]').value = taskData.title || '';
        form.querySelector('[name="description"]').value = taskData.description || '';
        form.querySelector('[name="discipline"]').value = taskData.discipline || '';
        form.querySelector('[name="deadline"]').value = formatDateTimeForInput(taskData.deadline);
        form.querySelector('[name="points"]').value = taskData.points || '';
        if (taskData.group) {
            form.querySelector('[name="group"]').value = taskData.group;
        }

        modal.querySelector('.modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Редактирование задачи';
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Сохранить изменения';

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        console.log(modalContent);

        if (modalContent) {
            modalContent.classList.add('show');
        }
    }


    document.getElementById('editTaskBtn').addEventListener('click', () => {

        console.log(currentTaskFullData);

        openEditTaskModal(currentTaskFullData);
    });


    class TaskCalendar {
        constructor() {
            this.currentDate = new Date();
            this.currentView = 'month';
            this.tasks = [];
            this.init();
        }

        async init() {
            this.elements = {
                grid: document.getElementById('calendar-grid'),
                monthYear: document.getElementById('currentMonthYear'),
                prevBtn: document.getElementById('prevBtn'),
                nextBtn: document.getElementById('nextBtn'),
                viewButtons: document.querySelectorAll('.view-btn'),
                taskDetailsModal: document.getElementById('taskDetailsModal'),
                closeTaskDetails: document.getElementById('closeTaskDetails'),
                taskTitle: document.getElementById('taskTitle'),    
                completeTaskBtn: document.getElementById('completeTaskBtn'),
                taskDetailsContent: document.getElementById('taskDetailsContent')
            };
            this.setupEventListeners();
            this.tasks = await this.loadTasks();
            this.renderCalendar();
        }        

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
                    startDate = new Date(today.getFullYear() - 1, 0, 1); //Год назад
                    endDate = new Date(today.getFullYear() + 1, 11, 31); //Год вперед
                }

                const startParam = startDate.toISOString().split('T')[0];
                const endParam = endDate.toISOString().split('T')[0];
                
                const response = await fetch(`/api/calendar-tasks/?start=${startParam}&end=${endParam}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return data.map(task => {
                    const rawStatus = task.isCompleted ?? task.is_completed ?? task.completed ?? task.status;
                    let isCompletedBool = false;

                    if (typeof rawStatus === 'string') {
                        isCompletedBool = rawStatus.toLowerCase() === 'true' || rawStatus === '1';
                    } else if (typeof rawStatus === 'number') {
                        isCompletedBool = rawStatus === 1;
                    } else {
                        isCompletedBool = Boolean(rawStatus);
                    }

                    return {
                        ...task,
                        deadline: new Date(task.deadline),
                        isCompleted: isCompletedBool
                    };
                });
                
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
                showNotification('Не удалось загрузить задачи.', 'error');
            }
        }

        async changeMonth(direction) {
            const oldDate = new Date(this.currentDate);
            
            if (this.currentView === 'month') {
                this.currentDate.setMonth(this.currentDate.getMonth() + direction);
            } else {
                this.currentDate.setDate(this.currentDate.getDate() + (7 * direction));
            }
            
            const monthDiff = this.currentDate.getMonth() - oldDate.getMonth() + 12 * (this.currentDate.getFullYear() - oldDate.getFullYear());
            
            if (Math.abs(monthDiff) >= 1) {
                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month + 2, 0);
                
                this.tasks = await this.loadTasks(startDate, endDate);
            }
            
            this.renderCalendar();
        }

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
            currentTaskId = task.id;
            elements.taskTitle.innerText = task.title;

            if (!task) return;
            
            if (task.tasks) {
                this.renderMultipleTasks(task.date, task.tasks);
            } else {
                this.renderSingleTask(task);
            }
            
            this.elements.taskDetailsModal?.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        renderSingleTask(task) {
            if (!this.elements.taskTitle || !this.elements.taskDetailsContent) return;

            currentTaskFullData = task;
            currentTaskId = task.id;

            this.elements.taskTitle.textContent = task.title;
            const deadlineClass = this.getDeadlineClass(task.deadline);
            
            this.elements.taskDetailsContent.innerHTML = `
                <div class="task-detail-row">
                    <div class="task-detail-label">Дата: </div>
                    <div class="task-detail-value">
                        <span class="deadline-badge ${deadlineClass}">
                            ${this.formatDeadline(task.deadline)} · ${this.formatTime(task.deadline)}
                        </span>
                    </div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Группа: </div>
                    <div class="task-detail-value">
                        <span class="group-badge ${task.isGroupTask ? 'group' : 'personal'}">
                            ${task.group}
                        </span>
                    </div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Дисциплина: </div>
                    <div class="task-detail-value">${task.discipline || ' —'}</div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Баллы: </div>
                    <div class="task-detail-value">
                        <span class="points-badge">
                            <i class="fas fa-star"></i> ${task.points}
                        </span>
                    </div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Описание: </div>
                    <div class="task-detail-value">
                        <div class="task-description">
                            ${task.description || 'Без описания'}
                        </div>
                    </div>
                </div>
                <div class="task-detail-row">
                    <div class="task-detail-label">Статус: </div>
                    <div class="task-detail-value">
                        <span class="status-badge ${task.isCompleted ? 'completed' : 'pending'}">
                            ${task.isCompleted ? 'Выполнено' : 'В процессе'}
                        </span>
                    </div>
                </div>
            `;
            
            const btn = this.elements.completeTaskBtn;
            const now = new Date();

            btn.className = 'btn-primary';
            btn.disabled = false;


            if (task.isCompleted) {
                // btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-check-double"></i> Выполнено';
                btn.classList.add('btn-secondary');
            } else if (task.deadline < now) {
                // btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-clock"></i> Просрочено';
                btn.classList.add('btn-expired');
            } else {
                // btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check"></i> Выполнить';
            }
        }

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
            openCommonTaskModal(date);
        }
    }

    if (document.getElementById('calendar-section')?.classList.contains('active')) {
        async function initCalendar() {
            if (window.taskCalendar) return;
            
            const calendarElement = document.getElementById('calendar-grid');
            if (!calendarElement) return;
            
            try {
                window.taskCalendar = new TaskCalendar();
            } catch (error) {
                console.error('Ошибка инициализации календаря:', error);
                showNotification('Не удалось загрузить календарь', 'error');
            }
        }
    }

});