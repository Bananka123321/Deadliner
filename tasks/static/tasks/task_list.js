document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".toggle-desc").forEach(button => {
        button.addEventListener("click", () => {
            const taskItem = button.closest(".task-item");
            const desc = taskItem.querySelector(".task-desc");
            const isOpen = desc.style.display === "block";
            desc.style.display = isOpen ? "none" : "block";
            button.textContent = isOpen ? "▼" : "▲";
        });
    });

    const toggleParticipants = document.querySelector(".toggle-participants");
    const participantsList = document.querySelector(".participants-list");
    toggleParticipants.addEventListener("click", () => {
        const isOpen = participantsList.style.display === "block";
        participantsList.style.display = isOpen ? "none" : "block";
        toggleParticipants.textContent = isOpen ? "Участники ▼" : "Участники ▲";
    });

    const profileButton = document.querySelector(".profile-button");
    const profileMenu = document.querySelector(".profile-menu");
    profileButton.addEventListener("click", () => profileMenu.classList.toggle("open"));

    document.addEventListener("click", (e) => {
        if (!profileMenu.contains(e.target)) profileMenu.classList.remove("open");
    });
});
