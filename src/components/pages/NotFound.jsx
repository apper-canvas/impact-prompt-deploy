import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-slate-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <ApperIcon name="FileQuestion" className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Help */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help? Check out the{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              prompt management dashboard
            </button>
            {" "}or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;