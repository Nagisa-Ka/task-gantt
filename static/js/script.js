const taskSelect = document.getElementById("task-id");
const titleInput = document.getElementById("task-title");
const colorInput = document.getElementById("task-color");
const startDateInput = document.getElementById("task-start-date");
const endDateInput = document.getElementById("task-end-date");
const taskForm = document.getElementById("task-form");

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

function parseLocalDate(dateString) {
    const parts = dateString.split("-");

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    return new Date(
        year,
        month - 1,
        day
    );
}

const ganttTasks =
    document.querySelectorAll(".gantt-task");

const taskData = [];
const pixelsPerDay = 40;

function parseLocalDate(dateString) {
    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}

function formatDate(date) {
    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

//全タスクのデータを集める
ganttTasks.forEach(function (taskElement) {

    const startDate =
        parseLocalDate(taskElement.dataset.startDate);

    const endDate =
        parseLocalDate(taskElement.dataset.endDate);

    taskData.push({
        element: taskElement,
        startDate: startDate,
        endDate: endDate
    });

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

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const ganttDates =
        document.getElementById("gantt-dates");

    const chartDuration =
        (
            chartEndDate.getTime()
            - chartStartDate.getTime()
        ) / millisecondsPerDay + 1;

    const ganttChart =
    document.getElementById("gantt-chart");

    ganttChart.style.width =
        `${120 + chartDuration * pixelsPerDay}px`;

    //日付ヘッダー        
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

        const dayOfWeek =
            currentDate.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dateElement.classList.add("weekend");
        }

        ganttDates.appendChild(dateElement);
    }

    //月ヘッダー
    const ganttMonths =
        document.getElementById("gantt-months");

    let currentMonth = null;
    let monthElement = null;
    let monthDayCount = 0;

    for (let day = 0; day < chartDuration; day++) {

        const currentDate =
            new Date(chartStartDate);

        currentDate.setDate(
            chartStartDate.getDate() + day
        );

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();

        const monthKey =
            `${year}-${month}`;

        if (monthKey !== currentMonth) {

            if (monthElement !== null) {
                monthElement.style.width =
                    `${monthDayCount * pixelsPerDay}px`;
            }

            monthElement =
                document.createElement("div");

            monthElement.classList.add("gantt-month");

            monthElement.textContent =
                `${year}年${month + 1}月`;

            ganttMonths.appendChild(monthElement);

            currentMonth = monthKey;
            monthDayCount = 1;

        } else {
            monthDayCount++;
        }
    }

    if (monthElement !== null) {
        monthElement.style.width =
            `${monthDayCount * pixelsPerDay}px`;
    }

    //今日線

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayDifference = 
        today.getTime()
        - chartStartDate.getTime();

    const todayDays =
        todayDifference / millisecondsPerDay;

    if (
        today.getTime() >= chartStartDate.getTime()
        && today.getTime() <= chartEndDate.getTime()
    ) {
        const todayLine =
            document.createElement("div");

        todayLine.classList.add("gantt-today-line");

        const ganttChart =
            document.getElementById("gantt-chart");

        const ganttDates =
            document.getElementById("gantt-dates");

        const chartRect =
            ganttChart.getBoundingClientRect();

        const datesRect =
            ganttDates.getBoundingClientRect();

        const datesLeft =
            datesRect.left - chartRect.left;
        
        const todayPosition = 
            datesLeft + todayDays * pixelsPerDay;

        todayLine.style.left =
            `${todayPosition}px`;

        document
            .getElementById("gantt-chart")
            .appendChild(todayLine);

        const ganttContainer =
            document.getElementById("gantt-container");
            
        ganttContainer.scrollLeft = 
            Math.max(
                0,
                todayPosition - ganttContainer.clientWidth / 2
            );
    }

    
   
   


    //ガントバー

    taskData.forEach(function (task) {
        
        const background =
            task.element.querySelector(".gantt-background");

        for (let day = 0; day < chartDuration; day++) {

            const currentDate =
                new Date(chartStartDate);

            currentDate.setDate(
                chartStartDate.getDate() + day
            );

            const backgroundDay =
                document.createElement("div");

            backgroundDay.classList.add(
                "gantt-background-day"
            );

            const dayOfWeek =
                currentDate.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                backgroundDay.classList.add("weekend");
            }

            background.appendChild(backgroundDay);
        }

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

    //ドラッグ操作

    const ganttBars =
        document.querySelectorAll(".gantt-bar");
    let isDragging = false;
    let startMouseX = 0;
    let startBarLeft = 0;
    let activeBar = null;

    ganttBars.forEach(function (bar) {

        bar.addEventListener("mousedown", function (event) {
            isDragging = true;
            activeBar = bar;

            startMouseX = event.clientX;

            startBarLeft =
                parseFloat(bar.style.left) || 0;
        });

    });

    document.addEventListener("mousemove", function (event) {

        if (!isDragging || activeBar === null) {
            return;
        }

        const differenceX =
            event.clientX - startMouseX;

        const movedDays =
            Math.round(differenceX / pixelsPerDay);

        const maxLeft =
            chartDuration * pixelsPerDay
            - activeBar.offsetWidth;

        const snappedLeft =
            Math.min(
                maxLeft,
                Math.max(
                    0,
                    startBarLeft + movedDays * pixelsPerDay
                )
            );

        activeBar.style.left =
            `${snappedLeft}px`;
    });

    document.addEventListener("mouseup", function () {

        if (!isDragging || activeBar === null) {
            return;
        }

        const finalBarLeft =
            parseFloat(activeBar.style.left) || 0;

        const movedDays =
            Math.round(
                (finalBarLeft - startBarLeft)
                / pixelsPerDay
            );

        const taskElement =
            activeBar.closest(".gantt-task");

        const startDate =
            parseLocalDate(
                taskElement.dataset.startDate
            );

        const endDate =
            parseLocalDate(
                taskElement.dataset.endDate
            );

        startDate.setDate(
            startDate.getDate() + movedDays
        );

        endDate.setDate(
            endDate.getDate() + movedDays
        );

        const taskId =
            taskElement.dataset.id;

        const newStartDate =
            formatDate(startDate);

        const newEndDate =
            formatDate(endDate);

        const originalLeft =
            startBarLeft;
        const draggedBar =
            activeBar;
        
        fetch("/drag-update", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                task_id: taskId,
                start_date: newStartDate,
                end_date: newEndDate
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            if (data.success) {
                taskElement.dataset.startDate =
                    newStartDate;

                taskElement.dataset.endDate =
                    newEndDate;

            } else {
                draggedBar.style.left =
                    `${originalLeft}px`;
            }
        })
        .catch(function (error) {
            console.error("通信エラー:", error);
        });

        isDragging = false;
        activeBar = null;
    });

}

