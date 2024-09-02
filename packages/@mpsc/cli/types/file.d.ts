export as namespace file;
export declare namespace file {
  function isExitFile(dir: string, isDebug?: boolean): boolean;
  function isExitDir(dir: string, isDebug?: boolean): boolean;
  function writeFileTree(dir: string, files: any): void;
  function getPathAbsoluteRoot(relativeRootDir: string): string;

  const root: string;
  const curDir: string;
}
