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
      ...prompt,
      createdDate: now,
      updatedDate: now
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
    
    const updatedPrompt = {
      ...data[index],
      ...promptData,
      Id: parseInt(id), // Ensure Id remains unchanged
      updatedDate: new Date().toISOString()
    };
    
    data[index] = updatedPrompt;
    saveToStorage(data);
    
    return { ...updatedPrompt };
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