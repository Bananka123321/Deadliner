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
  
  function animateNeonCards() {
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      setTimeout(() => {
        if (card.classList.contains('neon-success')) {
          card.style.boxShadow = '0 0 0 rgba(0,0,0,0), var(--neon-success)';
        } else if (card.classList.contains('neon-streak')) {
          card.style.boxShadow = '0 0 0 rgba(0,0,0,0), var(--neon-streak)';
        } else if (card.classList.contains('neon-warning')) {
          card.style.boxShadow = '0 0 0 rgba(0,0,0,0), var(--neon-warning)';
        }
      }, 300 * index);
    });
  }

  document.querySelectorAll('.task-group.clickable').forEach(card => {
    card.addEventListener('click', (e) => {
        if (
            e.target.closest('button') ||
            e.target.closest('a') ||
            e.target.closest('form')
        ) {
            return;
        }

        const href = card.dataset.href;
        if (href) {
            window.location.href = href;
        }
    });
  });

  const taskModal = document.getElementById('taskModal');
  const openBtn = document.getElementById('openTaskModal');
  const closeBtn = document.getElementById('closeTaskModal');
  const cancelBtn = document.getElementById('cancelTaskModal');
  const modalContent = taskModal.querySelector('.modal-content.task-modal');

  openBtn.addEventListener('click', () => {
    taskModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      document.querySelectorAll('.form-group').forEach(group => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(10px)';
      });
      
      setTimeout(() => {
        modalContent.classList.add('show');
      }, 50);
    }, 300);
  });

  function closeModal() {
    modalContent.classList.remove('show');
    setTimeout(() => {
      taskModal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }, 300);
  }

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && taskModal.classList.contains('show')) {
      closeModal();
    }
  });

const groupModal = document.getElementById('groupModal');
const openGroupBtn = document.getElementById('openGroupModal');
const closeGroupBtn = document.getElementById('closeGroupModal');
const cancelGroupBtn = document.getElementById('cancelGroupModal');
const groupModalContent = groupModal.querySelector('.modal-content');

if (openGroupBtn) {
  openGroupBtn.addEventListener('click', () => {
    groupModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      groupModalContent.classList.add('show');
    }, 50);
  });
}

function closeGroupModal() {
  groupModalContent.classList.remove('show');
  setTimeout(() => {
    groupModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }, 300);
}

if (closeGroupBtn) closeGroupBtn.addEventListener('click', closeGroupModal);
if (cancelGroupBtn) cancelGroupBtn.addEventListener('click', closeGroupModal);

groupModal.addEventListener('click', (e) => {
  if (e.target === groupModal) closeGroupModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (groupModal.classList.contains('show')) closeGroupModal();
  }
});

  setTimeout(animateNeonCards, 1000);
  setInterval(animateNeonCards, 5000);
});