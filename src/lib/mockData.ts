import { Tutorial } from '@/lib/types'

export const SEED_TUTORIALS: Tutorial[] = [
  {
    id: '1',
    title: 'Getting Started with System Design',
    slug: 'getting-started-with-system-design',
    excerpt: 'Learn the fundamentals of designing scalable software systems from the ground up. This guide covers core principles every engineer should know.',
    content: `# Getting Started with System Design

System design is one of the most critical skills for software engineers. Whether you're preparing for interviews or building real-world applications, understanding how to design scalable systems is essential.

## Mathematical Time & Space Complexity

When evaluating algorithms, we express upper bounds using Big-O notation:

$$O(N \\log N) \\quad \\text{and} \\quad T(n) = 2T\\left(\\frac{n}{2}\\right) + O(n)$$

For example, binary tree reduction across $N = 2^k$ nodes requires logarithmic rounds:

$$\\text{Total Rounds} = \\lceil \\log_2(N) \\rceil$$

## Core Principles

### 1. Scalability
Your system should be able to handle growth gracefully. This means:
- **Horizontal scaling**: Adding more servers to distribute load
- **Vertical scaling**: Upgrading existing hardware

### 2. Reliability
A reliable system continues to work correctly even when things go wrong:
- Use redundancy to eliminate single points of failure
- Implement health checks and automatic failover
- Design for graceful degradation

### 3. Availability
High availability means your system is accessible when users need it:
- Aim for 99.9% uptime (three nines) or better
- Use load balancers to distribute traffic

Happy designing! 🚀`,
    category: 'System Design',
    difficulty: 'Beginner',
    read_time: 8,
    tags: ['system design', 'architecture', 'math'],
    cover_emoji: '🏗️',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    view_count: 142,
  },
  {
    id: '2',
    title: 'Parallel Tree Reduction & Complexity Analysis',
    slug: 'parallel-tree-reduction-complexity',
    excerpt: 'An in-depth guide to parallel tree reduction algorithms with LaTeX mathematical proofs and Python implementation.',
    content: `# Parallel Tree Reduction & Complexity Analysis

Parallel tree reduction allows binary associative operations across $N$ nodes to execute in $O(\\log N)$ time rather than $O(N)$.

## Mathematical Formulation

Given an array of elements $X = [x_0, x_1, \\dots, x_{N-1}]$ and a binary associative operation $\\oplus$:

$$S = x_0 \\oplus x_1 \\oplus \\dots \\oplus x_{N-1} = \\bigoplus_{i=0}^{N-1} x_i$$

### Round-by-Round Stride Formula

At round $k \\in \\{0, 1, \\dots, \\log_2 N - 1\\}$:

$$\\text{stride} = 2^k, \\quad \\text{group\\_size} = 2^{k+1}$$

$$\\text{Node } i \\leftarrow \\text{Node } i \\oplus \\text{Node } (i + 2^k)$$

## Implementation Example

\`\`\`python
import math

def simulate_tree_reduction(nodes_data):
    num_nodes = len(nodes_data)
    total_rounds = math.ceil(math.log2(num_nodes))
    
    for step in range(total_rounds):
        stride = 2 ** step
        group_size = 2 ** (step + 1)
        for i in range(0, num_nodes, group_size):
            if i + stride < num_nodes:
                nodes_data[i] += nodes_data[i + stride]
                
    return nodes_data[0]
\`\`\`

Mathematical parallelism at scale! ⚡`,
    category: 'Algorithms',
    difficulty: 'Advanced',
    read_time: 10,
    tags: ['algorithms', 'parallel computing', 'latex', 'math'],
    cover_emoji: '⚡',
    published: true,
    created_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    view_count: 89,
  },
  {
    id: '3',
    title: 'Mastering React Hooks',
    slug: 'mastering-react-hooks',
    excerpt: 'Deep dive into React Hooks — from useState and useEffect to custom hooks that make your components clean and reusable.',
    content: `# Mastering React Hooks

React Hooks revolutionized how we write React components. Introduced in React 16.8, hooks let you use state and other React features without writing class components.

## The Essential Hooks

### useState
The most fundamental hook — adds state to functional components.

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
Handles side effects like data fetching, subscriptions, or DOM manipulation.

\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

Master these and your React code will be cleaner than ever! ⚛️`,
    category: 'React',
    difficulty: 'Intermediate',
    read_time: 10,
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    cover_emoji: '⚛️',
    published: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    view_count: 98,
  },
]
