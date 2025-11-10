import { useState, useRef, useEffect } from 'react';
import { ApperIcon } from '@/components/ApperIcon';
import { Button } from '@/components/atoms/Button';

const ActionMenu = ({ onEdit, onDelete, onViewVersions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="p-2 h-8 w-8"
      >
        <ApperIcon name="MoreVertical" size={16} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleAction(onEdit)}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
            >
              <ApperIcon name="Edit" size={14} />
              Edit Prompt
            </button>
            
            {onViewVersions && (
              <button
                onClick={() => handleAction(onViewVersions)}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
              >
                <ApperIcon name="GitBranch" size={14} />
                Version History
              </button>
            )}
            
            <hr className="my-1 border-slate-200" />
            
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
            >
              <ApperIcon name="Trash2" size={14} />
              Delete Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;