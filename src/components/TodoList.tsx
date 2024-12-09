import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";
import { List } from "antd";
//gfgf
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
    <List
      dataSource={filteredTasks}
      renderItem={(task) => (
        <List.Item key={task.id} style={{ padding: 0, width: '100%' }}>
          <TodoItem
            task={task}
            toggleTask={toggleTask}
            updateTaskText={updateTaskText}
            deleteTask={deleteTask}
          />
        </List.Item>
      )}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    />
  );
};

export default TodoList;