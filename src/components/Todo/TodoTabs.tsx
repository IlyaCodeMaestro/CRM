import { Tabs, Alert } from "antd";
import { TodoInfo } from "../../types/todo";
interface TodoTabsProps {
  error: string;
  success: string;
  filter: "all" | "completed" | "inWork";
  setFilter: (filter: "all" | "completed" | "inWork") => void;
  todoInfo: TodoInfo;
}
//fgfg
const TodoTabs: React.FC<TodoTabsProps> = ({
  error,
  success,
  filter,
  setFilter,
  todoInfo,
}) => {
  const tabs = [
    {
      label: `Всё (${todoInfo.all})`,
      key: "all",
    },
    {
      label: `В работе (${todoInfo.inWork})`,
      key: "inWork",
    },
    {
      label: `Сделано (${todoInfo.completed})`,
      key: "completed",
    },
  ];

  return (
    <div>
      {error && <Alert message={error} type="error" showIcon />}
      {success && <Alert message={success} type="success" showIcon />}
      <Tabs
        activeKey={filter}
        onChange={(key) => setFilter(key as "all" | "completed" | "inWork")}
        items={tabs}
      />
    </div>
  );
};
export default TodoTabs;
