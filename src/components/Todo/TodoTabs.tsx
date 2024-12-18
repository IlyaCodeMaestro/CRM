import { Tabs, Space } from "antd";
import { TodoInfo } from "../../types/todo";

interface TodoTabsProps {
  filter: "all" | "completed" | "inWork";
  setFilter: (filter: "all" | "completed" | "inWork") => void;
  todoInfo: TodoInfo;
}

const TodoTabs: React.FC<TodoTabsProps> = ({ filter, setFilter, todoInfo }) => {
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

  const containerStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <Space direction="vertical" style={containerStyle}>
      <Tabs
        activeKey={filter}
        onChange={(key) => setFilter(key as "all" | "completed" | "inWork")}
        items={tabs}
      />
    </Space>
  );
};

export default TodoTabs;
