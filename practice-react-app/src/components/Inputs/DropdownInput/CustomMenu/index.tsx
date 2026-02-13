import React from "react";
import { List } from "./styles";

export const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }: any, ref) => {
    return (
      <div
        ref={ref as any}
        style={{
          ...style,
          minWidth: "100%",
        }}
        className={className + " shadow"}
        aria-labelledby={labeledBy}
      >
        <List>{children}</List>
      </div>
    );
  },
);
