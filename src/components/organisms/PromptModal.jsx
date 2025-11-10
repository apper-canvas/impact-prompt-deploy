import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const AI_MODELS = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    version: "gpt-4-0125-preview",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096
  },
  {
    id: "gpt-35-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI", 
    version: "gpt-3.5-turbo-0125",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096
  },
  {
    id: "claude-3-opus",
    name: "Claude-3 Opus",
    provider: "Anthropic",
    version: "claude-3-opus-20240229",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096
  },
  {
    id: "claude-3-sonnet",
    name: "Claude-3 Sonnet", 
    provider: "Anthropic",
    version: "claude-3-sonnet-20240229",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    version: "gemini-1.0-pro-latest",
    defaultTemperature: 0.9,
    defaultMaxTokens: 2048
  },
  {
    id: "llama-2-70b",
    name: "LLaMA-2 70B",
    provider: "Meta",
    version: "llama-2-70b-chat",
    defaultTemperature: 0.8,
    defaultMaxTokens: 2048
  },
  {
    id: "command",
    name: "Cohere Command",
    provider: "Cohere", 
    version: "command-r-plus",
    defaultTemperature: 0.3,
    defaultMaxTokens: 4000
  }
];

const STATUSES = [
  "Active",
  "Inactive", 
  "Draft"
];

const PromptModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  prompt = null, 
  loading = false 
}) => {
const [formData, setFormData] = useState({
    name: "",
    description: "",
    model: "",
    modelVersion: "",
    temperature: 0.7,
    maxTokens: 4096,
    provider: "",
    status: "Draft"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (prompt) {
setFormData({
        name: prompt.name || "",
        description: prompt.description || "",
        model: prompt.model || "",
        modelVersion: prompt.modelVersion || "",
        temperature: prompt.temperature || 0.7,
        maxTokens: prompt.maxTokens || 4096,
        provider: prompt.provider || "",
        status: prompt.status || "Draft"
      });
    } else {
      setFormData({
        name: "",
        description: "",
        model: "",
        modelVersion: "",
        temperature: 0.7,
        maxTokens: 4096,
        provider: "",
        status: "Draft"
      });
    }
    setErrors({});
  }, [prompt, isOpen]);

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.model) {
      newErrors.model = "Model selection is required";
    }

    if (!formData.modelVersion.trim()) {
      newErrors.modelVersion = "Model version is required";
    }

    if (formData.temperature < 0 || formData.temperature > 2) {
      newErrors.temperature = "Temperature must be between 0.0 and 2.0";
    }

    if (formData.maxTokens < 100 || formData.maxTokens > 8000) {
      newErrors.maxTokens = "Max tokens must be between 100 and 8000";
    }

    if (!formData.provider.trim()) {
      newErrors.provider = "Provider is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {prompt ? "Edit Prompt" : "Add New Prompt"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-100"
              disabled={loading}
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
<form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <FormField
              label="Name"
              error={errors.name}
              required
            >
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Customer Support Assistant"
                error={!!errors.name}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Description"
              error={errors.description}
              required
            >
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Briefly describe what this prompt does..."
                rows={3}
                disabled={loading}
                className={`flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
                }`}
              />
            </FormField>

            <FormField
              label="AI Model"
              error={errors.model}
              required
            >
              <Select
                value={formData.model}
                onChange={(e) => {
                  const selectedModel = AI_MODELS.find(model => model.id === e.target.value);
                  handleInputChange("model", e.target.value);
                  if (selectedModel) {
                    handleInputChange("modelVersion", selectedModel.version);
                    handleInputChange("temperature", selectedModel.defaultTemperature);
                    handleInputChange("maxTokens", selectedModel.defaultMaxTokens);
                    handleInputChange("provider", selectedModel.provider);
                  }
                }}
                error={!!errors.model}
                disabled={loading}
              >
                <option value="">Select a model...</option>
                {AI_MODELS.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </Select>
            </FormField>

            {formData.model && (
              <>
                <FormField
                  label="Provider"
                  error={errors.provider}
                  required
                >
                  <Input
                    value={formData.provider}
                    onChange={(e) => handleInputChange("provider", e.target.value)}
                    placeholder="e.g., OpenAI, Anthropic"
                    error={!!errors.provider}
                    disabled={loading}
                  />
                </FormField>

                <FormField
                  label="Model Version"
                  error={errors.modelVersion}
                  required
                >
                  <Input
                    value={formData.modelVersion}
                    onChange={(e) => handleInputChange("modelVersion", e.target.value)}
                    placeholder="e.g., gpt-4-0125-preview"
                    error={!!errors.modelVersion}
                    disabled={loading}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Temperature"
                    error={errors.temperature}
                    required
                  >
                    <Input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange("temperature", parseFloat(e.target.value) || 0)}
                      placeholder="0.7"
                      error={!!errors.temperature}
                      disabled={loading}
                    />
                  </FormField>

                  <FormField
                    label="Max Tokens"
                    error={errors.maxTokens}
                    required
                  >
                    <Input
                      type="number"
                      min="100"
                      max="8000"
                      step="100"
                      value={formData.maxTokens}
                      onChange={(e) => handleInputChange("maxTokens", parseInt(e.target.value) || 0)}
                      placeholder="4096"
                      error={!!errors.maxTokens}
                      disabled={loading}
                    />
                  </FormField>
                </div>
              </>
            )}

            <FormField
              label="Status"
            >
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                disabled={loading}
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </FormField>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[80px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{prompt ? "Update" : "Create"}</span>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PromptModal;