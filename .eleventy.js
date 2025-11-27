module.exports = function(eleventyConfig) {
  // Watch CSS files for changes
  eleventyConfig.addWatchTarget("./src/css/");
  
  // Passthrough copy for images or static assets
  eleventyConfig.addPassthroughCopy("./src/img");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
