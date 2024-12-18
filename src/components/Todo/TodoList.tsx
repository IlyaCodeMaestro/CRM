import TodoItem from "./TodoItem";
import { Todo } from "../../types/todo";
import { List } from "antd";

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

  const listStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const listItemStyle: React.CSSProperties = {
    padding: 0,
    width: "100%",
  };

  return (
    <List
      dataSource={filteredTasks}
      renderItem={(task) => (
        <List.Item key={task.id} style={listItemStyle}>
          <TodoItem
            task={task}
            toggleTask={toggleTask}
            updateTaskText={updateTaskText}
            deleteTask={deleteTask}
          />
        </List.Item>
      )}
      style={listStyle}
    />
  );
};

export default TodoList;
