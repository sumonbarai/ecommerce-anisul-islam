const slicePath = (fullPath) => {
  const start = fullPath.indexOf("/");
  return fullPath.slice(start);
};

module.exports = slicePath;
