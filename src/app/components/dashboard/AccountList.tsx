import React from 'react';
import { Account } from '@/types/Account';
import { Empty, List } from 'antd';
import AccountCard from '@/app/components/dashboard/AccountCard';

const AccountList: React.FC<{ accounts: Account[] | undefined, onDeleteAccount: (accountId: string) => Promise<void> }> = ({ accounts, onDeleteAccount }) => (
  accounts && accounts.length > 0 ? (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
      dataSource={accounts}
      renderItem={(account) => (
        <List.Item key={account.id}>
          <AccountCard account={account} onDelete={onDeleteAccount}/>
        </List.Item>
      )}
    />
  ) : (
    <Empty description="No accounts found" />
  )
);

export default AccountList;