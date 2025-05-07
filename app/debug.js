const Debug = {
  enabled: true,

  getTimestamp() {
    return new Date().toISOString();
  },

  log(tag, data) {
    if (!this.enabled) return;
    console.log(`🟢 [${this.getTimestamp()}] [${tag}]`, data);
  },

  table(tag, data) {
    if (!this.enabled) return;
    console.groupCollapsed(`📊 [${this.getTimestamp()}] [${tag}]`);
    console.table(data);
    console.groupEnd();
  },

  error(tag, message) {
    if (!this.enabled) return;
    console.error(`🔴 [${this.getTimestamp()}] [${tag}] ERROR: ${message}`);
  },

  warn(tag, message) {
    if (!this.enabled) return;
    console.warn(`🟡 [${this.getTimestamp()}] [${tag}] WARNING: ${message}`);
  },
};

export default Debug;
