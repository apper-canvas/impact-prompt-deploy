import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No prompts yet",
  description = "Get started by creating your first AI prompt deployment to organize and track your prompts efficiently.",
  actionLabel = "Create Your First Prompt",
  onAction,
  className = ""
}) => {
  return (
    <div className={`min-h-[500px] flex items-center justify-center ${className}`}>
      <div className="text-center space-y-8 max-w-lg mx-auto px-4">
        {/* Illustration */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
            <ApperIcon name="FileText" className="w-12 h-12 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Sparkles" className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action */}
        {onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            size="lg"
            className="inline-flex items-center space-x-2 btn-hover"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>{actionLabel}</span>
          </Button>
        )}
        
        {/* Additional info */}
        <div className="flex justify-center items-center space-x-6 text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Shield" className="w-4 h-4" />
            <span>Metadata only</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span>Quick management</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Lock" className="w-4 h-4" />
            <span>Secure tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;