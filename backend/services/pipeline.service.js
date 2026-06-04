import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

const PIPELINE_ROOT = process.env.PIPELINE_ROOT || 'E:\\lib\\003-Pipeline-Contenidos';

const STAGE_FOLDERS = {
  insight: '01-Buzon-Insights',
  plan: '02-Generador-Planes',
  ready: '03-Ready-To-Publish',
};

export function getPipelineRoot() {
  return PIPELINE_ROOT;
}

export function validateStage(stage) {
  if (!STAGE_FOLDERS[stage]) {
    throw new Error(`Invalid stage: ${stage}. Must be one of: ${Object.keys(STAGE_FOLDERS).join(', ')}`);
  }
  return STAGE_FOLDERS[stage];
}

export function getProjectPath(projectName) {
  return path.join(PIPELINE_ROOT, projectName);
}

export function getStagePath(projectName, stage) {
  const stageFolder = validateStage(stage);
  return path.join(getProjectPath(projectName), stageFolder);
}

export async function createProjectFolders(projectName) {
  try {
    const projectPath = getProjectPath(projectName);
    const folders = [
      '00-Config',
      '01-Buzon-Insights',
      '02-Generador-Planes',
      '03-Ready-To-Publish',
      'assets/headers',
      'assets/images',
    ];

    for (const folder of folders) {
      const fullPath = path.join(projectPath, folder);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }

    // Create default config.json
    const configPath = path.join(projectPath, '00-Config', 'config.json');
    if (!fs.existsSync(configPath)) {
      const config = {
        project: projectName,
        name: projectName,
        type: 'blog',
        tone: { primary: 'professional', secondary: 'friendly' },
        exporters: { enabled: ['markdown', 'whatsapp', 'html', 'json', 'social', 'email'] },
      };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    }

    // Create default .env file
    const envPath = path.join(projectPath, '00-Config', `.env.${projectName}`);
    if (!fs.existsSync(envPath)) {
      const envContent = `# ${projectName} Configuration\nWORDPRESS_URL=\nWORDPRESS_USERNAME=\nWORDPRESS_PASSWORD=\n`;
      fs.writeFileSync(envPath, envContent, 'utf-8');
    }

    // Create .gitignore
    const gitignorePath = path.join(projectPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `.env.*\n*.env\nexports/\n*.log\n__pycache__/\n`;
      fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
    }

    logger.info(`Project folders created: ${projectPath}`);
    return { success: true, path: projectPath };
  } catch (err) {
    logger.error('Error creating project folders:', err);
    throw err;
  }
}

export async function getProjectContents(projectName, stage) {
  try {
    const stageFolder = validateStage(stage);
    const projectPath = getProjectPath(projectName);
    const stagePath = path.join(projectPath, stageFolder);

    if (!fs.existsSync(stagePath)) {
      return [];
    }

    const files = fs.readdirSync(stagePath).filter(f => f.endsWith('.md'));
    return files.map(file => ({
      filename: file,
      path: path.join(stagePath, file),
    }));
  } catch (err) {
    logger.error('Error reading project contents:', err);
    throw err;
  }
}

export async function readContentFile(projectName, stage, filename) {
  try {
    const stagePath = getStagePath(projectName, stage);
    const filePath = path.join(stagePath, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filename}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return {
      filename,
      body: fileContent,
      stage,
      projectName,
    };
  } catch (err) {
    logger.error('Error reading content file:', err);
    throw err;
  }
}

export async function writeContentFile(projectName, stage, filename, content) {
  try {
    const stagePath = getStagePath(projectName, stage);
    const filePath = path.join(stagePath, filename);

    // Create directory if it doesn't exist
    if (!fs.existsSync(stagePath)) {
      fs.mkdirSync(stagePath, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    logger.info(`File written: ${filePath}`);
    return { success: true, path: filePath };
  } catch (err) {
    logger.error('Error writing content file:', err);
    throw err;
  }
}

export async function deleteContentFile(projectName, stage, filename) {
  try {
    const stagePath = getStagePath(projectName, stage);
    const filePath = path.join(stagePath, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted: ${filePath}`);
    }

    return { success: true };
  } catch (err) {
    logger.error('Error deleting content file:', err);
    throw err;
  }
}

export async function promoteContentFile(projectName, currentStage, filename) {
  try {
    const stageMap = { insight: 'plan', plan: 'ready' };
    const nextStage = stageMap[currentStage];

    if (!nextStage) {
      throw new Error('Content is already in final stage');
    }

    // Read from current stage
    const currentPath = getStagePath(projectName, currentStage);
    const currentFile = path.join(currentPath, filename);

    if (!fs.existsSync(currentFile)) {
      throw new Error(`File not found in ${currentStage} stage`);
    }

    const content = fs.readFileSync(currentFile, 'utf-8');

    // Write to next stage
    await writeContentFile(projectName, nextStage, filename, content);

    // Delete from current stage
    fs.unlinkSync(currentFile);

    logger.info(`Content promoted: ${projectName}/${filename} ${currentStage} → ${nextStage}`);
    return { success: true, from: currentStage, to: nextStage };
  } catch (err) {
    logger.error('Error promoting content:', err);
    throw err;
  }
}
