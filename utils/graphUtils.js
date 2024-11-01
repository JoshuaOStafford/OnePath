import { shuffle } from 'lodash';

export const maxNonHamiltonianEdges = {
  5: 6,
  6: 10,
  7: 15,
  8: 21,
  9: 28
};

// Function to count Hamiltonian paths
export function countHamiltonianPaths(graph, start, end, n) {
  const paths = allSimplePaths(graph, start, end);
  const hamiltonianPaths = paths.filter(path => path.length === n);
  return hamiltonianPaths.length;
}

// Helper function to generate all simple paths
function allSimplePaths(graph, start, end, path = [], visited = new Set()) {
  path.push(start);
  visited.add(start);

  const paths = [];
  if (start === end && path.length === Object.keys(graph).length) {
    paths.push([...path]);
  } else {
    for (const neighbor of graph[start] || []) {
      if (!visited.has(neighbor)) {
        paths.push(...allSimplePaths(graph, neighbor, end, path, visited));
      }
    }
  }

  path.pop();
  visited.delete(start);
  return paths;
}

// Generate a Uni-Hamiltonian Graph
export function generateHamiltonianGraph(n, difficulty = 100) {
  const graph = {};
  
  // Step 1: Create Hamiltonian path
  const pathEdges = [];
  for (let i = 1; i < n; i++) {
    addEdge(graph, i, i + 1);
    pathEdges.push([i, i + 1]);
  }
  
  // Step 2: Determine the target number of edges based on difficulty
  const maxEdgesToAdd = Math.floor((difficulty / 100) * maxNonHamiltonianEdges[n]);
  const targetEdgeCount = (n - 1) + maxEdgesToAdd;

  // Step 3: Generate potential non-Hamiltonian edges
  let potentialNonPathEdges = [];
  for (let i = 1; i <= n; i++) {
    for (let j = i + 2; j <= n; j++) {
      potentialNonPathEdges.push([i, j]);
    }
  }
  potentialNonPathEdges = shuffle(potentialNonPathEdges);

  // Step 4: Add edges while checking for Hamiltonian path uniqueness
  for (const [u, v] of potentialNonPathEdges) {
    if (Object.keys(graph).reduce((sum, key) => sum + graph[key].length, 0) / 2 >= targetEdgeCount) {
      break;
    }
    
    addEdge(graph, u, v);
    
    if (countHamiltonianPaths(graph, 1, n, n) > 1) {
      removeEdge(graph, u, v);
    }
  }
  
  return { graph, pathEdges };
}

// Helper functions to add and remove edges
function addEdge(graph, u, v) {
  if (!graph[u]) graph[u] = [];
  if (!graph[v]) graph[v] = [];
  graph[u].push(v);
  graph[v].push(u);
}

function removeEdge(graph, u, v) {
  graph[u] = graph[u].filter(node => node !== v);
  graph[v] = graph[v].filter(node => node !== u);
}