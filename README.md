# DSA ZONE — Interactive Data Structures & Algorithms

<div align="center">

![DSA ZONE Banner](https://img.shields.io/badge/DSA%20LAB-Interactive%20Visualizer-FFE135?style=for-the-badge&logo=codeforces&logoColor=black)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)


<br/>

**Master Computer Science fundamentals with comic-pop aesthetics, step-by-step animations, comprehensive guides, and instant-feedback practice problems.**

[🚀 Explore Live App](https://ais-dev-73njxkymd6u2gqqqzrsexk-711746768395.asia-east1.run.app) • [📖 Curriculum](#-learning-curriculum) • [🛠️ Visualizers](#-interactive-visualizers) • [🎯 Practice](#-practice-engine) •

</div>

---

## 🎨 What is DSA ZONE?

**DSA ZONE** reimagines algorithmic education by trading sterile, dry diagrams for a **vibrant, neo-brutalist comic-book playground**. Every data structure comes to life with step-by-step animation controls, live code tracers, dynamic pointer highlights, and interactive problem testing.

Whether you're prepping for technical coding interviews (FAANG / Big Tech) or building CS intuition from scratch, DSA LAB provides a visual mental model of how memory, pointers, nodes, and partitions behave in real time.

---

## ✨ Key Features

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               DSA ZONE                                  │
├───────────────────┬───────────────────┬────────────────────────────────┤
│   🎮 VISUALIZE    │     📚 LEARN      │          🎯 PRACTICE           │
│ Step-by-step anim │ 9-step deep dives │ Instant-feedback quiz engine   │
│ Live memory model │ Big-O comparisons │ Difficulty filters (Beg/Int/Adv│
│ Speed & scrubber  │ Real-world cases  │ Session accuracy tracking      │
└───────────────────┴───────────────────┴────────────────────────────────┘
1. 🎮 Interactive Visualizers
Granular Playback Controls: Step forward, step backward, pause, restart, and scrub animation speeds from 0.25x to 2x.
Dynamic State Inspections: Visual callouts displaying indices, pivot boundaries, hash table buckets, recursion stacks, and tree balance factors in real time.
Time & Space Complexity Panel: Live telemetry indicating current best, average, and worst-case complexities.
Live Code Highlighter: Syncs each visual frame with the matching line in standard JavaScript/TypeScript implementations.
2. 📚 9-Step Learning Curriculum
Every topic features a comprehensive, structured breakdown:
What is it? — Core intuition, fundamental definitions, and mental models.
Why learn it? — Comparison against alternative data structures.
Step-by-step execution — Detailed algorithmic steps and mechanics.
Code implementations — Production-ready reference code with syntax highlighting.
Visual diagrams — High-contrast step walkthroughs.
Core operations — Insertion, deletion, search, traversal complexities.
Time & Space Complexity — Thorough mathematical analysis.
Real-world engineering — How Linux kernels, databases, browser caches, and routers apply this topic.
Quick-Check Quiz — Conceptual checkpoint to validate your understanding before moving forward.
3. 🎯 Practice Engine
Curated Problem Bank: Targeted conceptual and LeetCode-style questions across all categories.
Difficulty Badges: Filter smoothly by Beginner, Intermediate, or Advanced.
Instant Explanations: Immediate feedback explaining why an option is optimal or suboptimal.
Session-Only Reset: Starts completely clean upon reload so you can re-test yourself anytime without lingering answers.
🗺️ Covered Topics
Category	Topics Included	Visualizer Status
🧱 Linear Data Structures	Arrays, Singly Linked Lists, Doubly Linked Lists, Stacks, Linear Queues, Circular Queues, Priority Queues, Hash Tables	✅ Implemented
🌳 Trees & Hierarchies	Binary Trees, Binary Search Trees (BST), AVL Trees (Auto-balancing), Heaps (Min/Max)	✅ Implemented
🕸️ Graphs & Networks	Graph BFS, Graph DFS, Dijkstra's Shortest Path, Prim's MST, Kruskal's MST	✅ Implemented
⚡ Algorithms & Paradigms	Linear Search, Binary Search, Recursion & Call Stacks, Greedy Algorithms, Dynamic Programming, Backtracking	✅ Implemented
🔀 Sorting Companion	Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort	🔗 Powered by Sortify
🚀 Sortify Integration
Sorting algorithms feature a dedicated companion visualizer suite: Sortify.
Deep comparison visualizer with sound effects and custom array generators.
Available directly via one-click launch from the DSA LAB sidebar and home screen.
🌐 Visit: https://sortify-algo.vercel.app/
🛠️ Tech Stack & Architecture
Core: React 19, TypeScript 7
Bundler & Tooling: Vite 8
Styling: Tailwind CSS v4 with @tailwindcss/vite
Animations: Motion (Framer Motion)
Icons: Lucide React
Typography & UI: Comic pop aesthetic with heavy neo-brutalist borders (2px solid #000), punchy pastel accents (#FFE135, #22C55E, #EF4444, #3B82F6), and hard box-shadow offsets (shadow-[3px_3px_0px_#000]).
📁 Project Structure
code
Text
├── src/
│   ├── components/            # Reusable UI widgets
│   │   ├── Navbar.tsx         # Comic-styled top navigation
│   │   ├── Sidebar.tsx        # Topic navigation drawer & quick switch
│   │   ├── AnimationControls  # Scrubber, play/pause, step controls
│   │   ├── ComplexityPanel    # Big-O complexity readout
│   │   ├── LiveCodeDemo...    # Synchronized algorithm code display
│   │   ├── QuestionCard.tsx   # Interactive quiz component
│   │   └── ProgressModal.tsx  # User progress & stats dashboard
│   ├── data/
│   │   ├── topics.ts          # Topic definitions and metadata
│   │   ├── learnContent.ts    # 9-step deep-dive curriculum content
│   │   └── questions.ts       # Curated question bank & explanations
│   ├── pages/
│   │   ├── Home.tsx           # Hero landing & feature cards
│   │   ├── Visualizer.tsx     # Canvas container for algorithm visualizers
│   │   ├── Learn.tsx          # Interactive learning textbook
│   │   └── Practice.tsx       # Filterable practice arena
│   ├── visualizers/           # Dedicated visualizer engines
│   │   ├── ArrayVisualizer.tsx
│   │   ├── LinkedListVisualizer.tsx
│   │   ├── StackVisualizer.tsx
│   │   ├── QueueVisualizer.tsx
│   │   ├── HashTableVisualizer.tsx
│   │   ├── TreeVisualizer.tsx
│   │   ├── AVLTreeVisualizer.tsx
│   │   ├── HeapVisualizer.tsx
│   │   ├── GraphVisualizer.tsx
│   │   ├── SearchVisualizer.tsx
│   │   └── AlgorithmVisualizer.tsx
│   ├── types/                 # TypeScript interfaces
│   ├── App.tsx                # Main app state and tab router
│   ├── main.tsx               # DOM entry point
│   └── index.css              # Neo-brutalist theme & scrollbar configs
├── public/                    # Static assets & icons
├── package.json
└── vite.config.ts
