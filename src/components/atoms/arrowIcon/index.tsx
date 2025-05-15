import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

type Direction =
  | 'up-right' | 'up-left' | 'down-right' | 'down-left'
  | 'up' | 'down' | 'left' | 'right';

type Position =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

type Variant = 'primary' | 'secondary';

interface ArrowIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  iconPadding?: number;
  borderRadius?: string;
  direction?: Direction;
  position?: Position;
  variant?: Variant;
}

const directionAngles: Record<Direction, number> = {
  'up-right': 45,
  'up-left': -45,
  'down-right': 135,
  'down-left': -135,
  'up': 0,
  'down': 180,
  'left': 270,
  'right': 90,
};

const positionBaseStyles: Record<Position, React.CSSProperties> = {
  'top-left': { top: 0, left: 0 },
  'top-center': { top: 0, left: '50%' },
  'top-right': { top: 0, right: 0 },
  'middle-left': { top: '50%', left: 0 },
  'center': { top: '50%', left: '50%' },
  'middle-right': { top: '50%', right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-center': { bottom: 0, left: '50%' },
  'bottom-right': { bottom: 0, right: 0 },
};

const positionTransforms: Record<Position, string | undefined> = {
  'top-left': undefined,
  'top-center': 'translateX(-50%)',
  'top-right': undefined,
  'middle-left': 'translateY(-50%)',
  'center': 'translate(-50%, -50%)',
  'middle-right': 'translateY(-50%)',
  'bottom-left': undefined,
  'bottom-center': 'translateX(-50%)',
  'bottom-right': undefined,
};

const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 24,
  iconPadding = 10,
  borderRadius = '50%',
  direction = 'up-right',
  position,
  variant = 'primary',
  color,
  backgroundColor
}) => {
  const rotation = directionAngles[direction] ?? 45;

  // Variant-based styling
  const variantStyles: Record<Variant, { color: string; backgroundColor: string }> = {
    primary: { color: '#fff', backgroundColor: '#f7931e' },
    secondary: { color: '#f7931e', backgroundColor: '#fff' },
  };

  const appliedColor = color || variantStyles[variant].color;
  const appliedBackground = backgroundColor || variantStyles[variant].backgroundColor;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appliedBackground,
    padding: iconPadding,
    borderRadius,
  };

  if (position) {
    Object.assign(baseStyle, {
      position: 'absolute',
      ...positionBaseStyles[position],
    });

    const transformPart = positionTransforms[position];
    baseStyle.transform = transformPart
      ? `${transformPart} rotate(${rotation}deg)`
      : `rotate(${rotation}deg)`;
  } else {
    baseStyle.transform = `rotate(${rotation}deg)`;
  }

  const iconStyle: React.CSSProperties = {
    transform: `rotate(${-rotation}deg)`,
  };

  return (
    <div style={baseStyle}>
      <FiArrowUpRight size={size} color={appliedColor} style={iconStyle} />
    </div>
  );
};

export default ArrowIcon;
