import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { promptService } from "@/services/api/promptService";
import Header from "@/components/organisms/Header";
import PromptTable from "@/components/organisms/PromptTable";
import PromptModal from "@/components/organisms/PromptModal";
import DeleteModal from "@/components/organisms/DeleteModal";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const PromptDashboard = () => {
const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedPromptForVersion, setSelectedPromptForVersion] = useState(null);
const loadPrompts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await promptService.getAll();
      // Ensure performance metrics have default values
      const promptsWithMetrics = data.map(prompt => ({
        ...prompt,
        totalUsage: prompt.totalUsage || 0,
        successRate: prompt.successRate || 0,
        avgResponseTime: prompt.avgResponseTime || 0,
        costPerRequest: prompt.costPerRequest || 0,
        totalCost: prompt.totalCost || 0
      }));
      setPrompts(promptsWithMetrics);
    } catch (err) {
      setError("Failed to load prompts. Please try again.");
      console.error("Error loading prompts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleAddPrompt = () => {
    setSelectedPrompt(null);
    setIsModalOpen(true);
  };

  const handleEditPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setIsDeleteModalOpen(true);
  };

const handleSavePrompt = async (promptData) => {
    try {
      setModalLoading(true);
      
      if (selectedPrompt) {
        // Update existing prompt
        const updatedPrompt = await promptService.update(selectedPrompt.Id, promptData);
        setPrompts(prev => prev.map(p => p.Id === selectedPrompt.Id ? updatedPrompt : p));
        toast.success(`Prompt updated successfully! New version: ${updatedPrompt.currentVersion}`);
      } else {
        // Create new prompt
        const newPrompt = await promptService.create(promptData);
        setPrompts(prev => [...prev, newPrompt]);
        toast.success("Prompt created successfully!");
      }
      
      setIsModalOpen(false);
      setSelectedPrompt(null);
    } catch (err) {
      toast.error(selectedPrompt ? "Failed to update prompt" : "Failed to create prompt");
      console.error("Error saving prompt:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewVersions = (prompt) => {
    setSelectedPromptForVersion(prompt);
  };

  const handleCloseVersions = () => {
    setSelectedPromptForVersion(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPrompt) return;
    
    try {
      setModalLoading(true);
      await promptService.delete(selectedPrompt.Id);
      setPrompts(prev => prev.filter(p => p.Id !== selectedPrompt.Id));
      setIsDeleteModalOpen(false);
      setSelectedPrompt(null);
      toast.success("Prompt deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete prompt");
      console.error("Error deleting prompt:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!modalLoading) {
      setIsModalOpen(false);
      setSelectedPrompt(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!modalLoading) {
      setIsDeleteModalOpen(false);
      setSelectedPrompt(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAddPrompt={handleAddPrompt} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Loading />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAddPrompt={handleAddPrompt} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <ErrorView 
            message={error}
            onRetry={loadPrompts}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddPrompt={handleAddPrompt} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {prompts.length === 0 ? (
          <Empty 
            title="No prompts yet"
            description="Get started by creating your first AI prompt deployment to organize and track your prompts efficiently."
            actionLabel="Create Your First Prompt"
            onAction={handleAddPrompt}
          />
        ) : (
<PromptTable
            prompts={prompts}
            onEdit={handleEditPrompt}
            onDelete={handleDeletePrompt}
            onViewVersions={handleViewVersions}
          />
        )}
      </main>

      {/* Modals */}
      <PromptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePrompt}
        prompt={selectedPrompt}
        loading={modalLoading}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        prompt={selectedPrompt}
        loading={modalLoading}
      />
    </div>
  );
};

export default PromptDashboard;