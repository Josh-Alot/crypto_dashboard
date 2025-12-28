import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// List of environment variables to expose (without VITE_ prefix)
const exposedEnvVars = [
  'REOWN_PROJECT_ID',
  'ETHERSCAN_API_KEY',
  'BASESCAN_API_KEY',
  'POLYGONSCAN_API_KEY',
  'ARBISCAN_API_KEY',
  'OPTIMISTIC_ETHERSCAN_API_KEY',
  'PROJECT_URL',
]

// Plugin to replace import.meta.env.VAR_NAME with actual values
function exposeEnvVarsPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'expose-env-vars',
    enforce: 'pre',
    transform(code, id) {
      // Only process source files, not node_modules or HTML
      if (
        !id.includes('node_modules') &&
        !id.endsWith('.html') &&
        (id.endsWith('.ts') || id.endsWith('.tsx') || id.endsWith('.js') || id.endsWith('.jsx'))
      ) {
        let transformedCode = code
        let hasChanges = false

        for (const varName of exposedEnvVars) {
          // Match import.meta.env.VAR_NAME (but not in strings or comments)
          // This regex matches the pattern but is careful about context
          const regex = new RegExp(
            `import\\.meta\\.env\\.${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\w)`,
            'g'
          )
          if (regex.test(transformedCode)) {
            const value = JSON.stringify(env[varName] || '')
            transformedCode = transformedCode.replace(regex, value)
            hasChanges = true
          }
        }

        if (hasChanges) {
          return {
            code: transformedCode,
            map: null, // Could generate source map if needed
          }
        }
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (empty prefix means load all)
  const allEnv = loadEnv(mode, process.cwd(), '')
  
  // Filter to only the vars we want to expose
  const exposedEnv: Record<string, string> = {}
  for (const varName of exposedEnvVars) {
    if (allEnv[varName] !== undefined) {
      exposedEnv[varName] = allEnv[varName]
    }
  }

  return {
    plugins: [react(), exposeEnvVarsPlugin(exposedEnv)],
  }
})
