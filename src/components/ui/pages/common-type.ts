import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

export type PageUIProps = {
  errorText: string | undefined;
  email: string;
  setEmail: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export type ValidationErrors = {
  email?: string;
  password?: string;
  name?: string;
  token?: string;
};
