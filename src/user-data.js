const { fs, path, os } = require("./exports")

function getUserData() {
  const userDataPath = path.join(os.homedir(), ".nium", 'settings.json');
  if (fs.existsSync(userDataPath)) {
    try {
      const data = fs.readFileSync(userDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading user data:", error);
      return null;
    }
  }
}

module.exports = { getUserData }