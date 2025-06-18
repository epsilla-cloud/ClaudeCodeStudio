const { spawn } = require('child_process')
const path = require('path')

console.log('Starting Claude Code Studio in development mode...')

// Start Vite dev server
const vite = spawn('npm', ['run', 'dev:vite'], {
  stdio: 'inherit',
  shell: true
})

// Wait for Vite to start, then launch Electron
setTimeout(() => {
  console.log('Launching Electron...')
  const electron = spawn('npm', ['run', 'dev:electron'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: 'http://localhost:5173'
    }
  })

  electron.on('close', () => {
    vite.kill()
    process.exit(0)
  })
}, 3000)

vite.on('close', () => {
  process.exit(0)
})