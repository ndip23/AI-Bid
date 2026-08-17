const { execSync } = require('child_process');

try {
  const output = execSync('netstat -ano').toString();
  const lines = output.split('\n');
  const pids = new Set();

  lines.forEach((line) => {
    if (line.includes(':4000') && line.includes('LISTENING')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') pids.add(pid);
    }
  });

  pids.forEach((pid) => {
    try {
      execSync(`taskkill /F /PID ${pid}`);
      console.log(`Killed ${pid}`);
    } catch (e) {}
  });
} catch (err) {}
