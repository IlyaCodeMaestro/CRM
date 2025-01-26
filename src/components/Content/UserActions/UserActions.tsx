import { useNavigate } from "react-router-dom";
import {
  blockUser,
  deleteUser,
  unblockUser,
  updateUserRights,
} from "../../../api/adminAPI/adminApi";
import { Button, Modal, notification } from "antd";
import { Trash2, Lock, Unlock, UserPlus, UserMinus, User } from "lucide-react";
import styles from "./UserActions.module.scss"

interface UserActionsProps {
  id: number
  isAdmin: boolean
  isBlocked: boolean
  updateTable: () => void
}

const UserActions: React.FC<UserActionsProps> = ({ id, isAdmin, isBlocked, updateTable }) => {
  const navigate = useNavigate()

  const showNotification = (type: "success" | "error", message: string, description: string) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    })
  }

  const showConfirmModal = (title: string, content: string, onOk: () => void) => {
    Modal.confirm({
      title,
      content: <div className={styles.modalContent}>{content}</div>,
      onOk,
      okText: "Да",
      cancelText: "Нет",
      width: 400,
    })
  }

  const deleteHandler = async () => {
    showConfirmModal(
      "Удаление пользователя",
      "Вы действительно хотите удалить этого пользователя? Это действие нельзя отменить.",
      async () => {
        try {
          await deleteUser(String(id))
          updateTable()
          showNotification("success", "Успешно", "Пользователь удален")
        } catch {
          showNotification("error", "Ошибка", "Не удалось удалить пользователя")
        }
      },
    )
  }

  const blockHandler = async () => {
    showConfirmModal(
      isBlocked ? "Разблокировка пользователя" : "Блокировка пользователя",
      isBlocked
        ? "Вы уверены, что хотите разблокировать этого пользователя?"
        : "Вы уверены, что хотите заблокировать этого пользователя?",
      async () => {
        try {
          if (isBlocked) {
            await unblockUser(String(id))
            showNotification("success", "Успешно", "Пользователь разблокирован")
          } else {
            await blockUser(String(id))
            showNotification("success", "Успешно", "Пользователь заблокирован")
          }
          updateTable()
        } catch {
          showNotification("error", "Ошибка", "Не удалось изменить статус блокировки")
        }
      },
    )
  }

  const rolesHandler = async () => {
    showConfirmModal(
      isAdmin ? "Отзыв прав администратора" : "Предоставление прав администратора",
      isAdmin
        ? "Вы уверены, что хотите отозвать права администратора у этого пользователя?"
        : "Вы уверены, что хотите предоставить права администратора этому пользователю?",
      async () => {
        try {
          if (isAdmin) {
            await updateUserRights(String(id), {
              field: "isAdmin",
              value: "false",
            })
            showNotification("success", "Успешно", "Права администратора отозваны")
          } else {
            await updateUserRights(String(id), {
              field: "isAdmin",
              value: "true",
            })
            showNotification("success", "Успешно", "Права администратора предоставлены")
          }
          updateTable()
        } catch {
          showNotification("error", "Ошибка", "Не удалось изменить права пользователя")
        }
      },
    )
  }

  return (
    <div className={styles.container}>
      <Button
        onClick={() => navigate(`${id}`)}
        className={`${styles.button} ${styles.profile}`}
        icon={<User size={20} />}
      />
      <Button onClick={deleteHandler} className={`${styles.button} ${styles.delete}`} icon={<Trash2 size={20} />} />
      <Button
        onClick={blockHandler}
        className={`${styles.button} ${styles.block}`}
        icon={isBlocked ? <Unlock size={20} /> : <Lock size={20} />}
      />
      <Button
        onClick={rolesHandler}
        className={`${styles.button} ${styles.admin}`}
        icon={isAdmin ? <UserMinus size={20} /> : <UserPlus size={20} />}
      />
    </div>
  )
}

export default UserActions

