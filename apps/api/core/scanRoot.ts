import path from "path";

// The API has no auth, so routes may only scan directories under SCAN_ROOT (default: cwd)
const scanRoot = path.resolve(process.env.SCAN_ROOT ?? process.cwd());
export const scanRootError = `Path outside allowed root ${scanRoot}. Set SCAN_ROOT to change it.`;

export function resolveScanDir(dir: string): string | null {
  const resolved = path.resolve(scanRoot, dir);
  return resolved === scanRoot || resolved.startsWith(scanRoot + path.sep) ? resolved : null;
}
