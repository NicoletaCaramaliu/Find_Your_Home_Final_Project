interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Props {
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  addTask: () => void;
}

const TasksSection: React.FC<Props> = ({ tasks, toggleTask, newTaskTitle, setNewTaskTitle, addTask }) => (
  <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
    <h3 className="text-xl font-semibold mb-2">📝 Taskuri comune</h3>
    <ul className="space-y-2 mb-4">
      {tasks.map((task) => (
        <li key={task.id} className="flex justify-between items-center">
          <span>{task.title}</span>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
        </li>
      ))}
    </ul>
    <div className="flex space-x-2">
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Adaugă un task nou..."
        className="flex-1 p-2 border rounded"
      />
      <button
        onClick={addTask}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Adaugă
      </button>
    </div>
  </section>
);

export default TasksSection;