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
    taskForm: document.getElementById('taskForm')
  };
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

  function animateNeonCards() {
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      setTimeout(() => {
        if (card.classList.contains('neon-success')) {
          card.style.boxShadow = `var(--shadow-md), var(--neon-success)`;
        } else if (card.classList.contains('neon-streak')) {
          card.style.boxShadow = `var(--shadow-md), var(--neon-streak)`;
        } else if (card.classList.contains('neon-warning')) {
          card.style.boxShadow = `var(--shadow-md), var(--neon-warning)`;
        }
        
        setTimeout(() => {
          card.style.boxShadow = 'var(--shadow-md)';
        }, 1500);
      }, 300 * index);
    });
  }

  setTimeout(animateNeonCards, 1000);

  document.querySelectorAll('.task-group.clickable').forEach(card => {
    card.addEventListener('click', (e) => {
      if (
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('form') ||
        e.target.closest('.task-item')
      ) {
        return;
      }

      const href = card.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });

  if (elements.groupModal && elements.openGroupBtn) {
    const modalContent = elements.groupModal.querySelector('.modal-content.group-modal');
    const formGroups = elements.groupModal.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
      group.style.opacity = '0';
      group.style.transform = 'translateY(10px)';
      group.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    
    const openModal = () => {
      elements.groupModal.classList.add('show');
      document.body.style.overflow = 'hidden';
      
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
    };

    elements.openGroupBtn.addEventListener('click', openModal);

    const closeModal = () => {
      formGroups.forEach((group, index) => {
        setTimeout(() => {
          group.style.opacity = '0';
          group.style.transform = 'translateY(10px)';
        }, index * 30);
      });
      
      setTimeout(() => {
        elements.groupModal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }, 300);
    };

    if (elements.closeGroupBtn) elements.closeGroupBtn.addEventListener('click', closeModal);
    if (elements.cancelGroupBtn) elements.cancelGroupBtn.addEventListener('click', closeModal);

    elements.groupModal.addEventListener('click', (e) => {
      if (e.target === elements.groupModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.groupModal.classList.contains('show')) {
        closeModal();
      }
    });

    if (elements.groupForm) {
      elements.groupForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.85';
          
          setTimeout(() => {
            this.reset();
            closeModal();
            
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Создать группу';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            
            showNotification('Группа успешно создана!', 'success');
          }, 1500);
        }
      });
    }
  }

  if (elements.taskModal && elements.openTaskBtn) {
    const modalContent = elements.taskModal.querySelector('.modal-content.task-modal');
    const formGroups = elements.taskModal.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
      group.style.opacity = '0';
      group.style.transform = 'translateY(10px)';
      group.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    
    const openModal = () => {
      elements.taskModal.classList.add('show');
      document.body.style.overflow = 'hidden';
      
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
    };

    elements.openTaskBtn.addEventListener('click', openModal);

    const closeModal = () => {
      formGroups.forEach((group, index) => {
        setTimeout(() => {
          group.style.opacity = '0';
          group.style.transform = 'translateY(10px)';
        }, index * 30);
      });
      
      setTimeout(() => {
        elements.taskModal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }, 300);
    };

    if (elements.closeTaskBtn) elements.closeTaskBtn.addEventListener('click', closeModal);
    if (elements.cancelTaskBtn) elements.cancelTaskBtn.addEventListener('click', closeModal);

    elements.taskModal.addEventListener('click', (e) => {
      if (e.target === elements.taskModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.taskModal.classList.contains('show')) {
        closeModal();
      }
    });

    if (elements.taskForm) {
      elements.taskForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.85';
          
          setTimeout(() => {
            if (!this.checkValidity()) {
              submitBtn.innerHTML = '<i class="fas fa-plus"></i> Создать задачу';
              submitBtn.disabled = false;
              submitBtn.style.opacity = '1';
            }
          }, 1000);
        }
      });
    }
  }

  function showNotification(message, type = 'info') {
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
      }, 300);
    }, 3000);
    
    if (!document.getElementById('notification-styles')) {
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
        
        .notification.success {
          border-left: 4px solid var(--success);
        }
        
        .notification.error {
          border-left: 4px solid var(--danger);
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: white;
        }
        
        .notification i {
          font-size: 1.2rem;
        }
        
        .notification.success i {
          color: var(--success);
        }
        
        .notification.error i {
          color: var(--danger);
        }
      `;
      document.head.appendChild(style);
    }
  }
});