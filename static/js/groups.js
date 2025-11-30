document.addEventListener("DOMContentLoaded", () => {
    const modalBg = document.getElementById("modal-bg");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeBtn = document.getElementById("modal-close");

    function openModal(groupId, groupName) {
        modalTitle.textContent = groupName;

        fetch(`/groups/${groupId}/tasks/`)
            .then(res => res.json())
            .then(data => {
                renderTasks(data);
                modalBg.classList.remove("hidden");
                document.body.style.overflow = "hidden";
            });
    }

    function closeModal() {
        modalBg.classList.add("hidden");
        document.body.style.overflow = "";
    }

    function renderTasks(data) {
        let html = "";

        for (const [discipline, tasks] of Object.entries(data)) {
            html += `
                <div class="mb-8">
                    <h3 class="text-lg font-bold text-emerald-800 mb-3 flex items-center">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        ${discipline}
                    </h3>
                    <ul class="space-y-3">
                        ${tasks.map(t => renderTask(t)).join("")}
                    </ul>
                </div>
            `;
        }

        modalContent.innerHTML = html;

        document.querySelectorAll(".task-checkbox").forEach(cb => {
            cb.addEventListener("change", toggleTaskStatus);
        });
    }

    function renderTask(task) {
        return `
            <li class="border border-emerald-100 rounded-xl p-4 bg-white/50">
                <div class="flex items-start">
                    <input 
                        type="checkbox"
                        class="task-checkbox w-5 h-5 mr-3 mt-1"
                        data-id="${task.id}"
                        ${task.completed ? "checked" : ""}
                    >
                    <div class="flex-1">
                        <p class="font-medium">${task.title}</p>
                        <p class="text-sm text-emerald-600 mt-1">
                            ${task.status_label}
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                            до ${task.deadline}
                        </p>
                    </div>
                </div>
            </li>
        `;
    }

    function toggleTaskStatus(e) {
        const taskId = e.target.dataset.id;

        fetch(`/tasks/${taskId}/toggle/`, {
            method: "POST",
            headers: { "X-CSRFToken": getCSRF() },
        });
    }

    function getCSRF() {
        return document.cookie
            .split("; ")
            .find(r => r.startsWith("csrftoken"))
            ?.split("=")[1];
    }

    document.querySelectorAll(".group-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.groupId;
            const name = card.querySelector("h2").textContent;
            openModal(id, name);
        });
    });

    closeBtn.addEventListener("click", closeModal);

    modalBg.addEventListener("click", e => {
        if (e.target === modalBg) closeModal();
    });
});
