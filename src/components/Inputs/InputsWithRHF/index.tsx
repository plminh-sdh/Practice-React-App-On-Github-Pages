import type { DropDownInputProps } from "../DropdownInput";
import type { TextInputProps } from "../TextInput";
import type { TextListInputProps } from "../TextListInput";
import DropdownInput from "../DropdownInput";
import TextInput from "../TextInput";
import TextListInput from "../TextListInput";
import withReactHookForm from "./withReactHookForm";
import type { PositiveIntegerInputProps } from "../NumberInput/PositiveIntegerInput";
import PositiveIntegerInput from "../NumberInput/PositiveIntegerInput";

const TextInputRHF = withReactHookForm<TextInputProps>(TextInput);
const TextListInputRHF = withReactHookForm<TextListInputProps>(TextListInput);

const DropDownInputRHF = withReactHookForm<DropDownInputProps>(DropdownInput);
const PositiveIntegerInputRHF =
  withReactHookForm<PositiveIntegerInputProps>(PositiveIntegerInput);

export {
  TextInputRHF,
  TextListInputRHF,
  DropDownInputRHF,
  PositiveIntegerInputRHF,
};
