const applyVariables = (content, variables = {}) => {
  return content.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    return variables[key] !== undefined ? String(variables[key]) : '';
  });
};

module.exports = { applyVariables };
