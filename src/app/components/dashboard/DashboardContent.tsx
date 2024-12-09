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
  Card,
  Select,
} from 'antd';
import { Pie } from '@ant-design/charts';
import { BankOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import { Account } from '@/types/Account';
import { createAccount, deleteAccount, fetchAccounts, fetchCurrencies } from '@/utils/api';
import { useUser } from '@/contexts/UserContext';
import AccountList from '@/app/components/dashboard/AccountList';

const { Title } = Typography;

type FieldType = {
  name: string;
  balance: number;
  currency: string;
};

type Currency = {
  id: number;
  code: string;
  name: string;
};

const formatCurrency = (value: number, currency: string): string => {
  if (currency === 'IDR') {
      return `Rp ${value.toLocaleString('id-ID')}`;
  }
  return `${value.toFixed(2)} ${currency}`;
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

  const pieData = accounts?.map(account => ({
    name: account.account_name,
    value: account.balance,
  })) || [];

  const config = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.75,
    label: false,
    tooltip: {
      title: 'name',
      formatter: (datum: any) => ({
        name: datum.name,
        value: formatCurrency(datum.value, 'IDR')
      })
    },
    legend: {
      position: 'bottom',
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={2}>Your Accounts</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleModalOpen}
          disabled={isSubmitting}
        >
          Add Account
        </Button>
      </Row>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <AccountList accounts={accounts || []} onDeleteAccount={onDeleteAccount} />
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Account Balance Distribution">
                {accounts && accounts.length > 0 ? (
                  <Pie {...config} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    No accounts to display
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Modal
        title="Add New Account"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        confirmLoading={isSubmitting}
        okText="Add Account"
        cancelText="Cancel"
      >
        <AccountForm form={form} />
      </Modal>
    </div>
  );
};

const AccountForm: React.FC<{ form: any }> = ({ form }) => {
  const { data: currencies, isLoading: isLoadingCurrencies } = useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
  });

  return (
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
            placeholder="0"
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
            { required: true, message: 'Please select the currency' },
          ]}
        >
          <Select
            style={{ width: '200px' }}
            placeholder="Select Currency"
            loading={isLoadingCurrencies}
            options={currencies?.map(curr => ({
              label: `${curr.code} - ${curr.name}`,
              value: curr.code,
            }))}
          />
        </Form.Item>
      </Space>
    </Form>
  );
};

export default DashboardContent;