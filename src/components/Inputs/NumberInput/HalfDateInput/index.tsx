import _ from 'lodash';
import withFormatValidation, {
  FormattedInputProps,
} from '../withFormatValidation';
import NumberInput, { NumberInputProps } from '..';

export const halfDateMaskFormatter = (value: string) => {
  if ((isNaN(Number(value)) || value.trim() === '') && value !== '.') {
    return value;
  } else {
    if (!/^-?\d*\.?\d*$/.test(value)) {
      return value;
    }
    if (value === '.') value = '0';
    const parsed = parseFloat(value);
    const roundedValue = Math.ceil(parsed * 2) / 2;
    return roundedValue.toString();
  }
};
export const haftDateValueFormatter = (value: string) => {
  if (value === '.') value = '0';
  const parsed = parseFloat(value);
  return Math.ceil(parsed * 2) / 2;
};

export const additionalCondition = (value: string) => {
  return /^-?\d*\.?\d*$/.test(value);
};

const HalfDateInput = withFormatValidation<NumberInputProps>(
  NumberInput,
  halfDateMaskFormatter,
  haftDateValueFormatter,
  additionalCondition,
);

export type HalfDateInputProps = FormattedInputProps<NumberInputProps>;

export default HalfDateInput;
