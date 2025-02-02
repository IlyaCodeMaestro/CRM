import { useCallback, useEffect, useState } from "react";
import type { GetProp, GetProps, TableProps } from "antd";
import { Flex, Table, Tag, Input, Typography, Card, message } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import { User } from "../../../types/users";
import { fetchUsers } from "../../../api/adminAPI/adminApi";
import FilterList from "../FilterList";
import UserActions from "../UserActions/UserActions";
import styles from "./UsersPage.module.scss";

type ColumnsType<T extends object = object> = TableProps<T>["columns"]
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<unknown>["field"];
  sortOrder?: SorterResult<unknown>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const UsersPage = () => {
  const [data, setData] = useState<User[]>()
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    filters: { isBlocked: null },
  })
  const [searchText, setSearchText] = useState<string>("")

  const columns: ColumnsType<User> = [
    {
      title: "Имя пользователя",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "Email пользователя",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
      render: (isDate) => new Date(isDate).toLocaleDateString(),
    },
    {
      title: "Статус блокировки",
      dataIndex: "isBlocked",
      render: (isBlocked: boolean) => (
        <Tag color={isBlocked ? "red" : "green"}>{isBlocked ? "Заблокирован" : "Активен"}</Tag>
      ),
    },
    {
      title: "Роль",
      dataIndex: "isAdmin",
      render: (isAdmin: boolean) => <Tag color={isAdmin ? "gold" : "blue"}>{isAdmin ? "Админ" : "Пользователь"}</Tag>,
    },
    {
      title: "Номер телефона",
      dataIndex: "phoneNumber",
      render: (phoneNumber: string) => phoneNumber || "Не указан",
    },
    {
      title: "Действия",
      render: (user) => {
        return <UserActions {...user} updateTable={getTableData} />
      },
    },
  ]

  const getTableData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchUsers({
        limit: tableParams.pagination?.pageSize,
        offset: tableParams.pagination?.current ? tableParams.pagination.current - 1 : undefined,
        sortBy: tableParams.sortField as string | undefined,
        isBlocked: tableParams.filters?.isBlocked as boolean | undefined,
        search: searchText,
      })
      setData(response.data)
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.meta.totalAmount,
          pageSize: 20,
          showSizeChanger: false,
        },
      }))
    } catch {
      message.error("Ошибка при загрузке данных:")
    } finally {
      setLoading(false)
    }
  }, [
    searchText,
    tableParams.filters,
    tableParams.pagination?.pageSize,
    tableParams.pagination?.current,
    tableParams.sortField,
  ])

  useEffect(() => {
    getTableData()

    const intervalId = setInterval(getTableData, 60000)
    return () => clearInterval(intervalId)
  }, [getTableData, searchText])

  const onSearch: GetProps<typeof Input.Search>["onSearch"] = (value) => {
    setSearchText(value)
    setTableParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, current: 1 },
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  const handleTableChange: TableProps<User>["onChange"] = (pagination, _, sorter) => {
    setTableParams({
      pagination,
      filters: tableParams.filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Typography.Title level={2} className={styles.title}>
          Управление пользователями
        </Typography.Title>
        <Flex justify="space-between" align="center" className={styles.searchContainer}>
          <Input.Search
            placeholder="Поиск по имени или email"
            onSearch={onSearch}
            onChange={handleSearchChange}
            loading={loading}
            className={styles.searchInput}
          />
          <div className={styles.filterSelect}>
            <FilterList
              onChange={(filter: boolean | undefined) => {
                setTableParams((prev: TableParams) => ({
                  ...prev,
                  filters: { isBlocked: filter },
                  pagination: { ...tableParams.pagination, current: 1 },
                }));
              }}
            />
          </div>
        </Flex>
        <Table<User>
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          className={styles.table}
        />
      </Card>
    </div>
  )
}

export default UsersPage

