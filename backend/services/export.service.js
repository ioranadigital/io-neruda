import { spawn } from 'child_process';
import logger from '../utils/logger.js';

export async function runExport({ projectName, filename, targets, url }) {
  return new Promise((resolve, reject) => {
    try {
      const pythonPath = process.env.PYTHON_EXECUTABLE || 'python';
      const scriptPath = 'scripts/publish.py';

      const args = [
        scriptPath,
        '--project', projectName,
        '--file', filename,
        '--target', ...targets,
      ];

      if (url) {
        args.push('--url', url);
      }

      logger.info(`Spawning export process: ${pythonPath} ${args.join(' ')}`);

      const python = spawn(pythonPath, args, {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
        logger.info(`[Export] ${data.toString().trim()}`);
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
        logger.error(`[Export] ${data.toString().trim()}`);
      });

      python.on('close', (code) => {
        if (code === 0) {
          logger.info(`Export completed successfully`);
          resolve({ success: true, stdout });
        } else {
          logger.error(`Export failed with code ${code}`);
          reject(new Error(`Export failed: ${stderr || 'Unknown error'}`));
        }
      });

      python.on('error', (err) => {
        logger.error('Failed to spawn export process:', err);
        reject(err);
      });
    } catch (err) {
      logger.error('Error in runExport:', err);
      reject(err);
    }
  });
}
