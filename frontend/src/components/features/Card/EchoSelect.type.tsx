export type SelectOption<T = any> = {
  value: T;
  label: string;
  isDisabled?: false;
}
export type SelectOriginalOption<T = any> = {
  value: T;
  kr: string;
  en: string;
  jp: string;
  zh: string;
  path: string;
}
export type SelectOptionWithImage<T = any> = {
  value: T;
  label: string;
  path: string;
  isDisabled?: false;
}

export type SelectOptionStatOriginal<T = any> = {
  value: T;
  label: string;
  kr: string;
  en: string;
  jp: string;
  zh: string;
  path: string;
  mainValue: number[];
  subValue: number[];
}

export interface EchoSelectProps {
    index?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export type Cost = 1 | 3 | 4;
