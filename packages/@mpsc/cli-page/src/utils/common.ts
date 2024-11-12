const checkVersion = (version: string) => {
  const versionRegex = /^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/;
  return versionRegex.test(version);
};

export { checkVersion };
