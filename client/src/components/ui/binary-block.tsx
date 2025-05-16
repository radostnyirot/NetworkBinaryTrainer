import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

type BitValue = 0 | 1;

const ITEM_TYPE = 'binaryBlock';

interface BinaryBlockProps {
  value: BitValue;
  position: number;
  decimalValue: number;
  onChange?: (value: BitValue) => void;
  draggable?: boolean;
  networkPart?: boolean;
  className?: string;
}

interface DragItem {
  value: BitValue;
  position: number;
}

export function BinaryBlock({
  value,
  position,
  decimalValue,
  onChange,
  draggable = false,
  networkPart = false,
  className
}: BinaryBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Set up drag functionality if draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { value, position },
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [value, position, draggable]);
  
  // Set up drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      if (onChange) {
        onChange(item.value);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [onChange]);
  
  // Combine drag and drop refs if both enabled
  if (draggable) {
    drag(ref);
  }
  if (onChange) {
    drop(ref);
  }
  
  // Determine block color based on value and network part
  const getBackgroundColor = () => {
    if (value === 1) {
      return 'bg-[#DC2626]'; // Red for 1
    } else if (networkPart) {
      return 'bg-[#2563EB]'; // Blue for 0 in network part
    } else {
      return 'bg-[#9CA3AF]'; // Gray for 0
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <motion.div
        ref={ref}
        className={cn(
          'bit-block w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-bold rounded cursor-pointer transition-all',
          getBackgroundColor(),
          isDragging && 'opacity-50',
          isOver && 'ring-2 ring-primary',
          draggable && 'cursor-grab active:cursor-grabbing',
          className
        )}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange && onChange(value === 0 ? 1 : 0)}
      >
        {value}
      </motion.div>
      <span className="font-mono text-xs mt-1">{decimalValue}</span>
    </div>
  );
}
