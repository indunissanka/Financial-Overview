
import React from 'react';
import { Category } from '../types';
import { CATEGORY_CONFIG } from '../constants';

interface CategoryBadgeProps {
  category: Category;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const config = CATEGORY_CONFIG[category];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}>
      {config.icon}
      {category}
    </div>
  );
};

export default CategoryBadge;
