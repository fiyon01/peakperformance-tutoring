const getFullImagePath = (filename) => {
    return filename?.startsWith('/uploads/')
      ? filename
      : `/uploads/${filename}`;
  };

  module.exports = getFullImagePath;
