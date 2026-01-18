document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('leaders-modal');
    const openBtn = document.getElementById('leaders-card');
    const closeBtn = document.getElementById('leaders-close');

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
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

    openBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    document.getElementById('addMemberForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const groupId = form.dataset.groupId;
        const username = document.getElementById('usernameInput').value.trim();
        const messageEl = document.getElementById('memberMessage');
        console.log("OKOKK");
        if (!username) {
            messageEl.textContent = 'Введите никнейм';
            messageEl.className = 'message error';
            return;
        }

        try {
            const response = await fetch(`/group/${groupId}/add-member/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}`
            });

            const data = await response.json();

            if (response.ok) {
                messageEl.className = 'message success';
                messageEl.textContent = data.message;
            location.reload();
            } else {
                messageEl.className = 'message error';
                messageEl.textContent = data.error || 'Ошибка';
            }
        } catch (err) {
            messageEl.className = 'message error';
            messageEl.textContent = 'Не удалось подключиться к серверу';
        }
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

});
