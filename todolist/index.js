// Get DOM elements (defensive: elements may not exist on the simplified main screen)
const taskInput = document.querySelector('input[type="text"]');
const addButton = document.querySelector('.add');
const deleteAllButton = document.querySelector('.delete');
const taskListContainer = document.querySelector('#taskList');

// If required elements are missing, skip wiring up the todo logic.
if (taskInput && addButton && taskListContainer) {
    // Array to store tasks
    let tasks = [];
    let lastAddedTaskId = null;

    // Add task when Add button is clicked
    addButton.addEventListener('click', addTask);

    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Add task function
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            // Add shake animation to input
            taskInput.classList.add('shake');
            setTimeout(() => {
                taskInput.classList.remove('shake');
            }, 500);
            return;
        }

        // Create task object
        const task = {
            id: Date.now(),
            text: taskText
        };

        tasks.push(task);
        lastAddedTaskId = task.id;
        taskInput.value = '';
        renderTasks();
    }

    // Render tasks to the UI
    function renderTasks() {
        taskListContainer.innerHTML = '';

        if (tasks.length === 0) {
            taskListContainer.innerHTML = '<li style="text-align: center; color: #999;">No tasks yet. Add one to get started!</li>';
            return;
        }

        tasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            // Only add animation class to newly added task
            if (task.id === lastAddedTaskId) {
                li.classList.add('new-task');
            }
            li.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-task" data-id="${task.id}">Delete</button>
            `;
            taskListContainer.appendChild(li);
        });

        // Clear the lastAddedTaskId after rendering
        lastAddedTaskId = null;

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-task').forEach((button) => {
            button.addEventListener('click', deleteTask);
        });
    }

    // Delete individual task
    function deleteTask(e) {
        const taskId = parseInt(e.target.dataset.id, 10);
        const taskItem = e.target.closest('li');

        if (taskItem) taskItem.classList.add('removing');

        setTimeout(() => {
            tasks = tasks.filter((task) => task.id !== taskId);
            renderTasks();
        }, 400);
    }

    // Delete all tasks
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', () => {
            if (tasks.length === 0) {
                alert('No tasks to delete');
                return;
            }
            if (confirm('Are you sure you want to delete all tasks?')) {
                tasks = [];
                renderTasks();
            }
        });
    }
}

/* Light bulb ON/OFF cycle (keeps its defensive guard) */
(function bulbController() {
    const bulb = document.getElementById('lightBulb');
    if (!bulb) return;

    let state = 'off';
    const ON_DURATION = 3500;
    const OFF_DURATION = 2200;
    const INITIAL_DELAY = 800;

    function setBulbOn(flicker = true) {
        bulb.classList.remove('off');
        bulb.classList.add('on');
        if (flicker) {
            bulb.classList.add('flicker');
            setTimeout(() => bulb.classList.remove('flicker'), 900);
        }
        state = 'on';
    }

    function setBulbOff() {
        bulb.classList.remove('on');
        bulb.classList.add('off');
        state = 'off';
    }

    function startCycle() {
        setTimeout(() => {
            setBulbOn(true);
            setTimeout(function offThenOn() {
                setBulbOff();
                setTimeout(() => {
                    setBulbOn(true);
                    setTimeout(offThenOn, ON_DURATION);
                }, OFF_DURATION);
            }, ON_DURATION);
        }, INITIAL_DELAY);
    }

    startCycle();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            setBulbOff();
        } else {
            startCycle();
        }
    });
})();
