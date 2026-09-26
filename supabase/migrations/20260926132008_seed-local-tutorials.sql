-- Seed local tutorials not included in the initial migration

-- Update "Getting Started with System Design" with the richer LaTeX content
update tutorials set
  content = '# Getting Started with System Design

System design is one of the most critical skills for software engineers. Whether you''re preparing for interviews or building real-world applications, understanding how to design scalable systems is essential.

## Mathematical Time & Space Complexity

When evaluating algorithms, we express upper bounds using Big-O notation:

$$O(N \log N) \quad \text{and} \quad T(n) = 2T\left(\frac{n}{2}\right) + O(n)$$

For example, binary tree reduction across $N = 2^k$ nodes requires logarithmic rounds:

$$\text{Total Rounds} = \lceil \log_2(N) \rceil$$

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

Happy designing! 🚀',
  tags = ARRAY['system design', 'architecture', 'math'],
  updated_at = now()
where slug = 'getting-started-with-system-design';

-- Insert "Parallel Tree Reduction & Complexity Analysis"
insert into tutorials (title, slug, excerpt, content, category, difficulty, read_time, tags, cover_emoji, published)
values (
  'Parallel Tree Reduction & Complexity Analysis',
  'parallel-tree-reduction-complexity',
  'An in-depth guide to parallel tree reduction algorithms with LaTeX mathematical proofs and Python implementation.',
  '# Parallel Tree Reduction & Complexity Analysis

Parallel tree reduction allows binary associative operations across $N$ nodes to execute in $O(\log N)$ time rather than $O(N)$.

## Mathematical Formulation

Given an array of elements $X = [x_0, x_1, \dots, x_{N-1}]$ and a binary associative operation $\oplus$:

$$S = x_0 \oplus x_1 \oplus \dots \oplus x_{N-1} = \bigoplus_{i=0}^{N-1} x_i$$

### Round-by-Round Stride Formula

At round $k \in \{0, 1, \dots, \log_2 N - 1\}$:

$$\text{stride} = 2^k, \quad \text{group\_size} = 2^{k+1}$$

$$\text{Node } i \leftarrow \text{Node } i \oplus \text{Node } (i + 2^k)$$

## Implementation Example

```python
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
```

Mathematical parallelism at scale! ⚡',
  'Algorithms',
  'Advanced',
  10,
  ARRAY['algorithms', 'parallel computing', 'latex', 'math'],
  '⚡',
  true
)
on conflict (slug) do nothing;
