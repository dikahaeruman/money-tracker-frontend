import React from 'react';
import { Card, Typography, Space, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Account } from '@/types/Account';

const { Text } = Typography;

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
              <Text strong>Balance: {account.balance.toFixed(2)} {account.currency}</Text>
              <Text type="secondary">Created Date: {new Date(account.created_at).toLocaleString('en-ID')}</Text>
          </Space>
      </Card>
    );
};

export default AccountCard;