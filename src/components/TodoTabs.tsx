import styles from '../styles/TodoTabs.module.scss';
import { TodoInfo } from '../types/todo';

interface TodoTabsProps {
  error: string;
  success: string;
  filter: "all" | "completed" | "inWork";
  setFilter: (filter: "all" | "completed" | "inWork") => void;
  todoInfo: TodoInfo;
}

const TodoTabs: React.FC<TodoTabsProps> = ({ error, success, filter, setFilter, todoInfo }) => {
  return (
    <div className={styles.tabsContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${filter === "all" ? styles.active : ""}`}
          onClick={() => setFilter("all")}
        >
          Всё ({todoInfo.all})
        </button>
        <button 
          className={`${styles.tab} ${filter === "inWork" ? styles.active : ""}`}
          onClick={() => setFilter("inWork")}
        >
          В работе ({todoInfo.inWork})
        </button>
        <button 
          className={`${styles.tab} ${filter === "completed" ? styles.active : ""}`}
          onClick={() => setFilter("completed")}
        >
          Сделано ({todoInfo.completed})
        </button>
      </div>
    </div>
  );
};

export default TodoTabs;
