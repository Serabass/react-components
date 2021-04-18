import React, { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AjaxCacheSettings } from '../types';

export interface AjaxPropsChildrenArgs<TRes> {
  response: AxiosResponse<TRes>;
  refetch: any;
  callback?: any;
}

export interface AjaxProps<TRes> extends AxiosRequestConfig {
  loading?: React.ReactNode;
  children: ({
    response,
    refetch,
  }: AjaxPropsChildrenArgs<TRes>) => React.ReactNode;

  cache?: AjaxCacheSettings | boolean;
}

export interface AjaxRefetchArgs {
  method?: Method;
  url?: string;
  params: any;
  data: any;
  previousData?: any;
  callback?: (previousData: any, newData: any) => any;
}

function flushExpiredCache() {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (!key) {
      continue;
    }

    if (!key.startsWith('ajax__cache__')) {
      continue;
    }

    try {
      let value = localStorage.getItem(key);

      if (!value) {
        continue;
      }

      let json = JSON.parse(value);

      if (!json.expires) {
        localStorage.removeItem(key);
        continue;
      }

      if (json.expires < Date.now()) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      localStorage.removeItem(key);
    }
  }
}

export function Ajax<T>({
  url,
  method,
  params,
  data,
  children,
  headers,
  cache,
  loading = <span>Loading...</span>,
}: AjaxProps<T>): React.ReactNode {
  let [response, setResponse] = useState<AxiosResponse<T>>();
  let [error, setError] = useState<Error>();

  flushExpiredCache();

  function refetch({
    method,
    url,
    params,
    data,
    previousData,
    callback,
  }: AjaxRefetchArgs) {
    console.log('refetching', { method, url, params, data });
    axios
      .request<T>({
        method,
        url,
        params,
        headers,
        data,
      })
      .then((res) => {
        if (!callback) {
          callback = (newData: T) => newData;
        }
        res.data = callback(res.data, previousData);
        setResponse(res);
      })
      .catch((err) => {
        setError(err);
      });
  }

  let cacheSettings: AjaxCacheSettings = {
    enabled: false,
    lifetime: 10 * 1000,
    storage: 'localstorage',
  };

  if (cache) {
    if (typeof cache === 'boolean') {
      cacheSettings = {
        enabled: cache,
        lifetime: 10 * 1000,
        storage: 'localstorage',
      };
    } else {
      cacheSettings = {
        ...cacheSettings,
        ...cache,
      };
    }

    if (cacheSettings.enabled) {
      let cacheKey =
        'ajax__cache__' + JSON.stringify({ method, url, params, data });
      console.log({ method, url, params, data });
      let item = localStorage.getItem(cacheKey);
      if (item) {
        let result = JSON.parse(item);

        if (result.expires <= Date.now()) {
          localStorage.removeItem(cacheKey);
        } else {
          response = result.data;
        }
      }
    }
  }

  if (!response) {
    refetch({ method, url, params, data });

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return loading;
  }

  if (cacheSettings.enabled) {
    let cacheKey = `ajax__cache__${JSON.stringify({
      method,
      url,
      params,
      data,
    })}`;
    let result = JSON.stringify({
      expires: Date.now() + cacheSettings.lifetime,
      data: response,
    });
    localStorage.setItem(cacheKey, result);
  }

  let inputData = {
    method,
    url,
    params,
    headers,
    data,
  };

  return (
    <div>
      {children({
        response,
        refetch: ({
          params = inputData.params,
          data = inputData.data,
          previousData,
          callback,
        }: any = {}) => {
          refetch({ method, url, params, data, previousData, callback });
        },
      })}
    </div>
  );
}

Ajax.GET = <TRes extends unknown>({ children, ...props }: AjaxProps<TRes>) => (
  // @ts-ignore
  <Ajax<TRes> method="GET" {...props}>
    {children}
  </Ajax>
);
Ajax.POST = <TRes extends unknown>({ children, ...props }: AjaxProps<TRes>) => (
  // @ts-ignore
  <Ajax<TRes> method="POST" {...props}>
    {children}
  </Ajax>
);

Ajax.PUT = <TRes extends unknown>({ children, ...props }: AjaxProps<TRes>) => (
  // @ts-ignore
  <Ajax<TRes> method="PUT" {...props}>
    {children}
  </Ajax>
);
// ...
