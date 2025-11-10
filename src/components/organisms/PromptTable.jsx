import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ActionMenu from "@/components/molecules/ActionMenu";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";

// AI Models configuration for display purposes
const AI_MODELS = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    version: "gpt-4-0125-preview",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
  },
  {
    id: "gpt-35-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    version: "gpt-3.5-turbo-0125",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
  },
  {
    id: "claude-3-opus",
    name: "Claude-3 Opus",
    provider: "Anthropic",
    version: "claude-3-opus-20240229",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
  },
  {
    id: "claude-3-sonnet",
    name: "Claude-3 Sonnet",
    provider: "Anthropic",
    version: "claude-3-sonnet-20240229",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
  },
  {
    id: "claude-3-haiku",
    name: "Claude-3 Haiku",
    provider: "Anthropic",
    version: "claude-3-haiku-20240307",
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    version: "gemini-1.0-pro",
    defaultTemperature: 0.7,
    defaultMaxTokens: 2048,
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "Google", 
    version: "gemini-1.5-flash",
    defaultTemperature: 0.7,
    defaultMaxTokens: 8192,
  },
];

const PromptTable = ({ prompts, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdDate", direction: "desc" });
  const [modelFilter, setModelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
// Extract unique filter options from prompts
  const filterOptions = useMemo(() => {
    const models = [...new Set(prompts.map(p => p.model).filter(Boolean))].sort();
    const statuses = [...new Set(prompts.map(p => p.status).filter(Boolean))].sort();
    const categories = [...new Set(prompts.map(p => p.category).filter(Boolean))].sort();
    const providers = [...new Set(prompts.map(p => p.provider).filter(Boolean))].sort();
    
    return { models, statuses, categories, providers };
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      // Text search filter
      const matchesSearch = !searchTerm || (
        prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Dropdown filters
      const matchesModel = !modelFilter || prompt.model === modelFilter;
      const matchesStatus = !statusFilter || prompt.status === statusFilter;
      const matchesCategory = !categoryFilter || prompt.category === categoryFilter;
      const matchesProvider = !providerFilter || prompt.provider === providerFilter;

      return matchesSearch && matchesModel && matchesStatus && matchesCategory && matchesProvider;
    });
  }, [prompts, searchTerm, modelFilter, statusFilter, categoryFilter, providerFilter]);

  const sortedPrompts = useMemo(() => {
    const sorted = [...filteredPrompts];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
const aValue = sortConfig.key === "createdDate" || sortConfig.key === "updatedDate" || sortConfig.key === "deploymentDate"
          ? new Date(a[sortConfig.key] || 0).getTime()
          : a[sortConfig.key];
        const bValue = sortConfig.key === "createdDate" || sortConfig.key === "updatedDate" || sortConfig.key === "deploymentDate"
          ? new Date(b[sortConfig.key] || 0).getTime()
          : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredPrompts, sortConfig]);

const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  const SortButton = ({ sortKey, children }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center space-x-1 text-left font-medium text-slate-900 hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      <ApperIcon 
        name={
          sortConfig.key === sortKey 
            ? (sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown")
            : "ChevronsUpDown"
        }
        className="w-4 h-4"
      />
    </button>
  );

  return (
<div className="space-y-4">
      {/* Filter Controls */}
      <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
            <Select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Models</option>
              {filterOptions.models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
            <Select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Providers</option>
              {filterOptions.providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(modelFilter || statusFilter || categoryFilter || providerFilter) && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setModelFilter("");
                setStatusFilter("");
                setCategoryFilter("");
                setProviderFilter("");
              }}
              className="text-sm"
            >
              <ApperIcon name="X" size={14} className="mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Search and Results */}
      <div className="flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or description..."
          className="w-96"
        />
        <div className="text-sm text-slate-600">
          {sortedPrompts.length} prompt{sortedPrompts.length !== 1 ? "s" : ""}
          {(searchTerm || modelFilter || statusFilter || categoryFilter || providerFilter) && (
            <span className="ml-2 text-blue-600">
              (filtered from {prompts.length})
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
<th className="px-6 py-4 text-left">
                  <SortButton sortKey="name">Name</SortButton>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortButton sortKey="model">Model</SortButton>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortButton sortKey="status">Status</SortButton>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortButton sortKey="category">Category</SortButton>
                </th>
                <th className="px-6 py-4 text-left">Tags</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort("environment")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Environment</span>
                    {sortConfig.key === "environment" && (
                      <ApperIcon name={sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown"} size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort("deploymentDate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Deployed</span>
                    {sortConfig.key === "deploymentDate" && (
                      <ApperIcon name={sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown"} size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortButton sortKey="createdDate">Created</SortButton>
                </th>
                <th className="px-6 py-4 text-left w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
{sortedPrompts.map((prompt) => (
                <tr 
                  key={prompt.Id} 
                  className="table-row hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900">
                        {prompt.name}
                      </div>
                      <div className="text-sm text-slate-600 mt-1 max-w-md truncate">
                        {prompt.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {AI_MODELS.find(m => m.id === prompt.model)?.name || prompt.model}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {prompt.provider}
                        </Badge>
                      </div>
                      {prompt.temperature !== undefined && prompt.maxTokens !== undefined && (
                        <div className="text-xs text-slate-500">
                          T: {prompt.temperature} • Max: {prompt.maxTokens}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={prompt.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-secondary">
                    {prompt.category && (
                      <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                        {prompt.category}
                      </Badge>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                          <Badge className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            +{prompt.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          prompt.environment === "Production" ? "success" :
                          prompt.environment === "Staging" ? "warning" : "secondary"
                        }
                        size="sm"
                      >
                        {prompt.environment}
                      </Badge>
                      {prompt.deploymentUrl && (
                        <a 
                          href={prompt.deploymentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View deployment"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {prompt.deploymentDate 
                      ? format(new Date(prompt.deploymentDate), "MMM d, yyyy") 
                      : "Not deployed"
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {format(new Date(prompt.createdDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <ActionMenu
                      onEdit={() => onEdit(prompt)}
                      onDelete={() => onDelete(prompt)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedPrompts.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No prompts found</h3>
            <p className="text-slate-600">
              {searchTerm 
                ? "Try adjusting your search terms to find what you're looking for."
                : "Get started by adding your first prompt."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptTable;