import promptData from "@/services/mockData/prompts.json";

const STORAGE_KEY = "prompt_deploy_prompts";

// Initialize localStorage with default data if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promptData));
    return promptData;
  }
  return JSON.parse(stored);
};

// Get data from localStorage
const getStoredData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initializeStorage();
};

// Save data to localStorage
const saveToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const promptService = {
  async getAll() {
    await delay();
    const data = getStoredData();
    return [...data]; // Return a copy to prevent mutations
  },

  async getById(id) {
    await delay(200);
    const data = getStoredData();
    const prompt = data.find(item => item.Id === parseInt(id));
    return prompt ? { ...prompt } : null;
  },

async create(prompt) {
    await delay(400);
    const data = getStoredData();
    
    // Find the highest existing Id and add 1
    const maxId = data.reduce((max, item) => Math.max(max, item.Id), 0);
    const newId = maxId + 1;
    
    const now = new Date().toISOString();
    const newPrompt = {
      Id: newId,
      name: prompt.name,
      description: prompt.description,
      model: prompt.model,
      modelVersion: prompt.modelVersion,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      provider: prompt.provider,
      status: prompt.status,
      tags: prompt.tags || [],
      category: prompt.category || "",
      environment: prompt.environment || "Development",
      deploymentUrl: prompt.deploymentUrl || "",
      deploymentDate: prompt.deploymentDate || null,
      totalUsage: prompt.totalUsage || 0,
      successRate: prompt.successRate || 0,
      avgResponseTime: prompt.avgResponseTime || 0,
      costPerRequest: prompt.costPerRequest || 0,
      totalCost: prompt.totalCost || 0,
      createdDate: now,
      updatedDate: now,
      currentVersion: "1.0.0",
      versions: [
        {
          version: "1.0.0",
          changeLog: "Initial version created",
          createdDate: now,
          changes: {
            type: "created",
            description: "Prompt created with initial configuration"
          },
          deploymentInfo: {
            environment: prompt.environment || "Development",
            deploymentUrl: prompt.deploymentUrl || "",
            deploymentDate: prompt.deploymentDate || null
          }
        }
      ]
    };
    
    const updatedData = [...data, newPrompt];
    saveToStorage(updatedData);
    
    return { ...newPrompt };
  },

async update(id, promptData) {
    await delay(350);
    const data = getStoredData();
    const index = data.findIndex(item => item.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Prompt not found");
    }
    
    const currentPrompt = data[index];
    const now = new Date().toISOString();
    
    // Generate new version number (increment patch version)
    const currentVersion = currentPrompt.currentVersion || "1.0.0";
    const versionParts = currentVersion.split(".");
    const newPatchVersion = parseInt(versionParts[2]) + 1;
    const newVersion = `${versionParts[0]}.${versionParts[1]}.${newPatchVersion}`;
    
    // Determine what changed
    const changes = this.getChanges(currentPrompt, promptData);
    
    const updatedPrompt = {
      ...currentPrompt,
      name: promptData.name,
      description: promptData.description,
      model: promptData.model,
      modelVersion: promptData.modelVersion,
      temperature: promptData.temperature,
      maxTokens: promptData.maxTokens,
      provider: promptData.provider,
      status: promptData.status,
      tags: promptData.tags || [],
      category: promptData.category || "",
      environment: promptData.environment || "Development",
      deploymentUrl: promptData.deploymentUrl || "",
      deploymentDate: promptData.deploymentDate || null,
      totalUsage: promptData.totalUsage || 0,
      successRate: promptData.successRate || 0,
      avgResponseTime: promptData.avgResponseTime || 0,
      costPerRequest: promptData.costPerRequest || 0,
      totalCost: promptData.totalCost || 0,
      Id: parseInt(id), // Ensure Id remains unchanged
      createdDate: currentPrompt.createdDate, // Preserve original creation date
      updatedDate: now,
      currentVersion: newVersion,
      versions: [
        ...(currentPrompt.versions || []),
        {
          version: newVersion,
          changeLog: promptData.changeLog || "Prompt updated",
          createdDate: now,
          changes: changes,
          deploymentInfo: {
            environment: promptData.environment || "Development",
            deploymentUrl: promptData.deploymentUrl || "",
            deploymentDate: promptData.deploymentDate || null
          }
        }
      ]
    };
    
    data[index] = updatedPrompt;
    saveToStorage(data);
    
    return { ...updatedPrompt };
  },

  // Helper method to determine changes between versions
  getChanges(oldPrompt, newPrompt) {
    const changes = {
      type: "updated",
      fields: [],
      description: ""
    };

    const fieldsToCheck = [
      'name', 'description', 'model', 'modelVersion', 'temperature', 
      'maxTokens', 'provider', 'status', 'category', 'environment', 
      'deploymentUrl', 'totalUsage', 'successRate', 'avgResponseTime', 
      'costPerRequest', 'totalCost'
    ];

    fieldsToCheck.forEach(field => {
      if (oldPrompt[field] !== newPrompt[field]) {
        changes.fields.push({
          field,
          oldValue: oldPrompt[field],
          newValue: newPrompt[field]
        });
      }
    });

    // Check tags separately (array comparison)
    const oldTags = (oldPrompt.tags || []).sort();
    const newTags = (newPrompt.tags || []).sort();
    if (JSON.stringify(oldTags) !== JSON.stringify(newTags)) {
      changes.fields.push({
        field: 'tags',
        oldValue: oldPrompt.tags,
        newValue: newPrompt.tags
      });
    }

    // Generate description based on changes
    if (changes.fields.length > 0) {
      const fieldNames = changes.fields.map(c => c.field);
      changes.description = `Updated ${fieldNames.join(', ')}`;
    } else {
      changes.description = "Minor updates";
    }

    return changes;
  },

  // Get version history for a prompt
  async getVersionHistory(id) {
    await delay(200);
    const data = getStoredData();
    const prompt = data.find(item => item.Id === parseInt(id));
    
    if (!prompt) {
      throw new Error("Prompt not found");
    }

    return prompt.versions || [];
  },

  // Get specific version of a prompt
  async getVersion(id, version) {
    await delay(200);
    const data = getStoredData();
    const prompt = data.find(item => item.Id === parseInt(id));
    
    if (!prompt) {
      throw new Error("Prompt not found");
    }

    const versionData = prompt.versions?.find(v => v.version === version);
    if (!versionData) {
      throw new Error("Version not found");
    }

    return versionData;
  },

  async delete(id) {
    await delay(300);
    const data = getStoredData();
    const filteredData = data.filter(item => item.Id !== parseInt(id));
    
    if (filteredData.length === data.length) {
      throw new Error("Prompt not found");
    }
    
    saveToStorage(filteredData);
    return true;
  }
};