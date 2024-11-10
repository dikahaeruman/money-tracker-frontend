import React, { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { BankOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import { Account } from '@/types/Account';
import { createAccount, deleteAccount, fetchAccounts } from '@/utils/api';
import { useUser } from '@/contexts/UserContext';
import AccountList from '@/app/components/dashboard/AccountList';

const { Title } = Typography;

type FieldType = {
  name: string;
  balance: number;
  currency: string;
};

const DashboardContent: React.FC = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<FieldType>();
  const queryClient = useQueryClient();

  const {
    data: accounts,
    isLoading,
    error,
    refetch,
  } = useQuery<Account[], Error>({
    queryKey: ['accounts', user?.id],
    queryFn: fetchAccounts,
    staleTime: Infinity,
    enabled: !!user,
  });

  const handleModalOpen = useCallback(() => setIsModalOpen(true), []);
  const handleModalClose = useCallback(() => setIsModalOpen(false), []);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      await createAccount({
        name: values.name,
        balance: values.balance,
        currency: values.currency,
      });

      setIsModalOpen(false);
      form.resetFields();
      message.success('Account created successfully');

      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      console.error('Error creating account:', error);
      message.error('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, refetch, queryClient]);

  const onDeleteAccount = useCallback(
    async (accountId: string) => {
      await deleteAccount(accountId);
      message.success('Account deleted successfully');
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    [refetch, queryClient],
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading accounts: {error.message}</div>;
  }

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Your Accounts</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleModalOpen}
          >
            Add Account
          </Button>
        </Col>
      </Row>
      <Modal
        title="Add New Account"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        confirmLoading={isSubmitting}
        okText="Add Account"
        cancelText="Cancel"
      >
        <Divider />
        <AccountForm form={form} />
      </Modal>
      <AccountList accounts={accounts} onDeleteAccount={onDeleteAccount} />
    </>
  );
};

const AccountForm: React.FC<{ form: any }> = ({ form }) => (
  <Form form={form} layout="vertical" name="addAccount">
    <Form.Item
      name="name"
      label="Account Name"
      rules={[{ required: true, message: 'Please enter the account name' }]}
    >
      <Input prefix={<BankOutlined />} placeholder="Enter account name" />
    </Form.Item>
    <Space align="start">
      <Form.Item
        name="balance"
        label="Initial Balance"
        rules={[
          { required: true, message: 'Please enter the initial balance' },
        ]}
      >
        <InputNumber
          prefix={<DollarOutlined />}
          placeholder="0.00"
          style={{ width: '200px' }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>
      <Form.Item
        name="currency"
        label="Currency"
        rules={[
          { required: true, message: 'Please enter the currency' },
          {
            pattern: /^[A-Za-z]+$/,
            message: 'Currency must contain only letters',
          },
        ]}
      >
        <Input style={{ width: '200px' }} placeholder="Enter Currency" />
      </Form.Item>
    </Space>
  </Form>
);

export default DashboardContent;