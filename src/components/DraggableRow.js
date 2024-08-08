import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableRow = ({ id, index, moveRow, children }) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const ItemTypes = {
    ROW: "row",
  };
  const [, drop] = useDrop({
    accept: ItemTypes.ROW,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ROW,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(dragRef);
  drop(ref);

  return (
    <tr ref={ref} style={{ opacity }} className="hide-delete-button">
      {React.Children.map(children, (child, i) => {
        if (i === 0) {
          return React.cloneElement(child, { ref: dragRef });
        }
        return child;
      })}
    </tr>
  );
};

export default DraggableRow;
