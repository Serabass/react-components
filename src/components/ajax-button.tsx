import React, { useState } from 'react';
import axios, { AxiosResponse, Method } from 'axios';
import { Button, Tooltip, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FileEntry } from '../hooks/useFileReader';

export interface AjaxButtonProps<TReq, TRes> {
  url: string;
  data: TReq;
  onSuccess: (res: AxiosResponse<TRes>) => void;
  children?: React.ReactNode;
  method: Method;
  confirm?: boolean;
  confirmText?: string;
  files?: { [key: string]: FileEntry[] };
}

export function AjaxButton<TReq, TRes>({
  url,
  data,
  onSuccess,
  children,
  method,
  icon,
  files = {},
  disabled = false,
  block = false,
  type = 'text',
  confirm,
  confirmText,
}: AjaxButtonProps<TReq, TRes>) {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<any>(null);

  let formData = new FormData();
  let hasFiles = Object.keys(files).length > 0;
  if (hasFiles) {
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    for (let [key, value] of Object.entries(files)) {
      for (let entry of value) {
        formData.append(key, entry.file, entry.file.name);
      }
    }
  }

  let onClick = () => {
    setLoading(true);
    if (hasFiles) {
      // TODO Bad practice
      axios
        .post(url, formData)
        .then((res) => {
          onSuccess(res);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    } else {
      axios
        .request({
          url,
          method,
          data,
        })
        .then((res) => {
          onSuccess(res);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  };
  let btn;

  if (confirm) {
    btn = (
      <Popconfirm
        title={confirmText}
        onConfirm={onClick}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type={loading ? 'ghost' : type}
          loading={loading}
          block={block}
          disabled={disabled}
          icon={icon}
        >
          {children}
        </Button>
      </Popconfirm>
    );
  } else {
    btn = (
      <Button
        type={loading ? 'ghost' : type}
        loading={loading}
        block={block}
        disabled={disabled}
        icon={icon}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  let errorBtn = (error: any) => (
    <Tooltip title={error.message}>
      <Button
        type="link"
        style={{
          color: 'red',
        }}
        loading={loading}
        block={block}
        icon={!icon ? null : <CloseOutlined />}
        onClick={onClick}
      >
        Повторить попытку
      </Button>
    </Tooltip>
  );
  return !error ? btn : errorBtn(error);
}
