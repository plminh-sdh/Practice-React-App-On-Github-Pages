import React from "react";
import { Toggle } from "./styles";

export const CustomToggle = React.forwardRef(
  ({ children, onClick, disabled, className, name, ...rest }: any, ref) => (
    <Toggle
      {...rest}
      ref={ref}
      data-testid={`test-${name}`}
      onClick={(e: any) => {
        e.preventDefault();
        if (disabled) return;
        onClick(e);
      }}
      name={name}
      className={className}
    >
      {children}
    </Toggle>
  ),
);
