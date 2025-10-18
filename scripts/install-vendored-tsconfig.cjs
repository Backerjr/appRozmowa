#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const vendorDir = path.join(projectRoot, 'vendor', '@ljharb', 'tsconfig');
const destDir = path.join(projectRoot, 'node_modules', '@ljharb', 'tsconfig');

async function pathExists(targetPath) {
  try {
    await fs.promises.access(targetPath, fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function copyRecursive(source, destination) {
  const stat = await fs.promises.stat(source);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(destination, { recursive: true });
    const entries = await fs.promises.readdir(source, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const srcChild = path.join(source, entry.name);
        const destChild = path.join(destination, entry.name);
        if (entry.isDirectory()) {
          await copyRecursive(srcChild, destChild);
        } else if (entry.isSymbolicLink()) {
          const linkTarget = await fs.promises.readlink(srcChild);
          await fs.promises.symlink(linkTarget, destChild);
        } else {
          await fs.promises.copyFile(srcChild, destChild);
        }
      })
    );
  } else {
    await fs.promises.mkdir(path.dirname(destination), { recursive: true });
    await fs.promises.copyFile(source, destination);
  }
}

(async () => {
  if (!(await pathExists(vendorDir))) {
    console.warn(
      `Skipping vendored @ljharb/tsconfig install because ${vendorDir} is missing.`
    );
    return;
  }

  await fs.promises.mkdir(path.dirname(destDir), { recursive: true });
  await fs.promises.rm(destDir, { recursive: true, force: true });
  await copyRecursive(vendorDir, destDir);
})();
