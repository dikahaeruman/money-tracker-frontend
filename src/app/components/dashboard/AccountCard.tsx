import React from 'react';
import { Card, Typography, Space, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Account } from '@/types/Account';

const { Text } = Typography;

const formatCurrency = (value: number, currency: string): string => {
    if (currency === 'IDR') {
        return `Rp ${value.toLocaleString('id-ID')}`;
    }
    return `${value.toFixed(2)} ${currency}`;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

interface AccountCardProps {
    account: Account;
    onDelete: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onDelete }) => {
    return (
      <Card
        title={account.account_name}
        extra={
            <Popconfirm
              title="Are you sure you want to delete this account?"
              onConfirm={() => onDelete(account.id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ border: 'none', background: 'none', padding: 4 }}
                />
            </Popconfirm>
        }
        hoverable
      >
          <Space direction="vertical">
              <Text strong>{formatCurrency(account.balance, account.currency_code)}</Text>
              { account.currency_code != "IDR" ?
                <Text strong style={{ fontSize: 'smaller' }}>({formatCurrency(account.converted_balance, "IDR")})</Text>
                :
                <br></br>

              }
              <Text type="secondary">Last Updated: {formatDate(account.updated_at)}</Text>
          </Space>
      </Card>
    );
};

export default AccountCard;