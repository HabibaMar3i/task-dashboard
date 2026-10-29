const fs = require('fs');
const path = require('path');

const tasksFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tasks.json'), 'utf8')
);

const statsFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'statistics.json'), 'utf8')
);

const tasks = tasksFile.tasks;
const statistics = statsFile.statistics;

// console.log(tasks.length, statistics.length)

const usersById = new Map();
tasks.forEach((task) => {
    usersById.set(task.assignee.id, task.assignee);
});
const users = [...usersById.values()];

// console.log(users.length);

const activities = tasks
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 10)
    .map((task, i) => ({
        id: `act-${String(i + 1).padStart(3, '0')}`,
        taskId: task.id,
        taskTitle: task.title,
        userName: task.assignee.name,
        type: task.status === 'done' ? 'completed' : 'updated',
        timestamp: task.updatedAt,
    }));

// console.log(activities.length, activities[0])

const outDir = path.join(__dirname, '..', 'mock-api');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
    path.join(outDir, 'db.json'),
    JSON.stringify({ tasks, users, activities, statistics }, null, 2)
);
console.log('mock-api/db.json created');