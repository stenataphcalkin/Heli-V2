// Debug version - just list nodes and their connections

import { readFileSync } from 'fs';

const fileContent = readFileSync('./src/components/Story.jsx', 'utf-8');

console.log('Finding story nodes...\n');

// Find the storyFlow object section
const flowStart = fileContent.indexOf('const storyFlow = {');
const flowEnd = fileContent.indexOf('export default function Story()');
const flowSection = fileContent.substring(flowStart, flowEnd);

// Extract all node definitions and their connections
const lines = flowSection.split('\n');
let currentNode = null;
const nodes = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check for node definition (e.g., "  start: {")
  const nodeMatch = line.match(/^\s{2}(\w+):\s*\{/);
  if (nodeMatch) {
    currentNode = nodeMatch[1];
    nodes[currentNode] = [];
    continue;
  }
  
  // Check for nextStep within a node
  const nextStepMatch = line.match(/nextStep:\s*"(\w+)"/);
  if (nextStepMatch && currentNode) {
    nodes[currentNode].push(nextStepMatch[1]);
  }
}

console.log(`Found ${Object.keys(nodes).length} nodes:\n`);

// Show each node and its connections
for (const [nodeName, connections] of Object.entries(nodes)) {
  console.log(`${nodeName}:`);
  if (connections.length === 0) {
    console.log(`  → (no connections - possible END node)`);
  } else {
    connections.forEach(conn => {
      console.log(`  → ${conn}`);
    });
  }
}

// Now check reachability
console.log('\n---\nChecking reachability...\n');

const END_NODES = new Set(['positive_outcome', 'story_end_good', 'story_end_lesson', 'final_restart']);
const canReach = new Set();

// Mark end nodes
for (const end of END_NODES) {
  canReach.add(end);
}

// Fixed-point iteration
let changed = true;
let iter = 0;

while (changed && iter < 100) {
  changed = false;
  iter++;
  
  for (const [node, connections] of Object.entries(nodes)) {
    if (canReach.has(node)) continue;
    
    // If any connection can reach end, this node can too
    if (connections.some(c => canReach.has(c))) {
      canReach.add(node);
      changed = true;
    }
  }
}

console.log(`Completed in ${iter} iterations\n`);

// Find nodes that can't reach end
const unreachable = Object.keys(nodes).filter(n => !canReach.has(n));

if (unreachable.length > 0) {
  console.log(`❌ ${unreachable.length} nodes cannot reach positive outcome:`);
  unreachable.forEach(n => console.log(`   - ${n} → [${nodes[n].join(', ')}]`));
} else {
  console.log(`✅ All ${Object.keys(nodes).length} nodes can reach positive outcome!`);
}
