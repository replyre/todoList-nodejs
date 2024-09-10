const fs = require("fs");
const path = require("path");
const readline = require("readline");

const tasksFile = path.join(__dirname, "tasks.json");

// Function to initialize tasks file if it doesn't exist
function initTasksFile() {
  if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([]));
  }
}

// Function to load tasks from the file
function loadTasks() {
  initTasksFile();
  const data = fs.readFileSync(tasksFile, "utf-8");
  return JSON.parse(data);
}

// Function to save tasks to the file
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// Function to add a new task
function addTask(taskName) {
  const tasks = loadTasks();
  tasks.push({ name: taskName, completed: false });
  saveTasks(tasks);
  console.log(`Task "${taskName}" added!`);
}

// Function to view all tasks
function viewTasks() {
  const tasks = loadTasks();
  console.log("\nTask List:");
  tasks.forEach((task, index) => {
    console.log(
      `${index + 1}. ${task.name} [${task.completed ? "Completed" : "Pending"}]`
    );
  });
}

// Function to mark a task as complete
function markTaskComplete(taskIndex) {
  const tasks = loadTasks();
  if (tasks[taskIndex]) {
    tasks[taskIndex].completed = true;
    saveTasks(tasks);
    console.log(`Task "${tasks[taskIndex].name}" marked as complete!`);
  } else {
    console.log("Invalid task number.");
  }
}

// Function to remove a task
function removeTask(taskIndex) {
  const tasks = loadTasks();
  if (tasks[taskIndex]) {
    const removedTask = tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    console.log(`Task "${removedTask[0].name}" removed!`);
  } else {
    console.log("Invalid task number.");
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main function to display menu and handle user input
function mainMenu() {
  console.log("\n1. Add Task");
  console.log("2. View All Tasks");
  console.log("3. Mark Task Complete");
  console.log("4. Remove Task");
  console.log("5. Exit");

  rl.question("Choose an option: ", (choice) => {
    switch (choice.trim()) {
      case "1":
        rl.question("Enter task name: ", (taskName) => {
          addTask(taskName);
          mainMenu();
        });
        break;
      case "2":
        viewTasks();
        mainMenu();
        break;
      case "3":
        rl.question("Enter task number to mark complete: ", (taskNumber) => {
          markTaskComplete(parseInt(taskNumber) - 1);
          mainMenu();
        });
        break;
      case "4":
        rl.question("Enter task number to remove: ", (taskNumber) => {
          removeTask(parseInt(taskNumber) - 1);
          mainMenu();
        });
        break;
      case "5":
        console.log("Goodbye!");
        rl.close();
        break;
      default:
        console.log("Invalid choice, please try again.");
        mainMenu();
        break;
    }
  });
}

// Start the program
mainMenu();
