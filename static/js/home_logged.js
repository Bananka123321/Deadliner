document.addEventListener('DOMContentLoaded', () => {
  
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

  
  const modal = document.getElementById('taskModal');
  const modalTitle = document.getElementById('modal-title');
  const modalTasks = document.getElementById('modal-tasks');
  const closeModalBtn = modal.querySelector('.modal-close');

  document.querySelectorAll('.task-group').forEach(group => {
    group.addEventListener('click', (e) => {
    if(e.target.tagName.toLowerCase() === 'button') return;

    const groupName = group.querySelector('.group-header h3').textContent;
    const tasks = group.querySelectorAll('.task-item');

    modalTitle.textContent = `Задачи: ${groupName}`;
    modalTasks.innerHTML = '';

    tasks.forEach(task => {
      const taskClone = task.cloneNode(true);
      const icon = taskClone.querySelector('.task-icon');

      if(icon) {
        icon.style.fontSize = '1.4rem';
      }

      modalTasks.appendChild(taskClone);
    });

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    });
    });

  
  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  
  function animateNeonCards() {
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      setTimeout(() => {
        card.style.boxShadow = getComputedStyle(card).getPropertyValue('--neon-shadow') || card.style.boxShadow;
      }, 300 * index);
    });
  }

  setTimeout(animateNeonCards, 1000);
  setInterval(animateNeonCards, 5000);
});
