document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('click', () => {
            item.style.textDecoration = 'line-through';
        });
    });
});
