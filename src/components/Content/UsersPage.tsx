import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Space,
  notification,
  TablePaginationConfig,
  Button,
  Modal,
  Form,
  Select,
  Checkbox,
  Radio,
  RadioChangeEvent,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getUsers,
  getUserProfile,
  updateUserProfile,
  blockUser,
  unblockUser,
  deleteUser,
} from "../../api/userApi";
import {
  User,
  MetaResponse,
  Roles,
  UserRequest,
  UserFilters,
} from "../../types/users";
import { ColumnType, FilterValue, SorterResult } from "antd/es/table/interface";

const spaceStyle = { marginBottom: 16 };
const inputStyle = { width: 300 };

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<UserFilters>({ limit: 20, offset: 0 });
  const [isProfileModalVisible, setIsProfileModalVisible] =
    useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm<UserRequest>();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [blockFilter, setBlockFilter] = useState<string>("all");

  const fetchUsers = async (updatedFilters: UserFilters = filters) => {
    setLoading(true);
    try {
      const response: MetaResponse<User> = await getUsers({
        ...updatedFilters,
        limit: updatedFilters.limit || 20, 
      });
      setUsers(response.data);
      setTotalUsers(response.meta.totalAmount);
    } catch {
      notification.error({
        message: "Ошибка загрузки",
        description: "Не удалось загрузить пользователей.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const updateFilters = (newFilters: Partial<UserFilters>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateFilters({ search: value, offset: 0 });
  };

  const handleBlockFilterChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setBlockFilter(value);
    updateFilters({
      isBlocked: value === "all" ? undefined : value === "blocked",
      offset: 0,
    });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    const { field, order } = sort || {};
    const newOffset =
      ((pagination.current || 1) - 1) * (pagination.pageSize || 20);
    updateFilters({
      offset: newOffset,
      limit: pagination.pageSize || 20,
      sortBy: field as string,
      sortOrder: order === "ascend" ? "asc" : "desc",
    });
  };

  const handleGoToProfile = async (userId: number) => {
    try {
      const user = await getUserProfile(userId);
      setCurrentUser(user);
      form.setFieldsValue(user);
      setIsProfileModalVisible(true);
    } catch {
      notification.error({
        message: "Ошибка загрузки профиля",
        description: "Не удалось загрузить профиль пользователя.",
      });
    }
  };

  const handleDeleteUser = (userId: number) => {
    Modal.confirm({
      title: "Подтверждение удаления",
      content: "Вы уверены, что хотите удалить этого пользователя?",
      onOk: async () => {
        try {
          await deleteUser(userId);
          fetchUsers();
          notification.success({
            message: "Пользователь удален",
            description: "Пользователь успешно удален.",
          });
        } catch {
          notification.error({
            message: "Ошибка удаления",
            description: "Не удалось удалить пользователя.",
          });
        }
      },
    });
  };

  const handleToggleBlock = (userId: number, isCurrentlyBlocked: boolean) => {
    Modal.confirm({
      title: `Подтверждение ${
        isCurrentlyBlocked ? "разблокировки" : "блокировки"
      }`,
      content: `Вы уверены, что хотите ${
        isCurrentlyBlocked ? "разблокировать" : "заблокировать"
      } этого пользователя?`,
      onOk: async () => {
        try {
          if (isCurrentlyBlocked) {
            await unblockUser(userId);
          } else {
            await blockUser(userId);
          }
          fetchUsers();
          notification.success({
            message: `Пользователь ${
              isCurrentlyBlocked ? "разблокирован" : "заблокирован"
            }`,
            description: `Пользователь успешно ${
              isCurrentlyBlocked ? "разблокирован" : "заблокирован"
            }.`,
          });
        } catch {
          notification.error({
            message: "Ошибка обновления",
            description: "Не удалось обновить статус блокировки пользователя.",
          });
        }
      },
    });
  };

  const handleUpdateProfile = async (values: UserRequest) => {
    try {
      if (currentUser) {
        const changedValues: Partial<UserRequest> = {};
        Object.keys(values).forEach((key) => {
          if (
            values[key as keyof UserRequest] !== currentUser[key as keyof User]
          ) {
            changedValues[key as keyof UserRequest] =
              values[key as keyof UserRequest];
          }
        });

        if (Object.keys(changedValues).length > 0) {
          await updateUserProfile(currentUser.id, changedValues);
          setIsProfileModalVisible(false);
          fetchUsers();
          notification.success({
            message: "Профиль обновлен",
            description: "Данные пользователя успешно обновлены.",
          });
        } else {
          setIsProfileModalVisible(false);
          notification.info({
            message: "Нет изменений",
            description: "Данные пользователя не были изменены.",
          });
        }
      }
    } catch {
      notification.error({
        message: "Ошибка обновления",
        description: "Не удалось обновить данные пользователя.",
      });
    }
  };

  const columns: ColumnType<User>[] = [
    {
      title: "Имя пользователя",
      dataIndex: "username",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Статус блокировки",
      dataIndex: "isBlocked",
      render: (isBlocked: boolean) =>
        isBlocked ? "Заблокирован" : "Не заблокирован",
    },
    {
      title: "Роли",
      dataIndex: "roles",
      render: (roles: Roles[]) => (roles ? roles.join(", ") : ""),
    },
    { title: "Номер телефона", dataIndex: "phoneNumber" },
    {
      title: "Действия",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space>
          <Button onClick={() => handleGoToProfile(record.id)}>
            Перейти к профилю
          </Button>
          <Button onClick={() => handleDeleteUser(record.id)} danger>
            Удалить
          </Button>
          <Button
            onClick={() => handleToggleBlock(record.id, record.isBlocked)}
          >
            {record.isBlocked ? "Разблокировать" : "Заблокировать"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={spaceStyle}>
        <Input
          placeholder="Поиск по имени или email"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          style={inputStyle}
        />
        <Radio.Group value={blockFilter} onChange={handleBlockFilterChange}>
          <Radio.Button value="all">Все пользователи</Radio.Button>
          <Radio.Button value="blocked">Заблокированные</Radio.Button>
          <Radio.Button value="active">Активные</Radio.Button>
        </Radio.Group>
      </Space>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          total: totalUsers,
          current: filters.offset / filters.limit + 1,
          pageSize: filters.limit || 20,
          showSizeChanger: true,
          pageSizeOptions: ["10"],
        }}
        onChange={handleTableChange}
      />
      <Modal
        visible={isProfileModalVisible}
        title="Профиль пользователя"
        onCancel={() => setIsProfileModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateProfile}>
          <Form.Item name="username" label="Имя пользователя">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Номер телефона">
            <Input />
          </Form.Item>
          <Form.Item
            name="isBlocked"
            label="Статус блокировки"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item name="roles" label="Роли">
            <Select
              mode="multiple"
              options={[
                { value: Roles.ADMIN, label: "Админ" },
                { value: Roles.MODERATOR, label: "Модератор" },
              ]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Обновить
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
export default UsersPage;
