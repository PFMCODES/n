
const { path, fs } = require('./exports');
const os = require('os');

const USER_DATA_DIR = path.join(os.homedir(), '.nium');
const USER_DATA_FILE = path.join(USER_DATA_DIR, 'user-data.json');

const DEFAULT_USER_DATA = {
  author: '',
  scripts: {
    start: '',
  },
  build: '',
  projects: [],
  stats: {
    projectsCreated: 0,
    buildsRun: 0,
    lastActivity: null
  }
};

function ensureUserDataExists() {
  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(USER_DATA_FILE)) {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(DEFAULT_USER_DATA, null, 2));
  }
}

function getUserData() {
  ensureUserDataExists();
  try {
    const userData = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf8'));
    return { ...DEFAULT_USER_DATA, ...userData };
  } catch (error) {
    console.warn('Error reading user data, using defaults:', error.message);
    return DEFAULT_USER_DATA;
  }
}

function setUserData(key, value) {
  const userData = getUserData();
  const keys = key.split('.');
  let current = userData;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error.message);
    return false;
  }
}

function addProject(name, type) {
  const userData = getUserData();
  const projectPath = process.cwd();
  
  // Check if project already exists
  const existingProject = userData.projects.find(p => p.path === projectPath);
  if (existingProject) {
    existingProject.name = name;
    existingProject.type = type;
  } else {
    userData.projects.push({
      name,
      type,
      path: projectPath,
      createdAt: new Date().toISOString()
    });
    userData.stats.projectsCreated++;
  }
  
  userData.stats.lastActivity = new Date().toISOString();
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving project data:', error.message);
    return false;
  }
}

function getUserProjects() {
  const userData = getUserData();
  return userData.projects || [];
}

function getUserStats() {
  const userData = getUserData();
  return userData.stats || DEFAULT_USER_DATA.stats;
}

function incrementBuildCount() {
  const userData = getUserData();
  userData.stats.buildsRun++;
  userData.stats.lastActivity = new Date().toISOString();
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Error updating build count:', error.message);
  }
}

module.exports = {
  getUserData,
  setUserData,
  addProject,
  getUserProjects,
  getUserStats,
  incrementBuildCount
};

function updateUserData(updates) {
  const userData = getUserData();
  const newUserData = deepMerge(userData, updates);
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(newUserData, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating user data:', error.message);
    return false;
  }
}

function addProject(projectData) {
  const userData = getUserData();
  const project = {
    name: projectData.name,
    path: projectData.path,
    type: projectData.type,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  userData.projects.push(project);
  userData.stats.projectsCreated++;
  userData.stats.lastActivity = new Date().toISOString();
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    return true;
  } catch (error) {
    console.error('Error adding project:', error.message);
    return false;
  }
}

function incrementBuildCount() {
  const userData = getUserData();
  userData.stats.buildsRun++;
  userData.stats.lastActivity = new Date().toISOString();
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    return true;
  } catch (error) {
    console.error('Error incrementing build count:', error.message);
    return false;
  }
}

function getUserProjects() {
  const userData = getUserData();
  return userData.projects || [];
}

function removeProject(projectPath) {
  const userData = getUserData();
  userData.projects = userData.projects.filter(project => project.path !== projectPath);
  
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    return true;
  } catch (error) {
    console.error('Error removing project:', error.message);
    return false;
  }
}

function resetUserData() {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(DEFAULT_USER_DATA, null, 2));
    return true;
  } catch (error) {
    console.error('Error resetting user data:', error.message);
    return false;
  }
}

function getUserDataPath() {
  return USER_DATA_FILE;
}

function getUserStats() {
  const userData = getUserData();
  return userData.stats;
}

function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

module.exports = {
  getUserData,
  setUserData,
  updateUserData,
  addProject,
  incrementBuildCount,
  getUserProjects,
  removeProject,
  resetUserData,
  getUserDataPath,
  getUserStats,
  DEFAULT_USER_DATA
};
