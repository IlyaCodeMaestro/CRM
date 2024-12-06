import { Tabs, Alert } from "antd";
import { TodoInfo } from "../types/todo";

const { TabPane } = Tabs;

interface TodoTabsProps {
  error: string;
  success: string;
  filter: "all" | "completed" | "inWork";
  setFilter: (filter: "all" | "completed" | "inWork") => void;
  todoInfo: TodoInfo;
}

const TodoTabs: React.FC<TodoTabsProps> = ({
  error,
  success,
  filter,
  setFilter,
  todoInfo,
}) => {
  return (
    <div>
      {error && <Alert message={error} type="error" showIcon />}
      {success && <Alert message={success} type="success" showIcon />}
      <Tabs
        activeKey={filter}
        onChange={(key) => setFilter(key as "all" | "completed" | "inWork")}
      >
        <TabPane tab={`Всё (${todoInfo.all})`} key="all" />
        <TabPane tab={`В работе (${todoInfo.inWork})`} key="inWork" />
        <TabPane tab={`Сделано (${todoInfo.completed})`} key="completed" />
      </Tabs>
    </div>
  );
};

export default TodoTabs;
