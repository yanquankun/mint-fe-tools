const isDebug = globalThis['buildDebug'] || false;

module.exports = (prompt) => {
  console.log(isDebug);
  console.log(prompt);
};
