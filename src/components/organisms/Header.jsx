import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onAddPrompt }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Prompt Deploy</h1>
          </div>
        </div>
        
        <Button 
          onClick={onAddPrompt}
          variant="primary"
          className="inline-flex items-center space-x-2 btn-hover"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Prompt</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;