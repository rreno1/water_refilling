const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let errors = [];
let warnings = [];
let passedChecks = 0;

function checkFileExists(relPath) {
  const full = path.join(rootDir, relPath);
  if (!fs.existsSync(full)) {
    errors.push(`Missing required file: ${relPath}`);
    return false;
  }
  return true;
}

function readJson(relPath) {
  if (!checkFileExists(relPath)) return null;
  const full = path.join(rootDir, relPath);
  try {
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    passedChecks++;
    return data;
  } catch (err) {
    errors.push(`Invalid JSON format in ${relPath}: ${err.message}`);
    return null;
  }
}

console.log("=== WATER_REFILLING ARCHITECTURE VALIDATOR ===");

// 1. Root & Global Files Check
checkFileExists('AGENTS.md');
const globalFiles = [
  'Agents.json', 'Claude.json', 'Memory.json', 'technology-stack.json',
  'database-schema.json', 'shared-data-types.json', 'module-map.json',
  'integration-rules.json', 'coding-standards.json', 'security-rules.json',
  'interface-standards.json', 'testing-rules.json', 'git-workflow.json',
  'module-ownership.json'
];

globalFiles.forEach(f => readJson(`.ai/global/${f}`));

// 2. Contracts & Decisions
const contractFiles = ['interfaces.json', 'api-contracts.json', 'contract-change-log.json'];
contractFiles.forEach(f => readJson(`.ai/contracts/${f}`));
readJson('.ai/decisions/architecture-decisions.json');

// 3. Module Verification
const moduleMap = readJson('.ai/global/module-map.json');
const modules = moduleMap ? moduleMap.modules : [];

const moduleFiles = [
  'module.json', 'dependencies.json', 'interfaces.json', 'workflows.json',
  'permissions.json', 'validation.json', 'interface.json', 'test-cases.json',
  'integration-tests.json'
];

const moduleDeps = {};

modules.forEach(m => {
  // Check src/modules/<m>/AGENTS.md
  checkFileExists(`src/modules/${m}/AGENTS.md`);

  moduleFiles.forEach(f => {
    const data = readJson(`.ai/modules/${m}/${f}`);
    if (f === 'dependencies.json' && data) {
      moduleDeps[m] = data.direct_dependencies || [];
    }
    if (f === 'permissions.json' && data) {
      if (!data.allowed_roles || data.allowed_roles.length === 0) {
        errors.push(`Module ${m} permissions.json missing allowed_roles`);
      }
    }
    if (f === 'validation.json' && data) {
      if (!data.rules || data.rules.length === 0) {
        errors.push(`Module ${m} validation.json missing rules`);
      }
    }
    if (f === 'test-cases.json' && data) {
      if (!data.test_cases || data.test_cases.length === 0) {
        errors.push(`Module ${m} test-cases.json missing test_cases`);
      }
    }
  });
});

// 4. Circular Dependency Detection (Tarjan's / DFS)
function checkCircularDeps() {
  const visited = {};
  const recStack = {};

  function dfs(node, pathAcc) {
    visited[node] = true;
    recStack[node] = true;
    pathAcc.push(node);

    const neighbors = moduleDeps[node] || [];
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        if (dfs(neighbor, pathAcc)) return true;
      } else if (recStack[neighbor]) {
        errors.push(`Circular dependency detected: ${pathAcc.join(' -> ')} -> ${neighbor}`);
        return true;
      }
    }

    recStack[node] = false;
    pathAcc.pop();
    return false;
  }

  Object.keys(moduleDeps).forEach(m => {
    if (!visited[m]) {
      dfs(m, []);
    }
  });
}

checkCircularDeps();

// 5. Documentation Verification
const docs = [
  'implementation-plan.md', 'requirements-traceability.md', 'architecture-overview.md',
  'database-design.md', 'data-flow.md', 'rbac-matrix.md', 'module-dependency-map.md',
  'page-navigation-map.md', 'business-rules.md', 'validation-rules.md', 'error-recovery-plan.md',
  'security-plan.md', 'testing-plan.md', 'performance-plan.md', 'deployment-plan.md',
  'backup-restore-plan.md', 'unresolved-decisions.md'
];

docs.forEach(d => checkFileExists(`docs/${d}`));

// Summary Output
console.log(`Passed Checks: ${passedChecks}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
  console.error("VALIDATION FAILED WITH ERRORS:");
  errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log("SUCCESS: All architecture JSON specs, contract definitions, module instructions, and documentation files are 100% valid and verified!");
  process.exit(0);
}
