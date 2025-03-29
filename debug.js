const Debug = {
  enabled: true, // Toggle debugging on/off

  log(tag, data) {
    if (this.enabled) console.log(`🟢 [${tag}]`, data);
  },

  table(tag, data) {
    if (this.enabled) {
      console.groupCollapsed(`📊 [${tag}]`);
      console.table(data);
      console.groupEnd();
    }
  },

  error(tag, message) {
    if (this.enabled) console.error(`🔴 [${tag}] ERROR: ${message}`);
  },
};

export default Debug;
