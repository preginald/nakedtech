import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { schemaVersion } = require('../src/_data/serviceCatalogue.js')
const projectRoot = new URL('../', import.meta.url).pathname

function git(...args) {
  return execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
  }).trim()
}

const version = {
  commit: git('rev-parse', 'HEAD'),
  commitTimestamp: git('show', '-s', '--format=%cI', 'HEAD'),
  catalogueSchemaVersion: schemaVersion,
}

writeFileSync(
  join(projectRoot, '_site', 'version.json'),
  `${JSON.stringify(version, null, 2)}\n`,
  'utf8',
)
