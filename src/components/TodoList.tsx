import TodoItem from "./TodoItem";
import styles from "../styles/TodoList.module.scss";
import { Todo } from "../types/todo";

type FilterType = "all" | "completed" | "inWork";
interface TodoListProps {
  tasks: Todo[];
  filter: FilterType;
  toggleTask: (id: number) => void;
  updateTaskText: (id: number, newText: string) => void;
  deleteTask: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  toggleTask,
  updateTaskText,
  deleteTask,
}) => {
  const filterTasks = (tasks: Todo[]) => {
    return tasks;
  };

  const filteredTasks = filterTasks(tasks);

  return (
    <div className={styles.tasksList}>
      {filteredTasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          updateTaskText={updateTaskText}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default TodoList;
