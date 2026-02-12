// Test script to verify all story paths lead to visiting Lazlo (positive_outcome)

import { readFileSync } from 'fs';

const fileContent = readFileSync('./src/components/Story.jsx', 'utf-8');

console.log('🧪 Testing Story Flow Paths...\n');

// Parse story nodes and their connections manually using regex
const nodePattern = /^\s{2}(\w+):\s*\{/gm;
const choicePattern = /nextStep:\s*"(\w+)"/g;

// Extract all node names
const nodes = new Map();
let match;

// Find all nodes
while ((match = nodePattern.exec(fileContent)) !== null) {
  const nodeName = match[1];
  nodes.set(nodeName, { choices: [] });
}

// For each node, find its choices' nextStep values
for (const [nodeName] of nodes) {
  const nodeRegex = new RegExp(`^\\s{2}${nodeName}:\\s*\\{[\\s\\S]*?^\\s{2}\\}`, 'gm');
  const nodeMatch = nodeRegex.exec(fileContent);
  
  if (nodeMatch) {
    const nodeContent = nodeMatch[0];
    const nextStepPattern = /nextStep:\s*"(\w+)"/g;
    let nextStepMatch;
    
    while ((nextStepMatch = nextStepPattern.exec(nodeContent)) !== null) {
      nodes.get(nodeName).choices.push(nextStepMatch[1]);
    }
  }
}

console.log(`📊 Total story nodes: ${nodes.size}\n`);

// Target nodes that represent "visiting Lazlo" or story completion
const END_NODES = new Set([
  'positive_outcome',
  'story_end_good',
  'story_end_lesson',
  'final_restart'
]);

// Nodes that loop back (allowed for educational purposes)
const LOOP_NODES = new Set([
  'subtle_delay',
  'start'
]);

// Track visited paths to detect loops
const allPaths = [];

function traversePath(currentNode, path = [], depth = 0, maxDepth = 50) {
  // Prevent infinite loops
  if (depth > maxDepth) {
    return {
      success: false,
      path,
      reason: 'Max depth reached (possible infinite loop)'
    };
  }

  // Add current node to path
  const currentPath = [...path, currentNode];

  // Check if we've reached an end node
  if (END_NODES.has(currentNode)) {
    return {
      success: true,
      path: currentPath,
      reason: `Reached end node: ${currentNode}`
    };
  }

  // Check if node exists
  if (!nodes.has(currentNode)) {
    return {
      success: false,
      path: currentPath,
      reason: `Node "${currentNode}" not found`
    };
  }

  // Get choices for this node
  const choices = nodes.get(currentNode).choices || [];
  
  if (choices.length === 0) {
    return {
      success: false,
      path: currentPath,
      reason: `Node "${currentNode}" has no choices (dead end)`
    };
  }

  // Test each choice
  const results = [];
  for (let i = 0; i < choices.length; i++) {
    const nextNode = choices[i];
    
    // Detect non-progressive loops (visiting same node twice in short succession)
    const recentVisits = currentPath.slice(-5);
    if (recentVisits.filter(n => n === nextNode).length >= 2 && !LOOP_NODES.has(nextNode)) {
      results.push({
        success: false,
        path: [...currentPath, nextNode],
        reason: `Circular loop detected: ${nextNode} visited multiple times`
      });
      continue;
    }

    // Recursively traverse
    const result = traversePath(nextNode, currentPath, depth + 1, maxDepth);
    results.push({
      ...result,
      choiceIndex: i
    });
  }

  return results;
}

// Start traversal from 'start' node
console.log('🚀 Starting traversal from "start" node...\n');
const results = traversePath('start');

// Flatten results for analysis
function flattenResults(results, flat = []) {
  if (Array.isArray(results)) {
    results.forEach(r => flattenResults(r, flat));
  } else {
    flat.push(results);
  }
  return flat;
}

const flatResults = flattenResults(results);
const successPaths = flatResults.filter(r => r.success);
const failedPaths = flatResults.filter(r => !r.success);

console.log('📈 RESULTS:\n');
console.log(`✅ Successful paths: ${successPaths.length}`);
console.log(`❌ Failed paths: ${failedPaths.length}`);
console.log(`📍 Total paths tested: ${flatResults.length}\n`);

// Show failed paths in detail
if (failedPaths.length > 0) {
  console.log('⚠️  FAILED PATHS (paths that don\'t lead to visiting Lazlo):\n');
  failedPaths.forEach((fail, idx) => {
    console.log(`${idx + 1}. Path: ${fail.path.join(' → ')}`);
    console.log(`   Reason: ${fail.reason}`);
    console.log('');
  });
} else {
  console.log('✨ SUCCESS! All paths eventually lead to visiting Lazlo!\n');
}

// Show sample successful paths
if (successPaths.length > 0) {
  console.log('✅ Sample successful paths:\n');
  successPaths.slice(0, 5).forEach((success, idx) => {
    console.log(`${idx + 1}. ${success.path.join(' → ')}`);
  });
  if (successPaths.length > 5) {
    console.log(`   ... and ${successPaths.length - 5} more successful paths\n`);
  }
}

// Check for unreachable nodes
const allNodeNames = Array.from(nodes.keys());
const reachableNodes = new Set(flatResults.flatMap(r => r.path));
const unreachableNodes = allNodeNames.filter(node => !reachableNodes.has(node) && node !== 'start');

if (unreachableNodes.length > 0) {
  console.log('⚠️  UNREACHABLE NODES (defined but never visited from start):\n');
  unreachableNodes.forEach(node => {
    console.log(`   - ${node}`);
  });
  console.log('');
}

// Exit with appropriate code
if (failedPaths.length > 0) {
  console.log('❌ TEST FAILED: Some paths do not lead to visiting Lazlo\n');
  process.exit(1);
} else {
  console.log('✅ TEST PASSED: All reachable story paths lead to visiting Lazlo!\n');
  process.exit(0);
}
