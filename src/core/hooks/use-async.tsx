import * as React from "react";
import { AxiosError, AxiosResponse } from "axios";
import { useToast } from "@chakra-ui/react";

interface Options {
  shouldDisplayError: boolean;
  shouldDisplaySuccess: boolean;
  successMessage?: string;
}

const defaultOptions: Options = {
  shouldDisplayError: true,
  shouldDisplaySuccess: false,
};

export type UseAsyncReturn<TR extends any[], T> = [
  (...args: TR) => Promise<AxiosResponse<T>>,
  {
    data?: T;
    response?: AxiosResponse<T>;
    error: any;
    isLoading: boolean;
    setData: React.Dispatch<React.SetStateAction<T | undefined>>;
  }
];

export function useAsync<TR extends any[], T>(
  apiFunc: (...args: TR) => Promise<AxiosResponse<T>>,
  options?: Partial<Options>
): UseAsyncReturn<TR, T> {
  const opts: Options = {
    ...defaultOptions,
    ...options,
  };
  const [data, setData] = React.useState<T>();
  const [response, setResponse] = React.useState<AxiosResponse<T>>();
  const [error, setError] = React.useState<AxiosError>();
  const [promise, setPromise] = React.useState();

  const displayError = useToast({
    variant: "left-accent",
    status: "error",
    position: "bottom",
  });

  const displaySuccess = useToast({
    variant: "left-accent",
    status: "success",
    position: "bottom",
  });

  const submit = React.useCallback(async (...args: TR) => {
    let promiseInFlight = promise as Promise<AxiosResponse<T>> | undefined;
    if (promiseInFlight) {
      return promiseInFlight;
    }

    try {
      promiseInFlight = apiFunc(...args);
      setPromise(promiseInFlight as any);
      setError(undefined);
      setData(undefined);

      const axiosResponse = await promiseInFlight;
      setResponse(axiosResponse);
      setData(axiosResponse.data);
      if (opts.shouldDisplaySuccess) {
        displaySuccess({
          title: "Success",
          description: opts.successMessage,
        });
      }
      return axiosResponse;
    } catch (e) {
      if (opts.shouldDisplayError) {
        displayError({
          title: "Error",
          description: "An error occured",
        });
      }
      setError(e as AxiosError);
      throw e;
    } finally {
      setPromise(undefined);
    }
  }, []);

  return [
    submit,
    { data, setData, response, error, isLoading: Boolean(promise) },
  ];
}
