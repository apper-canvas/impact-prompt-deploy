import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const DetailedPromptModal = ({ 
  isOpen, 
  onClose, 
  prompt 
}) => {
  const [activeTab, setActiveTab] = useState("basic");

  if (!isOpen || !prompt) return null;

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "Info" },
    { id: "model", label: "Model Config", icon: "Settings" },
    { id: "deployment", label: "Deployment", icon: "Globe" },
    { id: "metrics", label: "Metrics", icon: "BarChart3" },
    { id: "versions", label: "Version History", icon: "GitBranch" }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toLocaleString() || "0";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount || 0);
  };

  const formatPercentage = (value) => `${(value || 0).toFixed(1)}%`;
  
  const formatResponseTime = (ms) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
    return `${ms || 0}ms`;
  };

  const getPerformanceColor = (value, type) => {
    if (type === 'successRate') {
      if (value >= 95) return 'bg-green-50 border-green-200 text-green-900';
      if (value >= 85) return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      return 'bg-red-50 border-red-200 text-red-900';
    }
    if (type === 'responseTime') {
      if (value <= 200) return 'bg-green-50 border-green-200 text-green-900';
      if (value <= 500) return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      return 'bg-red-50 border-red-200 text-red-900';
    }
    return 'bg-slate-50 border-slate-200 text-slate-900';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived': return 'bg-red-100 text-red-800 border-red-200';
      case 'Testing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Name</label>
          <div className="text-lg font-semibold text-slate-900">{prompt.name}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
          <Badge className={`${getStatusColor(prompt.status)} px-3 py-1 rounded-full text-sm font-medium border`}>
            {prompt.status}
          </Badge>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
        <div className="text-slate-900 bg-slate-50 p-4 rounded-lg border">
          {prompt.description || "No description provided"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
          <div className="text-slate-900">{prompt.category || "Uncategorized"}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Created</label>
          <div className="text-slate-900">
            {prompt.createdDate ? format(new Date(prompt.createdDate), "MMM d, yyyy 'at' HH:mm") : "Unknown"}
          </div>
        </div>
      </div>

      {prompt.tags && prompt.tags.length > 0 && (
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag, index) => (
              <Badge key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderModelConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">AI Model</label>
          <div className="text-lg font-semibold text-slate-900">{prompt.model || "Not specified"}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Provider</label>
          <div className="text-slate-900">{prompt.provider || "Not specified"}</div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Model Version</label>
        <div className="text-slate-900 bg-slate-50 p-3 rounded-lg border font-mono text-sm">
          {prompt.modelVersion || "Not specified"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Temperature</label>
          <div className="text-slate-900 bg-slate-50 p-3 rounded-lg border">
            {prompt.temperature !== undefined ? prompt.temperature : "Not set"}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Max Tokens</label>
          <div className="text-slate-900 bg-slate-50 p-3 rounded-lg border">
            {prompt.maxTokens ? formatNumber(prompt.maxTokens) : "Not set"}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Environment</label>
          <Badge className={`px-3 py-1 rounded-full text-sm font-medium border ${
            prompt.environment === 'Production' ? 'bg-green-100 text-green-800 border-green-200' :
            prompt.environment === 'Staging' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            {prompt.environment || "Development"}
          </Badge>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Deployment Date</label>
          <div className="text-slate-900">
            {prompt.deploymentDate ? format(new Date(prompt.deploymentDate), "MMM d, yyyy 'at' HH:mm") : "Not deployed"}
          </div>
        </div>
      </div>

      {prompt.deploymentUrl && (
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Deployment URL</label>
          <div className="bg-slate-50 p-3 rounded-lg border">
            <a 
              href={prompt.deploymentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-mono text-sm break-all flex items-center gap-2"
            >
              {prompt.deploymentUrl}
              <ApperIcon name="ExternalLink" size={14} />
            </a>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Last Updated</label>
        <div className="text-slate-900">
          {prompt.updatedDate ? format(new Date(prompt.updatedDate), "MMM d, yyyy 'at' HH:mm") : "Never"}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Usage */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ApperIcon name="Activity" size={18} className="text-blue-600" />
              <h5 className="text-sm font-medium text-blue-900">Total Usage</h5>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {formatNumber(prompt.totalUsage || 0)}
          </div>
          <div className="text-xs text-blue-600">requests processed</div>
        </div>

        {/* Success Rate */}
        <div className={`border rounded-lg p-4 ${getPerformanceColor(prompt.successRate || 0, 'successRate')}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={18} />
              <h5 className="text-sm font-medium">Success Rate</h5>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatPercentage(prompt.successRate || 0)}
          </div>
          <div className="text-xs opacity-75">completion rate</div>
        </div>

        {/* Average Response Time */}
        <div className={`border rounded-lg p-4 ${getPerformanceColor(prompt.avgResponseTime || 0, 'responseTime')}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={18} />
              <h5 className="text-sm font-medium">Avg Response</h5>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatResponseTime(prompt.avgResponseTime || 0)}
          </div>
          <div className="text-xs opacity-75">response time</div>
        </div>

        {/* Total Cost */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ApperIcon name="DollarSign" size={18} className="text-purple-600" />
              <h5 className="text-sm font-medium text-purple-900">Total Cost</h5>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-900 mb-1">
            {formatCurrency(prompt.totalCost || 0)}
          </div>
          <div className="text-xs text-purple-600">
            {formatCurrency(prompt.costPerRequest || 0)} per request
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Cost per Request</label>
          <div className="text-lg font-semibold text-slate-900">
            {formatCurrency(prompt.costPerRequest || 0)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Current Version</label>
          <div className="text-lg font-semibold text-slate-900">
            v{prompt.currentVersion || "1.0.0"}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVersionHistory = () => (
    <div className="space-y-4">
      {prompt.versions && prompt.versions.length > 0 ? (
        <div className="space-y-3">
          {[...prompt.versions].reverse().map((version, index) => (
            <div key={version.version} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm font-mono font-semibold">
                    v{version.version}
                  </Badge>
                  {index === 0 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-slate-500">
                  {format(new Date(version.createdDate), "MMM d, yyyy 'at' HH:mm")}
                </div>
              </div>
              
              {version.changeLog && (
                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-sm font-medium text-slate-700 mb-1">Changes</div>
                  <div className="text-sm text-slate-600">{version.changeLog}</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 pt-3 border-t border-slate-200">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Environment</div>
                  <Badge className={`text-xs ${
                    version.environment === 'Production' ? 'bg-green-100 text-green-700' :
                    version.environment === 'Staging' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {version.environment || 'Development'}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Usage</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatNumber(version.totalUsage || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Success Rate</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatPercentage(version.successRate || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Avg Response</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatResponseTime(version.avgResponseTime || 0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="GitBranch" size={48} className="text-slate-300 mx-auto mb-4" />
          <div className="text-lg font-medium text-slate-900 mb-2">No Version History</div>
          <div className="text-sm text-slate-500">
            Version history will appear here as changes are made to this prompt.
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic": return renderBasicInfo();
      case "model": return renderModelConfig();
      case "deployment": return renderDeployment();
      case "metrics": return renderMetrics();
      case "versions": return renderVersionHistory();
      default: return renderBasicInfo();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <ApperIcon name="Eye" size={20} className="text-slate-600" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Prompt Details</h2>
                <div className="text-sm text-slate-500">{prompt.name}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b border-slate-200">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DetailedPromptModal;