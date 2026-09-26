-- Learn with Emrul - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tutorials table
create table if not exists tutorials (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  category text not null,
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  read_time integer not null default 5, -- in minutes
  tags text[] default '{}',
  cover_emoji text default '📘',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Views tracking
create table if not exists tutorial_views (
  id uuid primary key default uuid_generate_v4(),
  tutorial_id uuid references tutorials(id) on delete cascade,
  viewed_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_tutorials_updated_at
  before update on tutorials
  for each row execute function update_updated_at_column();

-- Row Level Security (RLS)
alter table tutorials enable row level security;
alter table tutorial_views enable row level security;

-- Public can read published tutorials
create policy "Public can view published tutorials"
  on tutorials for select
  using (published = true);

-- Only authenticated admin can do everything
create policy "Admin can manage all tutorials"
  on tutorials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can insert views
create policy "Anyone can track views"
  on tutorial_views for insert
  with check (true);

-- Anyone can read view counts
create policy "Public can read views"
  on tutorial_views for select
  using (true);

-- Seed some sample tutorials
insert into tutorials (title, slug, excerpt, content, category, difficulty, read_time, tags, cover_emoji) values
(
  'Getting Started with System Design',
  'getting-started-with-system-design',
  'Learn the fundamentals of designing scalable software systems from the ground up. This guide covers core principles every engineer should know.',
  '# Getting Started with System Design

System design is one of the most critical skills for software engineers. Whether you''re preparing for interviews or building real-world applications, understanding how to design scalable systems is essential.

## What is System Design?

System design is the process of defining the architecture, components, modules, interfaces, and data flow of a system to satisfy specified requirements.

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
- Deploy across multiple availability zones

### 4. Consistency
Ensure data remains accurate and up-to-date across your system:
- Choose between strong and eventual consistency based on needs
- Use transactions where data integrity is critical

## Key Components to Master

- **Load Balancers**: Distribute incoming requests
- **Caches**: Speed up data retrieval (Redis, Memcached)
- **Databases**: SQL vs NoSQL, sharding, replication
- **Message Queues**: Asynchronous communication (Kafka, RabbitMQ)
- **CDNs**: Serve static assets globally

## Next Steps

Start practicing with common design problems:
1. Design a URL shortener
2. Design a rate limiter
3. Design a notification service

Happy designing! 🚀',
  'System Design',
  'Beginner',
  8,
  ARRAY['system design', 'architecture', 'scalability'],
  '🏗️'
),
(
  'Mastering React Hooks',
  'mastering-react-hooks',
  'Deep dive into React Hooks — from useState and useEffect to custom hooks that make your components clean and reusable.',
  '# Mastering React Hooks

React Hooks revolutionized how we write React components. Introduced in React 16.8, hooks let you use state and other React features without writing class components.

## The Essential Hooks

### useState
The most fundamental hook — adds state to functional components.

```javascript
const [count, setCount] = useState(0);
```

### useEffect
Handles side effects like data fetching, subscriptions, or DOM manipulation.

```javascript
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

### useContext
Consume context without nesting Consumer components.

```javascript
const theme = useContext(ThemeContext);
```

### useReducer
Manage complex state logic, similar to Redux reducers.

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

### useMemo & useCallback
Optimize performance by memoizing expensive calculations and functions.

```javascript
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

## Writing Custom Hooks

Custom hooks let you extract and reuse stateful logic across components.

```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

## Best Practices

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Name custom hooks starting with "use"
4. Keep hooks focused on a single concern

Master these and your React code will be cleaner than ever! ⚛️',
  'React',
  'Intermediate',
  10,
  ARRAY['react', 'hooks', 'javascript', 'frontend'],
  '⚛️'
),
(
  'TypeScript for Backend Engineers',
  'typescript-for-backend-engineers',
  'Unlock the full power of TypeScript on the server side. Learn advanced types, decorators, and patterns for building robust APIs.',
  '# TypeScript for Backend Engineers

TypeScript brings type safety and developer tooling to Node.js backends. Let''s explore how to harness its full power.

## Why TypeScript on the Backend?

- **Catch bugs at compile time** before they reach production
- **Better IDE support** with autocomplete and refactoring
- **Self-documenting code** — types serve as documentation
- **Safer refactoring** across large codebases

## Setting Up TypeScript with Node.js

```bash
npm init -y
npm install typescript ts-node @types/node
npx tsc --init
```

## Advanced Types You Need

### Utility Types
```typescript
// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Pick specific properties
type UserPreview = Pick<User, "id" | "name" | "email">;

// Omit specific properties
type PublicUser = Omit<User, "password" | "secretKey">;
```

### Discriminated Unions
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function processResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data); // TypeScript knows data exists
  } else {
    console.error(result.error); // TypeScript knows error exists
  }
}
```

### Generic Constraints
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Building Type-Safe APIs

Use Zod for runtime validation that matches your TypeScript types:

```typescript
import { z } from "zod";

const CreateTutorialSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(100),
  category: z.enum(["React", "Node.js", "System Design"]),
});

type CreateTutorialInput = z.infer<typeof CreateTutorialSchema>;
```

Type-safe backends lead to production-ready code! 🛡️',
  'TypeScript',
  'Advanced',
  12,
  ARRAY['typescript', 'nodejs', 'backend', 'api'],
  '🔷'
);
