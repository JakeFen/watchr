export type ChipOption<T extends string> = {
  label: string;
  value: T;
};

export type ChipProps<T extends string> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
};
