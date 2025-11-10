import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import ActionMenu from "@/components/molecules/ActionMenu";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";

const PromptTable = ({ prompts, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdDate", direction: "desc" });

  const filteredPrompts = useMemo(() => {
return prompts.filter(prompt =>
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [prompts, searchTerm]);

  const sortedPrompts = useMemo(() => {
    const sorted = [...filteredPrompts];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = sortConfig.key === "createdDate" || sortConfig.key === "updatedDate" 
          ? new Date(a[sortConfig.key]).getTime()
          : a[sortConfig.key];
        const bValue = sortConfig.key === "createdDate" || sortConfig.key === "updatedDate"
          ? new Date(b[sortConfig.key]).getTime()
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
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, model, or description..."
          className="w-96"
        />
        <div className="text-sm text-slate-600">
          {sortedPrompts.length} prompt{sortedPrompts.length !== 1 ? "s" : ""}
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