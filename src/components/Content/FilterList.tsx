import  { useState } from 'react';
import { Dropdown, Menu, Radio, Button, Tooltip } from 'antd';

interface FilterOption {
  label: string;
  value: boolean | undefined;
  tooltip?: string;
}

interface FilterMenuProps {
  onChange: (value: string | undefined) => void;
}

 const FilterMenu: React.FC<FilterMenuProps> = ({ onChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(undefined);

  const filterOptions: FilterOption[] = [
    { label: 'Все', value: undefined },
    { label: 'Заблокированные', value: true },
    { label: 'Активные', value: false },
  ];

  const handleFilterChange = (value: string | undefined) => {
    setSelectedFilter(value);
    onChange(value);
  };

  const menu = (
    <Menu>
      <Radio.Group onChange={(e) => handleFilterChange(e.target.value)}>
        {filterOptions.map((option, i) => (
          <Menu.Item key={i}>
            <Tooltip title={option.tooltip || ''}>
              <Radio value={option.value}>{option.label}</Radio>
            </Tooltip>
          </Menu.Item>
        ))}
      </Radio.Group>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button>
        {selectedFilter
          ? selectedFilter
            ? 'Заблокированные'
            : 'Активные'
          : 'Выберите фильтр'}
      </Button>
    </Dropdown>
  );
};
export default FilterMenu