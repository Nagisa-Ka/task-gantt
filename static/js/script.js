const taskSelect = document.getElementById("task-id");
const titleInput = document.getElementById("task-title");
const colorInput = document.getElementById("task-color");
const startDateInput = document.getElementById("task-start-date");
const endDateInput = document.getElementById("task-end-date");

taskSelect.addEventListener("change", function () {
    const selectedOption =
        taskSelect.options[taskSelect.selectedIndex];

    if (selectedOption.value === "") {
        titleInput.value = "";
        colorInput.value = "#4a90e2";
        startDateInput.value = "";
        endDateInput.value = "";

        return;
    }

    titleInput.value = selectedOption.dataset.title;
    colorInput.value = selectedOption.dataset.color;
    startDateInput.value = selectedOption.dataset.startDate;
    endDateInput.value = selectedOption.dataset.endDate;
});

const taskForm = document.getElementById("task-form");

taskForm.addEventListener("submit", function (event) {
    const clickedButton = event.submitter;

    if (clickedButton.id !== "task-delete-button") {
        return;
    }

    const selectedOption =
        taskSelect.options[taskSelect.selectedIndex];

    if (!selectedOption || selectedOption.value === "") {
        event.preventDefault();
        alert("削除するタスクを選択してください");
        return;
    }

    const taskTitle = selectedOption.textContent.trim();

    const confirmed = confirm(
        `「${taskTitle}」を削除しますか？`
    );

    if (!confirmed) {
        event.preventDefault();
    }
});

const ganttTasks = document.querySelectorAll(".gantt-task");
const taskData = [];

ganttTasks.forEach(function (taskElement) {
    const startDate = new Date(
        taskElement.dataset.startDate
    );

    const endDate = new Date(
        taskElement.dataset.endDate
    );

    taskData.push({
        element: taskElement,
        startDate: startDate,
        endDate: endDate
    });

    if (taskData.length > 0) {
        const chartStartDate = new Date(
            Math.min(
                ...taskData.map(function (task) {
                    return task.startDate.getTime();
                })
            )
        );

        const chartEndDate = new Date(
            Math.max(
                ...taskData.map(function (task) {
                    return task.endDate.getTime();
                })
            )
        );
    
        const pixelsPerDay = 40;
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const ganttDates =
            document.getElementById("gantt-dates");

        const chartDuration =
            (
                chartEndDate.getTime()
                - chartStartDate.getTime()
            ) / millisecondsPerDay + 1;

        for (let day = 0; day < chartDuration; day++) {
            const currentDate =
                new Date(chartStartDate);

            currentDate.setDate(
                chartStartDate.getDate() + day
            );

            const dateElement =
                document.createElement("div");

            dateElement.classList.add("gantt-date");

            dateElement.textContent =
                `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

            ganttDates.appendChild(dateElement);
        }

        taskData.forEach(function (task) {
            const startDifference =
                task.startDate.getTime()
                - chartStartDate.getTime();

            const durationDifference =
                task.endDate.getTime()
                - task.startDate.getTime();

            const startDays =
                startDifference / millisecondsPerDay;

            const durationDays =
                durationDifference / millisecondsPerDay + 1;

            const ganttBar =
                task.element.querySelector(".gantt-bar");

            ganttBar.style.left =
                `${startDays * pixelsPerDay}px`;

            ganttBar.style.width =
                `${durationDays * pixelsPerDay}px`;

            ganttBar.style.backgroundColor =
                task.element.dataset.color;
        });
    }
});