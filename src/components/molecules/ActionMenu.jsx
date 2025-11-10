import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ActionMenu = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
        title="Edit prompt"
      >
        <ApperIcon name="Edit" className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
        title="Delete prompt"
      >
        <ApperIcon name="Trash2" className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionMenu;