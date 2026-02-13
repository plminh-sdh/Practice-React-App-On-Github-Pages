import React, { useState, type JSX } from "react";
import { Form } from "react-bootstrap";
import { List } from "../CustomMenu/styles";

interface Props {
  children: any;
  style: Object;
  className?: string;
  labeledBy?: string;
  maxLength?: number;
}

const CustomMenuWithSearch = React.forwardRef(
  (
    { children, style, className, maxLength, labeledBy }: Props,
    ref: React.LegacyRef<HTMLDivElement>,
  ) => {
    const [value, setValue] = useState("");
    const items = React.Children.toArray(children).filter(
      (child) =>
        !value ||
        (child as JSX.Element).props.children
          .toLowerCase()
          .includes(value.toLowerCase()),
    );

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          minWidth: "100%",
        }}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2"
          style={{
            width: "calc(100% - 2rem)",
          }}
          placeholder="Type to search..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          maxLength={maxLength}
        />
        <List>{items.length > 0 && items}</List>
        {items.length === 0 && (
          <div className="text-center">No results found.</div>
        )}
      </div>
    );
  },
);

export default CustomMenuWithSearch;
