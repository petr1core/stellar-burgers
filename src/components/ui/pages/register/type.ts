import { Dispatch, SetStateAction } from 'react';
import { PageUIProps, ValidationErrors } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  setPassword: Dispatch<SetStateAction<string>>;
  setUserName: Dispatch<SetStateAction<string>>;
  validationErrors: ValidationErrors;
};
