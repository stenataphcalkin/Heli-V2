// Simplified story flow test using BFS to check reachability

import { readFileSync } from 'fs';

const fileContent = readFileSync('./src/components/Story.jsx', 'utf-8');

console.log('🧪 Testing Story Flow Paths...\n');

// Parse story nodes and their connections
const nodes = new Map();
const nodePattern = /^\s{2}(\w+):\s*\{/gm;
let match;

// Find all nodes
while ((match = nodePattern.exec(fileContent)) !== null) {
  nodes.set(match[1], { choices: [] });
}

// Extract next steps for each node
for (const [nodeName] of nodes) {
  const nodeRegex = new RegExp(`^\\s{2}${nodeName}:\\s*\\{[\\s\\S]*?^\\s{2}\\}`, 'gm');
  const nodeMatch = nodeRegex.exec(fileContent);
  
  if (nodeMatch) {
    const nextStepPattern = /nextStep:\s*"(\w+)"/g;
    let nextStepMatch;
    
    while ((nextStepMatch = nextStepPattern.exec(nodeMatch[0])) !== null) {
      nodes.get(nodeName).choices.push(nextStepMatch[1]);
    }
  }
}

console.log(`📊 Total story nodes: ${nodes.size}\n`);

// Define end nodes (successful completion)
const END_NODES = new Set([
  'positive_outcome',
  'story_end_good',
  'story_end_lesson',
  'final_restart'
]);

// Check if each node can eventually reach an end node using BFS
const canReachEnd = new Map();

// Mark end nodes as able to reach end (base case)
for (const endNode of END_NODES) {
  canReachEnd.set(endNode, true);
}

// Iteratively determine which nodes can reach end nodes
// Continue until no new nodes are marked (fixed point)
let changed = true;
let iterations = 0;
const maxIterations = 100;

while (changed && iterations < maxIterations) {
  changed = false;
  iterations++;
  
  for (const [nodeName, nodeData] of nodes) {
    // Skip if already marked
    if (canReachEnd.has(nodeName)) continue;
    
    // Check if any choice leads to a node that can reach the end
    const hasPathToEnd = nodeData.choices.some(nextNode => 
      canReachEnd.get(nextNode) === true
    );
    
    if (hasPathToEnd) {
      canReachEnd.set(nodeName, true);
      changed = true;
    }
  }
}

console.log(`✓ Analysis completed in ${iterations} iterations\n`);

// Find nodes that cannot reach end
const deadEndNodes = [];
for (const [nodeName] of nodes) {
  if (!canReachEnd.has(nodeName) && !END_NODES.has(nodeName)) {
    deadEndNodes.push(nodeName);
  }
}

// Report results
console.log('📈 RESULTS:\n');

if (deadEndNodes.length > 0) {
  console.log(`❌ Found ${deadEndNodes.length} nodes that DON'T lead to visiting Lazlo:\n`);
  deadEndNodes.forEach(node => {
    const choices = nodes.get(node).choices;
    console.log(`   - ${node} (leads to: ${choices.join(', ') || 'DEAD END - NO CHOICES'})`);
  });
  console.log('\n❌ TEST FAILED: Some story paths don\'t lead to positive outcome\n');
  process.exit(1);
} else {
  console.log(`✅ All ${nodes.size} nodes eventually lead to visiting Lazlo (positive_outcome)!\n`);
  
  // Show statistics
  const nodesWithChoices = Array.from(nodes.values()).filter(n => n.choices.length > 0).length;
  const avgChoices = Array.from(nodes.values())
    .map(n => n.choices.length)
    .reduce((a, b) => a + b, 0) / nodes.size;
  
  console.log(`📊 Story Statistics:`);
  console.log(`   - Total nodes: ${nodes.size}`);
  console.log(`   - Nodes with choices: ${nodesWithChoices}`);
  console.log(`   - Avg choices per node: ${avgChoices.toFixed(2)}`);
  console.log(`   - End nodes: ${END_NODES.size}`);
  
  // Show sample paths from start
  console.log(`\n🚀 Sample paths from "start":`);
  const queue = [['start']];
  const visited = new Set();
  const paths = [];
  
  while (queue.length > 0 && paths.length < 5) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    if (END_NODES.has(current)) {
      paths.push(path);
      continue;
    }
    
    const choices = nodes.get(current)?.choices || [];
    for (const next of choices) {
      if (path.length < 10) {  // Limit path length for display
        queue.push([...path, next]);
      }
    }
  }
  
  paths.forEach((path, idx) => {
    console.log(`   ${idx + 1}. ${path.join(' → ')}`);
  });
  
  console.log('\n✅ TEST PASSED: Story flow integrity verified!\n');
  process.exit(0);
}
