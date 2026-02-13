import React, { memo } from "react";
import { Input } from "./styles";

export type TextInputProps = React.HTMLProps<HTMLInputElement> & {
  externalValue: string | null | undefined;
  setExternalValue: (value: string | null | undefined) => void;
  isInvalid?: boolean;
  isTextarea?: boolean;
  readOnly?: boolean;
};

const TextInput = memo(
  React.forwardRef(
    (
      {
        externalValue,
        setExternalValue,
        isInvalid = undefined,
        isTextarea = false,
        readOnly,
        disabled,
        onBlur,
        onFocus,
        name,
        placeholder,
        maxLength,
        className,
      }: TextInputProps,
      ref,
    ) => {
      return (
        <Input
          className={className}
          name={name}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          type="text"
          forwardedAs={isTextarea ? "textarea" : "input"}
          onChange={(e) => setExternalValue(e.target.value)}
          isInvalid={isInvalid}
          value={externalValue ?? ""}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      );
    },
  ),
);

export default TextInput;
