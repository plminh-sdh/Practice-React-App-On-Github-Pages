import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { SortableRow } from "../../SortableRow";

export type TextListInputProps = React.HTMLProps<HTMLInputElement> & {
  externalValue: string[] | null | undefined;
  setExternalValue: (value: string[] | null | undefined) => void;

  selectedRowIndex: number | null;
  setSelectedRowIndex: (next: number | null) => void;

  isInvalid?: boolean;
  readOnly?: boolean;
};

const TextListInput = memo(
  React.forwardRef<HTMLInputElement, TextListInputProps>(function TextListInput(
    {
      externalValue,
      setExternalValue,
      selectedRowIndex,
      setSelectedRowIndex,
      isInvalid,
      readOnly,
      disabled,
      onBlur,
      onFocus,
      name,
      placeholder,
      maxLength = 120,
      className,
      ...rest
    },
    ref,
  ) {
    const list = externalValue ?? [];
    const [draft, setDraft] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    // merge forwarded ref + local ref
    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        inputRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref && "current" in ref) (ref as any).current = el;
      },
      [ref],
    );

    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const items = useMemo(() => list.map((_, idx) => String(idx)), [list]);

    const addDraft = useCallback(() => {
      if (disabled || readOnly) return;

      const trimmed = draft.trim();
      if (!trimmed) return;

      const clipped = trimmed.slice(0, maxLength ?? 120);
      setExternalValue([...list, clipped]);
      setSelectedRowIndex(list.length);
      setDraft("");

      requestAnimationFrame(() => inputRef.current?.focus());
    }, [disabled, readOnly, draft, maxLength, list, setExternalValue]);

    const removeAt = useCallback(
      (index: number) => {
        if (disabled || readOnly) return;
        const next = list.filter((_, i) => i !== index);
        setExternalValue(next);

        if (selectedRowIndex === index) {
          setSelectedRowIndex(null);
        }
      },
      [disabled, readOnly, list, setExternalValue],
    );

    const updateAt = useCallback(
      (index: number, nextText: string) => {
        if (disabled || readOnly) return;
        const next = [...list];
        next[index] = nextText.slice(0, maxLength ?? 120);
        setExternalValue(next);
      },
      [disabled, readOnly, list, setExternalValue, maxLength],
    );

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      rest.onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (e.key === "Enter") {
        e.preventDefault();
        addDraft();
      }
    };

    const onDragEnd = (event: DragEndEvent) => {
      if (disabled || readOnly) return;

      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;

      const from = Number(active.id);
      const to = Number(over.id);

      setExternalValue(arrayMove(list, from, to));

      if (selectedRowIndex == null) return;

      if (selectedRowIndex === from) {
        setSelectedRowIndex(to); // the selected item moved
      } else if (from < to) {
        // item moved down: indices [from+1 .. to] shift up by 1
        if (selectedRowIndex > from && selectedRowIndex <= to) {
          setSelectedRowIndex(selectedRowIndex - 1);
        }
      } else if (selectedRowIndex >= to && selectedRowIndex < from) {
        // item moved up: indices [to .. from-1] shift down by 1
        setSelectedRowIndex(selectedRowIndex + 1);
      }
    };

    return (
      <div className={`${className} px-0`}>
        <div className="input-group">
          <input
            {...rest}
            ref={setRefs}
            name={name}
            className={["form-control", isInvalid ? "is-invalid" : ""]
              .filter(Boolean)
              .join(" ")}
            type="text"
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            maxLength={maxLength}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={addDraft}
            disabled={disabled || readOnly || !draft.trim()}
            aria-label="Add item"
            title="Add"
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span>
          </button>
        </div>

        <div className="mt-3 px-1">
          {list.length === 0 ? (
            <div className="text-body-secondary">No items yet.</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="table-responsive">
                  <table className="table table-sm table-bordered table-hover align-middle">
                    <tbody>
                      {list.map((text, index) => (
                        <SortableRow
                          key={index}
                          id={String(index)}
                          index={index}
                          text={text}
                          disabled={!!disabled || !!readOnly}
                          onRemove={() => removeAt(index)}
                          onEdit={(next) => updateAt(index, next)}
                          isSelected={selectedRowIndex === index}
                          onSelect={() => {
                            setSelectedRowIndex(index);
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    );
  }),
);

export default TextListInput;
