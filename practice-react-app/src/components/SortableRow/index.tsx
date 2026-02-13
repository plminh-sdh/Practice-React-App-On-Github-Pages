import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableRow({
  id,
  index,
  text,
  disabled,
  onRemove,
  onEdit,
  isSelected,
  onSelect,
}: Readonly<{
  id: string;
  index: number;
  text: string;
  disabled: boolean;
  onRemove: () => void;
  onEdit: (next: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    background: isDragging ? "rgba(0,0,0,0.03)" : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={isSelected ? "table-primary" : ""}
      onClick={onSelect}
    >
      <td>
        <button
          type="button"
          className="btn btn-sm btn-light"
          disabled={disabled}
          title="Drag to reorder"
          aria-label="Drag handle"
          style={{ cursor: disabled ? "not-allowed" : "grab" }}
          {...attributes}
          {...listeners}
        >
          ☰
        </button>
      </td>

      <td className="text-body-secondary">{index + 1}</td>

      <td>
        <input
          className="form-control form-control-sm"
          value={text}
          disabled={disabled}
          onChange={(e) => onEdit(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      <td className="text-end">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
