'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Typography, Button, Divider, Form, Alert, DatePicker, DatePickerProps } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './styles.module.css';
import unsplash from '@/utils/unsplash';
import axios from 'axios';

const { Title, Paragraph, Text, Link } = Typography;

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const Register: React.FC = () => {


  return (
    <div>
      <h1>Alfan</h1>
      <DatePicker onChange={onChange} />
    </div>
  );
};

export default Register;
