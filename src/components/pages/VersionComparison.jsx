import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { promptService } from '@/services/api/promptService';
import { ApperIcon } from '@/components/ApperIcon';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Loading } from '@/components/ui/Loading';
import { ErrorView } from '@/components/ui/ErrorView';

const VersionComparison = () => {
  const { id, version1, version2 } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [versionData1, setVersionData1] = useState(null);
  const [versionData2, setVersionData2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVersionComparison();
  }, [id, version1, version2]);

  const loadVersionComparison = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [promptData, v1Data, v2Data] = await Promise.all([
        promptService.getById(id),
        promptService.getVersion(id, version1),
        promptService.getVersion(id, version2)
      ]);

      if (!promptData) {
        setError("Prompt not found");
        return;
      }

      setPrompt(promptData);
      setVersionData1(v1Data);
      setVersionData2(v2Data);
    } catch (err) {
      setError("Failed to load version comparison. Please try again.");
      console.error("Error loading version comparison:", err);
    } finally {
      setLoading(false);
    }
  };

  const getComparisonData = () => {
    if (!versionData1 || !versionData2) return [];

    const fields = [
      { key: 'version', label: 'Version', type: 'text' },
      { key: 'changeLog', label: 'Change Log', type: 'text' },
      { key: 'createdDate', label: 'Created Date', type: 'date' },
      { key: 'changes.description', label: 'Changes Description', type: 'text' },
      { key: 'deploymentInfo.environment', label: 'Environment', type: 'badge' },
      { key: 'deploymentInfo.deploymentUrl', label: 'Deployment URL', type: 'url' },
      { key: 'deploymentInfo.deploymentDate', label: 'Deployment Date', type: 'date' }
    ];

    return fields.map(field => {
      const getValue = (data, key) => {
        const keys = key.split('.');
        let value = data;
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }
        return value;
      };

      const value1 = getValue(versionData1, field.key);
      const value2 = getValue(versionData2, field.key);
      const isDifferent = JSON.stringify(value1) !== JSON.stringify(value2);

      return {
        ...field,
        value1,
        value2,
        isDifferent
      };
    });
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-slate-400 italic">Not set</span>;
    }

    switch (type) {
      case 'date':
        return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
      case 'badge':
        const envColors = {
          'Production': 'bg-green-100 text-green-800',
          'Staging': 'bg-yellow-100 text-yellow-800',
          'Development': 'bg-gray-100 text-gray-800'
        };
        return (
          <Badge className={envColors[value] || 'bg-gray-100 text-gray-800'} size="sm">
            {value}
          </Badge>
        );
      case 'url':
        return value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
          >
            <ApperIcon name="ExternalLink" size={14} />
            View
          </a>
        ) : <span className="text-slate-400 italic">Not set</span>;
      case 'text':
      default:
        return String(value);
    }
  };

  const getChangeHighlight = (isDifferent) => {
    return isDifferent ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-200';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadVersionComparison} />;
  if (!prompt || !versionData1 || !versionData2) {
    return <ErrorView message="Version data not found" />;
  }

  const comparisonData = getComparisonData();
  const hasChanges = comparisonData.some(item => item.isDifferent);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => navigate(`/versions/${id}`)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">{prompt.name}</h1>
              <p className="text-secondary mt-1">Version Comparison</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="font-mono">
              Comparing v{version1} vs v{version2}
            </Badge>
            {hasChanges ? (
              <Badge variant="warning" size="sm">
                {comparisonData.filter(item => item.isDifferent).length} differences found
              </Badge>
            ) : (
              <Badge variant="success" size="sm">No differences</Badge>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <ApperIcon name="GitCompare" size={20} />
              Side-by-Side Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Version {version1}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Version {version2}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 w-20">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparisonData.map((item, index) => (
                  <tr 
                    key={item.key}
                    className={`hover:bg-slate-50 transition-colors ${getChangeHighlight(item.isDifferent)}`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatValue(item.value1, item.type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatValue(item.value2, item.type)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.isDifferent ? (
                        <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600" />
                      ) : (
                        <ApperIcon name="Check" size={16} className="text-green-600" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Changes Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Version 1 Details */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200 bg-blue-50">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Badge variant="outline" className="font-mono">v{version1}</Badge>
                Version Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Change Log</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                  {versionData1.changeLog || 'No change log available'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Created</h4>
                <p className="text-sm text-slate-600">
                  {format(new Date(versionData1.createdDate), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              {versionData1.changes?.fields && versionData1.changes.fields.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Fields Changed ({versionData1.changes.fields.length})
                  </h4>
                  <div className="space-y-2">
                    {versionData1.changes.fields.slice(0, 5).map((change, idx) => (
                      <div key={idx} className="text-xs bg-slate-50 p-2 rounded border">
                        <span className="font-medium">{change.field}</span>
                      </div>
                    ))}
                    {versionData1.changes.fields.length > 5 && (
                      <div className="text-xs text-slate-500">
                        +{versionData1.changes.fields.length - 5} more fields
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Version 2 Details */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200 bg-green-50">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Badge variant="outline" className="font-mono">v{version2}</Badge>
                Version Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Change Log</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                  {versionData2.changeLog || 'No change log available'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Created</h4>
                <p className="text-sm text-slate-600">
                  {format(new Date(versionData2.createdDate), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              {versionData2.changes?.fields && versionData2.changes.fields.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Fields Changed ({versionData2.changes.fields.length})
                  </h4>
                  <div className="space-y-2">
                    {versionData2.changes.fields.slice(0, 5).map((change, idx) => (
                      <div key={idx} className="text-xs bg-slate-50 p-2 rounded border">
                        <span className="font-medium">{change.field}</span>
                      </div>
                    ))}
                    {versionData2.changes.fields.length > 5 && (
                      <div className="text-xs text-slate-500">
                        +{versionData2.changes.fields.length - 5} more fields
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            to={`/versions/${id}`}
            className="text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Version History
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionComparison;