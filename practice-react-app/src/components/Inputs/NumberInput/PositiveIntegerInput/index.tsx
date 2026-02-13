import NumberInput, { type NumberInputProps } from "..";
import withFormatValidation, {
  type FormattedInputProps,
} from "../withFormatValidation";

export const positiveIntegerMaskFormatter = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return value;
  } else {
    return (+value).toString();
  }
};
export const positiveIntegerValueFormatter = (value: string) => {
  return +value;
};
export const additionalCondition = (value: string) => {
  return /^\d+$/.test(value);
};

const PositiveIntegerInput = withFormatValidation<NumberInputProps>(
  NumberInput,
  positiveIntegerMaskFormatter,
  positiveIntegerValueFormatter,
  additionalCondition,
);

export type PositiveIntegerInputProps = FormattedInputProps<NumberInputProps>;

export default PositiveIntegerInput;
