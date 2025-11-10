import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const AI_MODELS = [
  "GPT-4",
  "GPT-3.5",
  "Claude-3",
  "Claude-2",
  "Gemini-Pro",
  "LLaMA-2",
  "PaLM-2",
  "Cohere-Command"
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
    status: "Draft"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (prompt) {
      setFormData({
        name: prompt.name || "",
        description: prompt.description || "",
        model: prompt.model || "",
        status: prompt.status || "Draft"
      });
    } else {
      setFormData({
        name: "",
        description: "",
        model: "",
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
                onChange={(e) => handleInputChange("model", e.target.value)}
                error={!!errors.model}
                disabled={loading}
              >
                <option value="">Select a model...</option>
                {AI_MODELS.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Select>
            </FormField>

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