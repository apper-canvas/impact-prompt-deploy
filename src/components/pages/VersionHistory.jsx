import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { promptService } from '@/services/api/promptService';
import { ApperIcon } from '@/components/ApperIcon';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Loading } from '@/components/ui/Loading';
import { ErrorView } from '@/components/ui/ErrorView';
import { toast } from 'react-toastify';

const VersionHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVersions, setSelectedVersions] = useState([]);

  useEffect(() => {
    loadPromptAndVersions();
  }, [id]);

  const loadPromptAndVersions = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [promptData, versionData] = await Promise.all([
        promptService.getById(id),
        promptService.getVersionHistory(id)
      ]);

      if (!promptData) {
        setError("Prompt not found");
        return;
      }

      setPrompt(promptData);
      setVersions(versionData.reverse()); // Show newest first
    } catch (err) {
      setError("Failed to load version history. Please try again.");
      console.error("Error loading version history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionSelect = (version) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, version]);
    } else {
      toast.info("You can only compare 2 versions at a time");
    }
  };

  const handleCompareVersions = () => {
    if (selectedVersions.length !== 2) {
      toast.error("Please select exactly 2 versions to compare");
      return;
    }

    navigate(`/versions/${id}/compare/${selectedVersions[0]}/${selectedVersions[1]}`);
  };

  const getChangeTypeColor = (changeType) => {
    switch (changeType) {
      case 'created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deployed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnvironmentColor = (environment) => {
    switch (environment) {
      case 'Production':
        return 'bg-green-100 text-green-800';
      case 'Staging':
        return 'bg-yellow-100 text-yellow-800';
      case 'Development':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadPromptAndVersions} />;
  if (!prompt) return <ErrorView message="Prompt not found" />;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">{prompt.name}</h1>
              <p className="text-secondary mt-1">Version History & Timeline</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono">
                Current: v{prompt.currentVersion}
              </Badge>
              <Badge variant="secondary">
                {versions.length} version{versions.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {selectedVersions.length === 2 && (
              <Button
                onClick={handleCompareVersions}
                className="bg-accent text-white hover:bg-accent/90"
              >
                <ApperIcon name="GitCompare" size={16} className="mr-2" />
                Compare Versions
              </Button>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <ApperIcon name="Clock" size={20} />
              Version Timeline
            </h2>
            <p className="text-secondary text-sm mt-1">
              Click on versions to select them for comparison
            </p>
          </div>

          <div className="p-6">
            {versions.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="GitBranch" size={48} className="text-slate-400 mx-auto mb-4" />
                <p className="text-secondary">No version history available</p>
              </div>
            ) : (
              <div className="space-y-6">
                {versions.map((version, index) => (
                  <div
                    key={version.version}
                    className={`relative flex items-start gap-6 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedVersions.includes(version.version)
                        ? 'border-accent bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                    onClick={() => handleVersionSelect(version.version)}
                  >
                    {/* Timeline connector */}
                    <div className="relative">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedVersions.includes(version.version)
                          ? 'bg-accent border-accent'
                          : 'bg-white border-slate-300'
                      }`} />
                      {index < versions.length - 1 && (
                        <div className="absolute top-4 left-2 w-0.5 h-12 bg-slate-300" />
                      )}
                    </div>

                    {/* Version content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono font-medium">
                            v{version.version}
                          </Badge>
                          <Badge className={getChangeTypeColor(version.changes?.type || 'updated')}>
                            {version.changes?.type || 'Updated'}
                          </Badge>
                          {version.version === prompt.currentVersion && (
                            <Badge variant="success" size="sm">Current</Badge>
                          )}
                        </div>
                        <div className="text-sm text-secondary">
                          {format(new Date(version.createdDate), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>

                      <h3 className="font-medium text-primary mb-2">
                        {version.changeLog}
                      </h3>

                      {version.changes?.description && (
                        <p className="text-sm text-secondary mb-3">
                          {version.changes.description}
                        </p>
                      )}

                      {/* Change details */}
                      {version.changes?.fields && version.changes.fields.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Changes:</h4>
                          <div className="space-y-1">
                            {version.changes.fields.slice(0, 3).map((change, changeIndex) => (
                              <div key={changeIndex} className="text-xs bg-slate-50 p-2 rounded border">
                                <span className="font-medium">{change.field}:</span>
                                <span className="text-red-600 line-through ml-2">
                                  {typeof change.oldValue === 'object' 
                                    ? JSON.stringify(change.oldValue)
                                    : String(change.oldValue || 'empty')
                                  }
                                </span>
                                <span className="mx-2">→</span>
                                <span className="text-green-600">
                                  {typeof change.newValue === 'object'
                                    ? JSON.stringify(change.newValue)  
                                    : String(change.newValue || 'empty')
                                  }
                                </span>
                              </div>
                            ))}
                            {version.changes.fields.length > 3 && (
                              <div className="text-xs text-secondary">
                                +{version.changes.fields.length - 3} more changes
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Deployment info */}
                      {version.deploymentInfo && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Server" size={14} />
                            <Badge className={getEnvironmentColor(version.deploymentInfo.environment)} size="sm">
                              {version.deploymentInfo.environment}
                            </Badge>
                          </div>
                          {version.deploymentInfo.deploymentUrl && (
                            <a
                              href={version.deploymentInfo.deploymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ApperIcon name="ExternalLink" size={14} />
                              Deployment
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {selectedVersions.includes(version.version) && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <ApperIcon name="Check" size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            to="/"
            className="text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            {selectedVersions.length > 0 && (
              <Button
                onClick={() => setSelectedVersions([])}
                variant="outline"
                size="sm"
              >
                Clear Selection ({selectedVersions.length})
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;