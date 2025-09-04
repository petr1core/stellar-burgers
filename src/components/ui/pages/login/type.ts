import { Dispatch, SetStateAction } from 'react';
import { PageUIProps, ValidationErrors } from '../common-type';

export type LoginUIProps = PageUIProps & {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  validationErrors: ValidationErrors;
};
