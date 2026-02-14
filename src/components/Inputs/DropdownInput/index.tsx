import React, { memo, useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { CustomMenu } from "./CustomMenu";
import CustomMenuWithSearch from "./CustomMenuWithSearch";
import { CustomToggle } from "./CustomToggle";
import type { Option } from "../../../models/option";

export type DropDownInputProps = React.HTMLProps<HTMLSelectElement> & {
  externalValue?: string;
  setExternalValue: (value?: any) => void;
  maxLength?: number;
  options: Option[];
  defaultValue?: string;
  isInvalid?: boolean;
  withSearch?: boolean;
  withDisplaySort?: boolean;
  hideEmptyOption?: boolean;
  onToggle?: (show: boolean) => void;
};

const DropDownInput = ({
  externalValue,
  setExternalValue,
  disabled,
  options,
  isInvalid = undefined,
  withSearch,
  onBlur,
  onFocus,
  name,
  defaultValue,
  placeholder,
  maxLength,
  hideEmptyOption,
  onToggle,
}: DropDownInputProps) => {
  const wrapperRef = useRef<any | null>(null);
  const [isFocused, setIsFocused] = useState<boolean | null>(null);

  useEffect(() => {
    function handleFocus(event: any) {
      if (wrapperRef.current?.contains(event.target)) {
        onFocus?.(event);
      } else {
        setIsFocused((prev) => {
          if (prev === null) return null;
          onBlur?.(event);
          return false;
        });
      }
    }

    document.addEventListener("mousedown", handleFocus);
    return () => {
      document.removeEventListener("mousedown", handleFocus);
    };
  }, [onBlur, onFocus]);

  const renderValue = () => {
    if (!externalValue) {
      return !placeholder ? (
        "Select"
      ) : (
        <span className="text-secondary">{placeholder}</span>
      );
    }

    const found = options.find(
      (o) => o.value?.toString() === externalValue.toString(),
    );

    return found ? found.displayValue : defaultValue;
  };

  return (
    <Dropdown ref={wrapperRef} className="p-0" onToggle={onToggle}>
      <Dropdown.Toggle
        name={name}
        as={CustomToggle}
        disabled={disabled}
        $isInvalid={isInvalid}
        $isDisabled={disabled}
      >
        {renderValue()}
      </Dropdown.Toggle>

      <Dropdown.Menu
        as={!withSearch ? CustomMenu : CustomMenuWithSearch}
        {...(withSearch && { maxLength })}
      >
        {!hideEmptyOption && (
          <Dropdown.Item onClick={() => setExternalValue(null)}>
            {!placeholder ? "Select" : placeholder}
          </Dropdown.Item>
        )}
        {options.map((o, i) => (
          <Dropdown.Item
            key={i}
            onClick={() => {
              if (externalValue !== o.value) setExternalValue(o.value);
            }}
            active={externalValue === o.value}
          >
            {o.displayValue}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(DropDownInput);
