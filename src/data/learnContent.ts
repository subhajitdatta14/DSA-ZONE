export interface LearnSection {
  title: string;
  subtitle?: string;
  content: string;
  points?: string[];
  code?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  highlightBox?: {
    label: string;
    text: string;
  };
}

export interface LearnTopicContent {
  topicId: string;
  topicTitle: string;
  tagline: string;
  sections: {
    whatIsIt: LearnSection;
    whyUsed: LearnSection;
    howItWorks: LearnSection;
    visualExample: {
      title: string;
      description: string;
      baseAddressHex?: string;
      elementSizeBytes?: number;
      elements?: (number | string)[];
      items?: Array<{ label: string; value: string | number; note?: string }>;
      breakdownNote?: string;
    };
    operations: {
      name: string;
      description: string;
      bestCase: string;
      worstCase: string;
      note: string;
    }[];
    timeComplexity: {
      operation: string;
      best: string;
      average: string;
      worst: string;
      reason: string;
    }[];
    spaceComplexity: {
      title: string;
      complexity: string;
      explanation: string;
    };
    realWorldExample: {
      title: string;
      description: string;
      examples: { title: string; detail: string }[];
    };
    quickCheck: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };
}

export const LEARN_TOPICS: Record<string, LearnTopicContent> = {
  // 1. Array
  array: {
    topicId: 'array',
    topicTitle: 'Array',
    tagline: 'The foundation of data storage: contiguous memory with instant index calculation.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'An array is a collection of elements of the same data type stored in contiguous (side-by-side) memory locations. Unlike a loose list of items, an array groups values together under a single variable name, referenced by numerical indices starting from 0.',
        points: [
          'Contiguous memory: Elements sit directly next to one another in physical RAM.',
          'Homogeneous elements: All items typically share identical data type and size.',
          'Zero-based indexing: The first element begins at index 0, the last at index n - 1.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Arrays are the fastest data structure for random index access. If you know the index of an element, you can retrieve it in constant time O(1), without needing to iterate through the preceding items.',
        points: [
          'Instant retrieval: Accessing arr[4] is as fast as accessing arr[0].',
          'CPU cache efficiency: Because memory is contiguous, modern CPUs prefetch adjacent array elements into ultra-fast L1/L2 caches.',
          'Predictable memory footprint: No extra pointer overhead compared to linked nodes.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Computers locate array items using direct arithmetic instead of searching. Because every item has a fixed size (e.g. 4 bytes for a 32-bit integer), the hardware computes the exact RAM address in one single clock cycle using this formula:',
        code: 'MemoryAddress(index) = BaseAddress + (index * ElementSize)',
        highlightBox: {
          label: 'Why Index 0?',
          text: 'The index represents an "offset" from the base memory address. For the first item, offset is 0, so BaseAddress + 0 * 4 = BaseAddress. That is why programming languages index from 0!',
        },
      },
      visualExample: {
        title: '4. Visual Example: Contiguous Memory Layout',
        description:
          'Interact with the array elements below to see their exact physical RAM byte calculation:',
        baseAddressHex: '0x1000',
        elementSizeBytes: 4,
        elements: [10, 20, 30, 40, 50],
        items: [
          { label: 'arr[0]', value: 10, note: 'Offset: +0B -> 0x1000' },
          { label: 'arr[1]', value: 20, note: 'Offset: +4B -> 0x1004' },
          { label: 'arr[2]', value: 30, note: 'Offset: +8B -> 0x1008' },
          { label: 'arr[3]', value: 40, note: 'Offset: +12B -> 0x100C' },
          { label: 'arr[4]', value: 50, note: 'Offset: +16B -> 0x1010' },
        ],
        breakdownNote: 'Calculated via BaseAddress + (Index * 4 Bytes). Single clock cycle calculation!',
      },
      operations: [
        {
          name: 'Access (Lookup by Index)',
          description: 'Calculate address using index formula and read memory directly.',
          bestCase: 'O(1)',
          worstCase: 'O(1)',
          note: 'Direct RAM address calculation; always instant.',
        },
        {
          name: 'Search (Lookup by Value)',
          description: 'Iterate from start until target value matches or end is reached.',
          bestCase: 'O(1)',
          worstCase: 'O(n)',
          note: 'Best if item is at index 0; worst if at the very end or absent.',
        },
        {
          name: 'Insertion (at index i)',
          description: 'Must shift all elements from index i to n-1 rightward to make space.',
          bestCase: 'O(1)',
          worstCase: 'O(n)',
          note: 'O(1) if appending at end (with remaining capacity); O(n) if inserting at index 0.',
        },
        {
          name: 'Deletion (at index i)',
          description: 'Removes item and shifts all trailing elements leftward to close the gap.',
          bestCase: 'O(1)',
          worstCase: 'O(n)',
          note: 'O(1) if deleting the last element; O(n) if deleting the first element.',
        },
        {
          name: 'Update (at index i)',
          description: 'Directly overwrites the value stored at the calculated memory address.',
          bestCase: 'O(1)',
          worstCase: 'O(1)',
          note: 'Instant index address lookup followed by a single write.',
        },
      ],
      timeComplexity: [
        { operation: 'Access (arr[i])', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct memory offset calculation' },
        { operation: 'Search (by value)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', reason: 'Must inspect items one by one in unsorted array' },
        { operation: 'Insert at End', best: 'O(1)', average: 'O(1)', worst: 'O(1)*', reason: 'Direct write if capacity exists (*reallocation amortized)' },
        { operation: 'Insert at Beginning', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'Must shift all n elements one index right' },
        { operation: 'Delete from End', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Simply decrement length counter' },
        { operation: 'Delete from Beginning', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'Must shift all n-1 remaining elements one index left' },
        { operation: 'Update (arr[i] = val)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct write at computed offset' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation:
          'An array requires linear space proportional to the number of stored elements n multiplied by the element size. Auxiliary space for basic access and mutation operations is O(1) because no additional memory buffers are needed.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where do we see arrays operating inside real software systems?',
        examples: [
          {
            title: 'Digital Audio & Music Playlists',
            detail: 'Audio sample buffers hold raw 44.1kHz PCM waveform bytes in contiguous arrays for glitch-free real-time audio playback.',
          },
          {
            title: 'Image Pixel Grids & Computer Graphics',
            detail: 'A 1920x1080 display is stored as a 1D or 2D array of RGBA byte values, allowing the GPU to blast millions of pixels directly to screen buffers.',
          },
          {
            title: 'CPU Cache Optimization in High-Frequency Trading',
            detail: 'Stock order book price ladders use contiguous arrays to avoid pointer chasing, ensuring sub-microsecond algorithmic execution.',
          },
        ],
      },
      quickCheck: {
        question: 'If an integer occupies 4 bytes and array base address is 2000, what is the address of element at index 4?',
        options: ['2004', '2016', '2020', '2008'],
        correctIndex: 1,
        explanation: 'Address = 2000 + (4 * 4) = 2000 + 16 = 2016.',
      },
    },
  },

  // 2. Linked List
  'linked-list': {
    topicId: 'linked-list',
    topicTitle: 'Singly Linked List',
    tagline: 'Dynamic chain of nodes connected via pointers with effortless O(1) head insertion.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Singly Linked List is a linear dynamic data structure where each element is stored inside an independent "Node". Unlike arrays, nodes are not stored sequentially in RAM; each node holds its data payload and a reference ("next" pointer) to the subsequent node in the chain.',
        points: [
          'Node structure: Contains [Data | Next Pointer].',
          'Head and Tail: The list starts at the Head pointer and concludes when a node points to NULL.',
          'Scattered memory: Nodes are allocated dynamically in heap memory anywhere available.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Linked lists shine when you need flexible, dynamic resizing without costly array reallocations or mass element shifts. Inserting or deleting at the head takes O(1) time without moving any other nodes.',
        points: [
          'Dynamic size: Expands and contracts seamlessly at runtime without fixed pre-allocation.',
          'O(1) prepend: Inserting a new head only requires re-pointing a single pointer.',
          'No memory waste from reserved capacity buffers.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Traversing a linked list requires "pointer chasing". You start at the head pointer and follow current = current.next step-by-step until reaching your desired target or NULL.',
        code: 'newNode.next = head;\nhead = newNode; // O(1) Head Insertion',
        highlightBox: {
          label: 'No Random Access',
          text: 'Because nodes are scattered in memory, you cannot jump directly to index 5 via math. You must walk through indices 0 -> 1 -> 2 -> 3 -> 4 -> 5 in O(n) sequential steps.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Node Chain & Pointer Links',
        description: 'Inspect the interconnected node sequence and their dynamic memory references:',
        items: [
          { label: 'HEAD -> Node 1', value: 12, note: 'Points to Node 2 (0x24A0)' },
          { label: 'Node 2', value: 99, note: 'Points to Node 3 (0x38F0)' },
          { label: 'Node 3', value: 37, note: 'Points to Node 4 (0x51C0)' },
          { label: 'TAIL -> Node 4', value: 84, note: 'Points to NULL (End of list)' },
        ],
        breakdownNote: 'Insertion only modifies pointer addresses: newNode.next = nextNode; prevNode.next = newNode.',
      },
      operations: [
        { name: 'Insert at Head', description: 'Create node, point next to old head, update head pointer.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Pure pointer reassignment.' },
        { name: 'Insert at Tail', description: 'Traverse to end (or use tail pointer) and link new node.', bestCase: 'O(1)*', worstCase: 'O(n)', note: 'O(1) if maintaining tail reference.' },
        { name: 'Search by Value', description: 'Walk from head to end comparing value at each node.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'Linear sequential traversal.' },
        { name: 'Delete Node', description: 'Re-wire previous node next pointer to bypass target node.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(1) once previous node is known.' },
      ],
      timeComplexity: [
        { operation: 'Prepend (Insert Head)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Single pointer swap' },
        { operation: 'Append (with Tail)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct tail pointer update' },
        { operation: 'Access / Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', reason: 'Must walk chain linearly' },
        { operation: 'Delete at Head', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'head = head.next' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Requires memory for n data values plus n pointer references (typically 8 bytes each on 64-bit systems).',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where linked lists power software engineering architectures:',
        examples: [
          { title: 'Operating System Free Memory Lists', detail: 'OS kernel allocators track unallocated memory chunks using linked free-lists.' },
          { title: 'Browser History & Forward/Back Navigation', detail: 'Tab navigation tracks visited URLs in sequence using node linkages.' },
          { title: 'Undo / Redo Buffers', detail: 'Text editors chain document mutation deltas so users can rewind edits.' },
        ],
      },
      quickCheck: {
        question: 'What is the time complexity to insert a new element at the beginning of a singly linked list?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Inserting at the head only requires updating two pointer references, which executes in constant O(1) time.',
      },
    },
  },

  // 3. Doubly Linked List
  'doubly-linked-list': {
    topicId: 'doubly-linked-list',
    topicTitle: 'Doubly Linked List',
    tagline: 'Two-way chains with next and previous pointers enabling bidirectional traversal and instant deletion.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Doubly Linked List (DLL) is a variation of linked list where each node contains two pointers: one pointing forward to the next node, and one pointing backward to the preceding node.',
        points: [
          'Node layout: [Prev Pointer | Data | Next Pointer].',
          'Bidirectional: Can be traversed from Head to Tail OR Tail to Head.',
          'Head prev is NULL; Tail next is NULL.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'In a singly linked list, deleting a node requires finding the preceding node via an O(n) traversal. In a doubly linked list, having a direct prev pointer enables instant O(1) self-deletion.',
        points: [
          'O(1) deletion: node.prev.next = node.next; node.next.prev = node.prev.',
          'Reverse navigation: Effortlessly step backward.',
          'Core foundation for LRU Caches and double-ended queues (Deques).',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Every insertion or deletion involves updating 4 pointers instead of 2. Care must be taken to update both forward and backward connections consistently.',
        code: '// Inserting node B between A and C:\nB.next = C; B.prev = A;\nA.next = B; C.prev = B;',
        highlightBox: {
          label: 'Memory Trade-off',
          text: 'Each node requires 2 pointer fields (16 bytes on 64-bit systems) in addition to payload data, using roughly twice the pointer overhead of singly linked lists.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Bidirectional Connections',
        description: 'Observe the symmetric bidirectional link pairs between neighboring nodes:',
        items: [
          { label: 'Node A [Head]', value: 10, note: 'prev: NULL ◄► next: Node B' },
          { label: 'Node B', value: 20, note: 'prev: Node A ◄► next: Node C' },
          { label: 'Node C', value: 30, note: 'prev: Node B ◄► next: Node D' },
          { label: 'Node D [Tail]', value: 40, note: 'prev: Node C ◄► next: NULL' },
        ],
        breakdownNote: 'Bidirectional links allow O(1) splice deletion when given reference to target node directly.',
      },
      operations: [
        { name: 'Insert at Head', description: 'Link new node as new head and hook old head prev pointer.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Instant pointer re-link.' },
        { name: 'Insert at Tail', description: 'Attach to tail and update tail forward/back links.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'O(1) with tail reference.' },
        { name: 'Delete Given Node', description: 'Bypass node using node.prev and node.next.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Zero search required if node pointer is known!' },
      ],
      timeComplexity: [
        { operation: 'Insert / Delete at Ends', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct head/tail access' },
        { operation: 'Delete Given Node', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct prev & next pointer manipulation' },
        { operation: 'Search by Value', best: 'O(1)', average: 'O(n)', worst: 'O(n)', reason: 'Must scan sequentially' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Linear space with 2 pointer references (prev and next) stored per node.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where Doubly Linked Lists serve critical infrastructure:',
        examples: [
          { title: 'LRU (Least Recently Used) Cache', detail: 'Combined with a Hash Map to provide O(1) cache evictions and key lookups.' },
          { title: 'Music Player Playlist Manager', detail: 'Seamlessly jumps to Previous Song and Next Song.' },
          { title: 'Browser Tabs & Window Navigation', detail: 'Enables switching tabs left and right smoothly.' },
        ],
      },
      quickCheck: {
        question: 'Why can a doubly linked list delete a node in O(1) time if given its pointer directly?',
        options: [
          'It re-allocates memory automatically',
          'Its prev pointer gives instant access to the predecessor without searching from head',
          'It is stored contiguously in memory',
          'It uses binary search internally',
        ],
        correctIndex: 1,
        explanation: 'Because the node stores a pointer to its predecessor (.prev), you do not need an O(n) walk from head to locate who points to it.',
      },
    },
  },

  // 4. Stack
  stack: {
    topicId: 'stack',
    topicTitle: 'Stack (LIFO)',
    tagline: 'Last-In First-Out structure: elements are added and removed strictly from the TOP.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Stack is an abstract data type governed by the LIFO (Last In, First Out) principle. The most recently added item is always the very first one to be removed, identical to a physical stack of dinner plates.',
        points: [
          'Push: Insert an element onto the top.',
          'Pop: Remove and return the element currently at the top.',
          'Peek / Top: Inspect top element without removing it.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Stacks are ideal for reversing sequences, tracking state history, parsing nested expressions, and managing function calls via execution call frames.',
        points: [
          'O(1) Push and Pop: Instant modifications restricted to a single boundary.',
          'Clean state backtracking: Perfect for backtracking search and syntax validation.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Stacks can be implemented using either a dynamic array or a singly linked list. A pointer or index named `top` tracks the topmost element.',
        code: 'stack.push(val); // top++\nval = stack.pop(); // return arr[top--]',
        highlightBox: {
          label: 'Stack Overflow & Underflow',
          text: 'Stack Overflow occurs when pushing onto a full fixed-capacity stack. Stack Underflow occurs when popping from an empty stack.',
        },
      },
      visualExample: {
        title: '4. Visual Example: LIFO Vertical Stack',
        description: 'Click elements from top to bottom to visualize push/pop mechanics:',
        items: [
          { label: 'TOP -> [3]', value: 88, note: 'Next item popped (Most recently pushed)' },
          { label: '[2]', value: 55, note: 'Second in line' },
          { label: '[1]', value: 33, note: 'Third in line' },
          { label: 'BOTTOM -> [0]', value: 11, note: 'First item pushed; will be popped last' },
        ],
        breakdownNote: 'LIFO Rule: Only the TOP item can be inspected or removed.',
      },
      operations: [
        { name: 'Push (Insert Top)', description: 'Place item on top of stack and increment top pointer.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Instant constant time.' },
        { name: 'Pop (Remove Top)', description: 'Retrieve item from top and decrement top pointer.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Instant constant time.' },
        { name: 'Peek (Look Top)', description: 'Inspect top value without removal.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Read only access.' },
      ],
      timeComplexity: [
        { operation: 'Push', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct access to top' },
        { operation: 'Pop', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct access to top' },
        { operation: 'Peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Single array/node read' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Proportional to number of elements currently stored on the stack.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Crucial applications of stack data structures:',
        examples: [
          { title: 'Call Stack in Compilers & Runtimes', detail: 'CPU call frames save return addresses and local variables during function execution.' },
          { title: 'Balanced Parentheses Validation', detail: 'Linters match opening brackets `({[` with closing counterparts using a stack.' },
          { title: 'Undo Command in Word Processors', detail: 'Each keystroke action is pushed so Ctrl+Z pops the most recent mutation.' },
        ],
      },
      quickCheck: {
        question: 'If you push 10, 20, 30 onto an empty stack and then call pop(), what value is returned?',
        options: ['10', '20', '30', '0'],
        correctIndex: 2,
        explanation: 'LIFO principle means 30 was pushed last, so it is the first element popped from the top.',
      },
    },
  },

  // 5. Queue
  queue: {
    topicId: 'queue',
    topicTitle: 'Queue (FIFO)',
    tagline: 'First-In First-Out sequential pipeline: added at REAR, removed from FRONT.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Queue is a linear sequential structure adhering to FIFO (First In, First Out). The first item enqueued is the first item dequeued, exactly like a checkout line at a grocery store.',
        points: [
          'Enqueue: Insert new element at the REAR/tail.',
          'Dequeue: Remove element from the FRONT/head.',
          'Front: View the oldest element waiting to be served.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Whenever asynchronous tasks, events, or jobs must be processed in the exact fair order they arrived, a queue is the mathematically correct structure.',
        points: [
          'Fair scheduling: No starvation; first arrived is first served.',
          'Decouples producer rate from consumer processing rate.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'A queue maintains two pointers: FRONT and REAR. Enqueue advances REAR; Dequeue advances FRONT.',
        code: 'queue.enqueue(val); // arr[rear++] = val\nval = queue.dequeue(); // return arr[front++]',
        highlightBox: {
          label: 'Linear Queue Waste',
          text: 'In a simple linear array queue, dequeuing leaves unused empty space at the front. A Circular Queue solves this by wrapping around!',
        },
      },
      visualExample: {
        title: '4. Visual Example: FIFO Pipeline',
        description: 'View the items entering from the Rear and exiting through the Front:',
        items: [
          { label: 'FRONT -> [0]', value: 'Job A', note: 'Next to be dequeued (first arrived)' },
          { label: '[1]', value: 'Job B', note: 'Waiting in queue' },
          { label: '[2]', value: 'Job C', note: 'Waiting in queue' },
          { label: 'REAR -> [3]', value: 'Job D', note: 'Most recently enqueued' },
        ],
        breakdownNote: 'FIFO Flow: Dequeue from FRONT ◄◄◄ Enqueue at REAR.',
      },
      operations: [
        { name: 'Enqueue', description: 'Insert item at rear.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Instant write.' },
        { name: 'Dequeue', description: 'Extract item from front.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Instant read and pointer advance.' },
      ],
      timeComplexity: [
        { operation: 'Enqueue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct write at rear pointer' },
        { operation: 'Dequeue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct read at front pointer' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Requires storage proportional to the number of queued elements.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Everyday systems relying on Queues:',
        examples: [
          { title: 'Printer Print Spooler', detail: 'Documents print in the strict sequence submitted by users.' },
          { title: 'BFS Graph Traversal', detail: 'Breadth-first search discovers neighbors level by level using a queue.' },
          { title: 'Web Server Request Buffers', detail: 'Incoming HTTP requests queue up when traffic spikes occur.' },
        ],
      },
      quickCheck: {
        question: 'Which element is dequeued first from a queue containing [42, 18, 95] inserted in that order?',
        options: ['95', '18', '42', 'None'],
        correctIndex: 2,
        explanation: 'In FIFO, the first item enqueued (42) is the first to be dequeued.',
      },
    },
  },

  // 6. Circular Queue
  'circular-queue': {
    topicId: 'circular-queue',
    topicTitle: 'Circular Queue (Ring Buffer)',
    tagline: 'Ring buffer reusing memory slots with modulo arithmetic: (index + 1) % size.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Circular Queue is a FIFO data structure implemented over a fixed-size array where the last position wraps around and connects back to the first position, forming an infinite loop ring buffer.',
        points: [
          'Modulo arithmetic: nextIndex = (currentIndex + 1) % Capacity.',
          'Zero wasted space: Dequeued slots are reused immediately by incoming enqueues.',
          'Fixed memory footprint: Highly prized in embedded and real-time audio systems.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Linear array queues suffer from "false overflow": after several enqueues and dequeues, rear hits capacity even though empty slots exist at the front. Circular queues eliminate this defect completely.',
        points: [
          'Continuous streaming without array shifting.',
          'Strict bounded memory guarantees without heap allocations.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Modulo indexing wraps pointers back to index 0 when they reach capacity - 1.',
        code: 'rear = (rear + 1) % CAPACITY;\nfront = (front + 1) % CAPACITY;',
        highlightBox: {
          label: 'Full vs Empty Condition',
          text: 'Empty queue: front == -1. Full queue: (rear + 1) % CAPACITY == front.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Modulo Ring Slots',
        description: 'Observe how slot indices wrap seamlessly around capacity:',
        items: [
          { label: 'Slot [0]', value: 70, note: '(0+1)%5 = 1' },
          { label: 'Slot [1] (FRONT)', value: 80, note: 'Front of queue' },
          { label: 'Slot [2]', value: 90, note: 'In queue' },
          { label: 'Slot [3] (REAR)', value: 100, note: 'Rear of queue' },
          { label: 'Slot [4]', value: 'NULL', note: 'Available slot for wrap-around' },
        ],
        breakdownNote: 'Next enqueue goes to (3 + 1) % 5 = Slot [4]. If rear reaches 4, next is (4 + 1) % 5 = Slot [0]!',
      },
      operations: [
        { name: 'Enqueue (Modulo)', description: 'Advance rear with (rear+1)%CAPACITY and write.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Constant time math.' },
        { name: 'Dequeue (Modulo)', description: 'Advance front with (front+1)%CAPACITY.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Constant time math.' },
      ],
      timeComplexity: [
        { operation: 'Enqueue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'O(1) modulo index calculation' },
        { operation: 'Dequeue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'O(1) modulo index calculation' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(k)',
        explanation: 'Fixed capacity k allocated once. Zero dynamic reallocations.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Real-time engineering systems using circular ring buffers:',
        examples: [
          { title: 'Audio Driver PCM Playback Buffers', detail: 'DSPs write audio frames in a continuous ring buffer played by DAC hardware.' },
          { title: 'Video Streaming Buffer', detail: 'Decodes video frames into a circular queue for jitter-free streaming.' },
          { title: 'Keyboard Keystroke Ring Buffer', detail: 'Hardware interrupts write keystrokes into BIOS ring buffer.' },
        ],
      },
      quickCheck: {
        question: 'In a circular queue of capacity 5, if rear is currently at index 4, what is the next rear position?',
        options: ['5', '0', '1', '-1'],
        correctIndex: 1,
        explanation: 'Formula: (4 + 1) % 5 = 5 % 5 = 0. It wraps around to index 0.',
      },
    },
  },

  // 7. Priority Queue
  'priority-queue': {
    topicId: 'priority-queue',
    topicTitle: 'Priority Queue',
    tagline: 'Abstract container where elements with highest priority are served before lower ones.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Priority Queue is an extension of queue where each element possesses an assigned priority. Elements with higher priority are dequeued before elements with lower priority, regardless of insertion order.',
        points: [
          'Highest priority dispatched first.',
          'Typically implemented under the hood using a Binary Heap for O(log n) efficiency.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Critical when tasks have differing urgency: system interrupts, emergency vehicles, or pathfinding algorithms like Dijkstra and A*.',
        points: [
          'Guarantees highest priority item is at root in O(1) peek time.',
          'Logarithmic O(log n) insertion and extraction.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Backed by a heap array, newly inserted tasks are sifted up to their correct priority rank.',
        code: 'pq.insert(task, priority); // O(log n) sift up\nhighest = pq.extractMax(); // O(log n) sift down',
        highlightBox: {
          label: 'Priority Convention',
          text: 'In some systems (Min-PQ), smaller numbers mean higher priority (e.g. Priority 1 is urgent). In Max-PQ, larger values are prioritized.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Priority Dispatch Ladder',
        description: 'Tasks sorted by priority urgency:',
        items: [
          { label: 'Rank #1 (NEXT)', value: 'P1: System Crash Alert', note: 'Priority Level 1 (Emergency)' },
          { label: 'Rank #2', value: 'P2: Payment Processing', note: 'Priority Level 2 (High)' },
          { label: 'Rank #3', value: 'P5: Generate Invoice PDF', note: 'Priority Level 5 (Normal)' },
          { label: 'Rank #4', value: 'P9: Archive Old Logs', note: 'Priority Level 9 (Background)' },
        ],
        breakdownNote: 'Peek is instant O(1) at top of heap. Extraction re-balances heap in O(log n).',
      },
      operations: [
        { name: 'Peek Highest', description: 'Inspect root element.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Direct root access.' },
        { name: 'Insert Task', description: 'Append and sift up.', bestCase: 'O(1)', worstCase: 'O(log n)', note: 'Heapify upwards.' },
        { name: 'Extract Highest', description: 'Remove root and sift down replacement.', bestCase: 'O(log n)', worstCase: 'O(log n)', note: 'Heapify downwards.' },
      ],
      timeComplexity: [
        { operation: 'Peek Root', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Root is always highest priority' },
        { operation: 'Insert (Push)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', reason: 'Tree height is log₂(n)' },
        { operation: 'Extract (Pop)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', reason: 'Sifting down tree depth' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Linear space storing n priority elements in heap array.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Mission-critical priority queue implementations:',
        examples: [
          { title: "Dijkstra's Shortest Path Algorithm", detail: 'Extracts the unvisited node with minimum distance in O(log V) time.' },
          { title: 'OS Process CPU Scheduler', detail: 'Allocates CPU time slices to high-priority system tasks ahead of background threads.' },
          { title: 'Hospital Emergency Room Triage', detail: 'Critical patients receive immediate medical attention ahead of non-urgent visits.' },
        ],
      },
      quickCheck: {
        question: 'What is the time complexity of extracting the highest priority element from a binary-heap-backed priority queue?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'Extracting the root requires moving the last leaf to the root and sifting down through tree height O(log n).',
      },
    },
  },

  // 8. Hash Table
  'hash-table': {
    topicId: 'hash-table',
    topicTitle: 'Hash Table',
    tagline: 'Associative key-value dictionary with instant O(1) average lookup via hashing.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Hash Table (Hash Map) is an associative data structure that stores key-value pairs. It maps arbitrary keys (like strings or objects) to bucket array indices using a mathematical hash function.',
        points: [
          'Hash Function: Converts key into integer index: hash(key) % capacity.',
          'Bucket Array: Array holding values or chained linked lists.',
          'O(1) average lookup, insertion, and deletion.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Hash tables allow instantaneous access to data by name, ID, or token without searching through lists or trees.',
        points: [
          'Instant retrieval by string key.',
          'Underpins dictionaries, caches, database indices, and symbol tables.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'A hash function generates a numeric hash code. Collisions (when two different keys hash to the same bucket) are handled via Separate Chaining or Open Addressing.',
        code: 'int bucket = hash("username") % tableSize;\ntable[bucket].insert("username", userData);',
        highlightBox: {
          label: 'Load Factor & Rehashing',
          text: 'Load Factor α = n / k (items / buckets). When α exceeds 0.75, the table doubles bucket capacity and rehashes items to prevent long collision chains.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Bucket Indexing with Chaining',
        description: 'See how keys hash into bucket slots and chain on collision:',
        items: [
          { label: 'Bucket [0]', value: 'user:alice -> "Eng"', note: 'hash("alice") % 6 = 0' },
          { label: 'Bucket [1]', value: 'user:bob -> "Design"', note: 'hash("bob") % 6 = 1' },
          { label: 'Bucket [2]', value: 'EMPTY', note: 'No keys hashed here' },
          { label: 'Bucket [3]', value: 'user:carol -> user:dave', note: 'Collision! Chained linked list' },
        ],
        breakdownNote: 'Direct bucket lookup is O(1). Separate chaining ensures no data is overwritten upon collision.',
      },
      operations: [
        { name: 'Put (Insert/Update)', description: 'Hash key and store in bucket.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(1) average case.' },
        { name: 'Get (Lookup)', description: 'Hash key and search bucket chain.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(1) average case.' },
        { name: 'Delete', description: 'Remove key entry from bucket.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(1) average case.' },
      ],
      timeComplexity: [
        { operation: 'Search', best: 'O(1)', average: 'O(1)', worst: 'O(n)', reason: 'Worst case occurs if all keys collide into 1 bucket' },
        { operation: 'Insert', best: 'O(1)', average: 'O(1)', worst: 'O(n)', reason: 'O(1) average with good hash function distribution' },
        { operation: 'Delete', best: 'O(1)', average: 'O(1)', worst: 'O(n)', reason: 'Direct bucket entry removal' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Linear space proportional to stored key-value pairs plus bucket array slots.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Ubiquitous hash table use cases:',
        examples: [
          { title: 'Database Primary Key Indexing', detail: 'Relational & NoSQL databases look up row pointers by ID in O(1) time.' },
          { title: 'Session Tokens & Caching (Redis)', detail: 'Fast in-memory key-value caching of user sessions and auth tokens.' },
          { title: 'Compiler Variable Symbol Tables', detail: 'Compilers look up variable names and type scopes during parsing.' },
        ],
      },
      quickCheck: {
        question: 'What is the average time complexity of looking up a key in a well-balanced Hash Table?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'With a uniform hash distribution and reasonable load factor, average search time is constant O(1).',
      },
    },
  },

  // 9. Binary Tree
  'binary-tree': {
    topicId: 'binary-tree',
    topicTitle: 'Binary Tree',
    tagline: 'Hierarchical tree structure where every node has at most two children: left and right.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Binary Tree is a non-linear hierarchical data structure starting at a Root node, where each node contains at most two children referenced as the Left Child and Right Child.',
        points: [
          'Root: Topmost node with no parent.',
          'Leaf: Node with no children (left and right are NULL).',
          'Height: Length of longest downward path from root to leaf.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Binary trees naturally represent hierarchical relationships (like file folder directory trees, HTML DOMs, and decision trees) and allow efficient recursive traversals.',
        points: [
          'Hierarchical parent-child relationships.',
          'Base foundation for BSTs, AVL Trees, Heaps, and Segment Trees.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Traversed recursively via Pre-order (Root-Left-Right), In-order (Left-Root-Right), Post-order (Left-Right-Root), or Level-order (BFS).',
        code: 'void inOrder(Node* root) {\n  if (!root) return;\n  inOrder(root->left);\n  visit(root);\n  inOrder(root->right);\n}',
        highlightBox: {
          label: 'Tree Property',
          text: 'A binary tree with N nodes has exactly N - 1 edges.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Binary Tree Hierarchy',
        description: 'Explore root, branches, and leaves:',
        items: [
          { label: 'Root [50]', value: 50, note: 'Left: 25, Right: 75' },
          { label: 'Left Child [25]', value: 25, note: 'Left: 10, Right: 35' },
          { label: 'Right Child [75]', value: 75, note: 'Left: NULL, Right: 90' },
          { label: 'Leaf [10]', value: 10, note: 'No children (Leaf node)' },
        ],
        breakdownNote: 'Hierarchical branching structure enables recursive divide-and-conquer processing.',
      },
      operations: [
        { name: 'In-order Traversal', description: 'Left, Root, Right traversal.', bestCase: 'O(n)', worstCase: 'O(n)', note: 'Visits all n nodes.' },
        { name: 'Level-order (BFS)', description: 'Layer by layer using a queue.', bestCase: 'O(n)', worstCase: 'O(n)', note: 'Breadth first scan.' },
      ],
      timeComplexity: [
        { operation: 'Traversal (All)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'Must visit all n nodes once' },
        { operation: 'Search (Unsorted)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', reason: 'Must check every branch if unsorted' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Stores n nodes; recursive stack space is O(h) where h is tree height.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Real-world hierarchical tree structures:',
        examples: [
          { title: 'DOM (Document Object Model)', detail: 'Web browsers parse HTML into a hierarchical tree of DOM elements.' },
          { title: 'File System Folders', detail: 'Operating systems organize directories and files in tree hierarchies.' },
          { title: 'Syntax & Expression Trees', detail: 'Compilers parse mathematical expressions like 3 + (4 * 5) into binary ASTs.' },
        ],
      },
      quickCheck: {
        question: 'What is the maximum number of children any node in a binary tree can have?',
        options: ['1', '2', '3', 'Unlimited'],
        correctIndex: 1,
        explanation: 'By definition, a binary tree node can have at most 2 children (left and right).',
      },
    },
  },

  // 10. Binary Search Tree
  'binary-search-tree': {
    topicId: 'binary-search-tree',
    topicTitle: 'Binary Search Tree (BST)',
    tagline: 'Ordered binary tree: Left Subtree < Root < Right Subtree for fast O(log n) lookups.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Binary Search Tree (BST) is a binary tree where every node obeys the BST Invariant: all values in the left subtree are strictly smaller than the node, and all values in the right subtree are strictly greater.',
        points: [
          'Left < Root < Right for every node.',
          'In-order traversal yields elements in strictly ascending sorted order.',
          'Enables logarithmic search by discarding half the tree at every step.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Combines the fast search capability of a sorted array with the dynamic insertion/deletion flexibility of a linked list.',
        points: [
          'O(log n) search, insertion, and deletion when balanced.',
          'Natural range queries (e.g. find all numbers between 20 and 80).',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'To search for a value X: compare X with current node. If X < node.val, go left; if X > node.val, go right. Repeat until found or NULL.',
        code: 'if (x == root.val) return true;\nif (x < root.val) return search(root.left, x);\nelse return search(root.right, x);',
        highlightBox: {
          label: 'Degenerate BST Skew Warning',
          text: 'If items are inserted in sorted order (1, 2, 3, 4, 5), an unbalanced BST degrades into a linear linked list with O(n) search! Self-balancing trees (AVL) prevent this.',
        },
      },
      visualExample: {
        title: '4. Visual Example: BST Ordering Rule',
        description: 'Check how values are organized left (smaller) and right (larger):',
        items: [
          { label: 'Root [50]', value: 50, note: 'All left < 50, All right > 50' },
          { label: 'Left [30]', value: 30, note: '30 < 50 (Valid left child)' },
          { label: 'Right [70]', value: 70, note: '70 > 50 (Valid right child)' },
          { label: 'Left-Right [35]', value: 35, note: '35 > 30 and 35 < 50' },
        ],
        breakdownNote: 'At each comparison, half the remaining search space is eliminated.',
      },
      operations: [
        { name: 'Search', description: 'Compare and branch left or right.', bestCase: 'O(1)', worstCase: 'O(n)*', note: 'O(log n) on balanced tree (*O(n) if skewed).' },
        { name: 'Insert', description: 'Walk until NULL and attach new leaf.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(log n) average.' },
        { name: 'Delete', description: 'Replace with in-order successor if 2 children.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(log n) average.' },
      ],
      timeComplexity: [
        { operation: 'Search', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', reason: 'Worst case occurs if tree becomes a skewed line' },
        { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', reason: 'Traverses tree depth' },
        { operation: 'Delete', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', reason: 'May require finding in-order successor' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Linear space storing n nodes in dynamic memory.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where BST principles are leveraged:',
        examples: [
          { title: 'Database Range Indexing', detail: 'B-Trees (generalized multi-way BSTs) power SQL index scans for range queries.' },
          { title: 'Auto-Complete Dictionaries', detail: 'Prefix trees and BSTs quickly find matching word ranges.' },
          { title: 'Sorted Map & Set Containers', detail: 'Standard libraries (e.g. C++ std::map) implement ordered sets via balanced BSTs.' },
        ],
      },
      quickCheck: {
        question: 'Which traversal of a Binary Search Tree produces elements in strictly ascending sorted order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctIndex: 1,
        explanation: 'In-order traversal visits Left Subtree -> Root -> Right Subtree, which yields perfectly sorted ascending order.',
      },
    },
  },

  // 11. AVL Tree
  'avl-tree': {
    topicId: 'avl-tree',
    topicTitle: 'AVL Tree (Self-Balancing BST)',
    tagline: 'Guaranteed O(log n) operations by maintaining height balance factor between -1 and +1.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'An AVL Tree (named after inventors Adelson-Velsky and Landis) is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.',
        points: [
          'Balance Factor BF = Height(Left) - Height(Right).',
          'Strict Invariant: BF must always be -1, 0, or +1.',
          'Guarantees strictly logarithmic height: h < 1.44 * log₂(n).',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Prevents BST skewing! Regular BSTs degrade to O(n) if data arrives in sorted order. AVL trees automatically self-correct through tree rotations to guarantee O(log n) worst-case time.',
        points: [
          'Guaranteed O(log n) worst case lookup, insertion, and deletion.',
          'Ideal for read-intensive lookups requiring deterministic performance.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'After insertion or deletion, the tree walks back up to the root. If any node has |BF| > 1, it performs one of 4 rotation cases: Left-Left (Single Right), Right-Right (Single Left), Left-Right (Double), or Right-Left (Double).',
        code: '// Balance Factor Calculation\nint bf = height(node.left) - height(node.right);\nif (bf > 1 && val < node.left.val) return rotateRight(node);',
        highlightBox: {
          label: 'Rotations Take O(1) Time',
          text: 'A tree rotation only swaps 3 pointer links! The tree is rebalanced in constant time without moving any underlying values.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Balance Factor & Rotations',
        description: 'Examine node heights and balance factors:',
        items: [
          { label: 'Root [30]', value: 30, note: 'BF = 0 (Left h=2, Right h=2) BALANCED' },
          { label: 'Left [20]', value: 20, note: 'BF = 0 (Left h=1, Right h=1)' },
          { label: 'Right [40]', value: 40, note: 'BF = 0 (Left h=1, Right h=1)' },
          { label: 'Leaf [10]', value: 10, note: 'BF = 0 (Height 1)' },
        ],
        breakdownNote: 'If BF ever becomes +2 or -2, a constant-time rotation restores balance immediately.',
      },
      operations: [
        { name: 'Search', description: 'Standard BST search on balanced tree.', bestCase: 'O(1)', worstCase: 'O(log n)', note: 'Strictly bounded by O(log n).' },
        { name: 'Insert + Rotate', description: 'Insert leaf, update heights, rotate if unbalanced.', bestCase: 'O(1)', worstCase: 'O(log n)', note: 'At most 2 rotations needed.' },
        { name: 'Delete + Rotate', description: 'Delete node and propagate balance upwards.', bestCase: 'O(1)', worstCase: 'O(log n)', note: 'Guaranteed O(log n).' },
      ],
      timeComplexity: [
        { operation: 'Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', reason: 'Strict height balance guarantees depth ~ log₂(n)' },
        { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', reason: 'At most 1 or 2 O(1) rotations after tree walk' },
        { operation: 'Delete', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', reason: 'At most O(log n) rotations up the spine' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Each node stores payload, child pointers, and an integer height field.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where strict AVL balance guarantees are essential:',
        examples: [
          { title: 'In-Memory Database Indices', detail: 'High-speed relational engines needing predictable search latency.' },
          { title: 'Compiler Symbol Resolution', detail: 'Rapid lookup of identifier scopes without risk of worst-case degeneration.' },
        ],
      },
      quickCheck: {
        question: 'What are the permissible balance factor values in a valid AVL tree?',
        options: ['Only 0', '-1, 0, or +1', '-2, -1, 0, +1, +2', 'Any positive number'],
        correctIndex: 1,
        explanation: 'The AVL balancing criterion requires that for every node, |height(left) - height(right)| ≤ 1, meaning balance factors can only be -1, 0, or +1.',
      },
    },
  },

  // 12. Heap
  heap: {
    topicId: 'heap',
    topicTitle: 'Binary Heap',
    tagline: 'Complete binary tree stored in an array satisfying the Max/Min heap condition.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Binary Heap is a complete binary tree that satisfies the Heap Property. In a Max-Heap, every parent is greater than or equal to its children. In a Min-Heap, every parent is less than or equal to its children.',
        points: [
          'Max-Heap: Root holds the absolute maximum value.',
          'Complete tree: Every level is fully filled except possibly the last, which fills left-to-right.',
          'Stored implicitly in a contiguous array without explicit child pointers!',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Provides instant O(1) peek access to the extreme element and optimal O(log n) insertions/extractions with exceptional CPU cache locality.',
        points: [
          'No pointer overhead: Child indices are computed via arithmetic.',
          'Powerhouse behind Priority Queues and HeapSort.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Nodes map directly to 1D array indices: Parent = ⌊(i - 1) / 2⌋, Left Child = 2i + 1, Right Child = 2i + 2.',
        code: '// Sift Up on insert\nwhile (i > 0 && arr[i] > arr[parent(i)]) {\n  swap(arr[i], arr[parent(i)]);\n  i = parent(i);\n}',
        highlightBox: {
          label: 'Cache-Friendly Architecture',
          text: 'Because heap trees are stored in flat contiguous arrays, processors pre-load nodes into CPU cache, making heaps significantly faster in practice than pointer trees.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Implicit Array Index Mapping',
        description: 'See how complete tree nodes map directly to array indices:',
        items: [
          { label: 'Root arr[0]', value: 90, note: 'Maximum element (Max-Heap root)' },
          { label: 'Left arr[1]', value: 75, note: 'Child of [0]: Left = 2(0)+1 = 1' },
          { label: 'Right arr[2]', value: 80, note: 'Child of [0]: Right = 2(0)+2 = 2' },
          { label: 'Leaf arr[3]', value: 45, note: 'Child of [1]: Left = 2(1)+1 = 3' },
          { label: 'Leaf arr[4]', value: 60, note: 'Child of [1]: Right = 2(1)+2 = 4' },
        ],
        breakdownNote: 'Parent formula: parent(i) = floor((i-1)/2). Left child: 2i+1. Right child: 2i+2.',
      },
      operations: [
        { name: 'Peek Max/Min', description: 'Return root element at arr[0].', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Instant index read.' },
        { name: 'Insert (Sift-Up)', description: 'Append to array tail and bubble upwards.', bestCase: 'O(1)', worstCase: 'O(log n)', note: 'Bubble up.' },
        { name: 'Extract Max (Sift-Down)', description: 'Swap root with last element, pop, and sift down.', bestCase: 'O(log n)', worstCase: 'O(log n)', note: 'Reheapify down.' },
      ],
      timeComplexity: [
        { operation: 'Peek Max/Min', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Extreme element is always at index 0' },
        { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', reason: 'Bubbles up tree height at most' },
        { operation: 'Extract Max/Min', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', reason: 'Bubbles down tree height' },
        { operation: 'Build Heap (Heapify)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'Bottom-up mathematical summation converges to O(n)' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Contiguous array storage with zero pointer overhead.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where Binary Heaps drive software efficiency:',
        examples: [
          { title: 'HeapSort Algorithm', detail: 'In-place sorting algorithm with guaranteed O(n log n) time and O(1) space.' },
          { title: 'Event-Driven Simulation Timers', detail: 'Dispatches simulated time events in strict order of timestamp.' },
          { title: 'Top K Elements in Massive Big Data Streams', detail: 'Maintains a min-heap of size K to identify top elements in real-time.' },
        ],
      },
      quickCheck: {
        question: 'Given an element at index 3 in a 0-indexed binary heap array, at which index is its left child located?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
        explanation: 'Formula for left child is 2i + 1. For i = 3: 2(3) + 1 = 7.',
      },
    },
  },

  // 13. Graph
  graph: {
    topicId: 'graph',
    topicTitle: 'Graph (Vertices & Edges)',
    tagline: 'Network model representing entities (vertices) connected by relationships (edges).',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Graph G = (V, E) is a non-linear data structure consisting of a set of vertices (nodes) and a set of edges connecting pairs of vertices. Edges can be directed (one-way) or undirected (bidirectional), and can be weighted or unweighted.',
        points: [
          'Vertices: Objects, places, users, or system states.',
          'Edges: Connections, routes, friendships, or state transitions.',
          'Represented via Adjacency Lists or Adjacency Matrices.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Graphs model complex real-world interconnected networks like road maps, the World Wide Web, social networks, and dependency graphs.',
        points: [
          'Models any many-to-many relationship.',
          'Foundation for route navigation, recommendation engines, and circuit design.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Most modern applications represent graphs as Adjacency Lists (arrays of lists), storing for each vertex a list of its immediate neighbors for space-efficient O(V + E) traversals.',
        code: 'const graph = {\n  A: ["B", "C"],\n  B: ["A", "D"],\n  C: ["A", "D"],\n  D: ["B", "C"]\n};',
        highlightBox: {
          label: 'List vs Matrix',
          text: 'Adjacency List uses O(V + E) space, perfect for sparse real-world graphs. Adjacency Matrix uses O(V²) space, best for dense graphs.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Adjacency List Structure',
        description: 'Observe vertices and their neighbor connections:',
        items: [
          { label: 'Vertex A', value: 'Edges to: [B, C]', note: 'Degree: 2 connections' },
          { label: 'Vertex B', value: 'Edges to: [A, D, E]', note: 'Degree: 3 connections' },
          { label: 'Vertex C', value: 'Edges to: [A, E]', note: 'Degree: 2 connections' },
          { label: 'Vertex D', value: 'Edges to: [B, F]', note: 'Degree: 2 connections' },
        ],
        breakdownNote: 'Adjacency list stores only existing edges, conserving memory for sparse networks.',
      },
      operations: [
        { name: 'Add Vertex', description: 'Register new node.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Dictionary entry.' },
        { name: 'Add Edge', description: 'Append neighbor to adjacency list.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'List append.' },
        { name: 'Check Adjacency', description: 'Check if edge (u, v) exists.', bestCase: 'O(1)', worstCase: 'O(deg(u))', note: 'Linear scan of neighbor list.' },
      ],
      timeComplexity: [
        { operation: 'Graph Traversal (BFS/DFS)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', reason: 'Visits every vertex and edge once' },
        { operation: 'Add Vertex', best: 'O(1)', average: 'O(1)', worst: 'O(1)', reason: 'Direct map/array insertion' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(V + E)',
        explanation: 'Adjacency list stores V vertices and E edge connection pointers.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Universal network architectures modeled as graphs:',
        examples: [
          { title: 'Google Maps Navigation & GPS Routing', detail: 'Road intersections are vertices; streets are weighted edges.' },
          { title: 'Social Media Friend Graphs', detail: 'Users are vertices; friendships are undirected edges.' },
          { title: 'Package Dependency Resolvers (npm / pip)', detail: 'Direct acyclic graphs (DAGs) model build dependencies.' },
        ],
      },
      quickCheck: {
        question: 'What is the space complexity of representing a graph with V vertices and E edges using an Adjacency List?',
        options: ['O(V²)', 'O(V + E)', 'O(E²)', 'O(log V)'],
        correctIndex: 1,
        explanation: 'An adjacency list stores an entry for each of the V vertices and links for all E edges, totaling O(V + E) space.',
      },
    },
  },

  // 14. BFS
  bfs: {
    topicId: 'bfs',
    topicTitle: 'Breadth-First Search (BFS)',
    tagline: 'Layer-by-layer traversal using a FIFO queue to find unweighted shortest paths.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Breadth-First Search (BFS) is a graph and tree traversal algorithm that explores all neighbor nodes at the present depth layer before moving on to nodes at the next depth layer.',
        points: [
          'Queue-based: Uses a FIFO queue to track discovery order.',
          'Visited set: Keeps track of already visited vertices to avoid infinite cycles.',
          'Guarantees shortest path on unweighted graphs!',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'BFS is the optimal algorithm for finding the minimum number of steps or shortest path between two points when all edge weights are equal.',
        points: [
          'Finds shortest distance in unweighted networks.',
          'Discovers connected components and bipartite graph coloring.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Enqueues start node. While queue is not empty: dequeue current vertex, visit it, and enqueue all unvisited neighbors.',
        code: 'queue.push(start);\nvisited.add(start);\nwhile (!queue.empty()) {\n  curr = queue.pop();\n  for (neighbor of curr.neighbors) {\n    if (!visited.has(neighbor)) {\n      visited.add(neighbor);\n      queue.push(neighbor);\n    }\n  }\n}',
        highlightBox: {
          label: 'Shortest Path Property',
          text: 'Because BFS expands outward in concentric rings, the first time it reaches a target node, it is guaranteed to have taken the shortest path.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Wavefront Expansion',
        description: 'Track how nodes are explored level by level:',
        items: [
          { label: 'Layer 0 (Start)', value: 'Node A', note: 'Distance = 0' },
          { label: 'Layer 1 (Neighbors)', value: 'Node B, Node C', note: 'Distance = 1 edge away' },
          { label: 'Layer 2', value: 'Node D, Node E', note: 'Distance = 2 edges away' },
          { label: 'Layer 3 (Target)', value: 'Node F', note: 'Shortest path = 3 edges!' },
        ],
        breakdownNote: 'Queue ensures layer k is completely explored before any vertex in layer k+1 is processed.',
      },
      operations: [
        { name: 'BFS Traversal', description: 'Explore graph in breadth layers.', bestCase: 'O(V + E)', worstCase: 'O(V + E)', note: 'Optimal exploration.' },
      ],
      timeComplexity: [
        { operation: 'Traversal', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', reason: 'Every vertex is enqueued once; every edge is inspected once' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(V)',
        explanation: 'Queue and visited set can hold up to V vertices in memory.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Everyday applications of BFS:',
        examples: [
          { title: 'Social Network Degree of Separation', detail: 'Calculates "6 degrees of Kevin Bacon" or 2nd/3rd-degree LinkedIn connections.' },
          { title: 'Web Crawlers & Search Engines', detail: 'Crawls links starting from high-authority domains layer by layer.' },
          { title: 'Peer-to-Peer Torrent Discovery', detail: 'Discovers nearby network peers in peer-to-peer file sharing.' },
        ],
      },
      quickCheck: {
        question: 'Which auxiliary data structure is fundamentally required to implement Breadth-First Search?',
        options: ['Stack', 'FIFO Queue', 'Max-Heap', 'Hash Table'],
        correctIndex: 1,
        explanation: 'BFS relies on a First-In First-Out (FIFO) queue to ensure nodes discovered earlier are visited before nodes discovered later.',
      },
    },
  },

  // 15. DFS
  dfs: {
    topicId: 'dfs',
    topicTitle: 'Depth-First Search (DFS)',
    tagline: 'Deep branch traversal plunging down paths until dead ends before backtracking.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It dives down to the deepest reachable vertex before unwinding.',
        points: [
          'Stack-based: Implemented naturally using recursive call stack or an explicit LIFO stack.',
          'Backtracking: When a dead end is reached, the search retreats to the previous fork.',
          'Foundational for cycle detection, topological sorting, and maze solving.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'DFS uses less memory than BFS on wide graphs and is ideal for path checking, maze exploration, detecting cycles, and computing strongly connected components.',
        points: [
          'Low memory overhead: O(depth) stack space.',
          'Natural formulation for recursive puzzle solving.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Marks current vertex as visited, then recursively calls DFS on each unvisited neighbor.',
        code: 'function dfs(u) {\n  visited.add(u);\n  for (v of adj[u]) {\n    if (!visited.has(v)) dfs(v);\n  }\n}',
        highlightBox: {
          label: 'Cycle Detection',
          text: 'In directed graphs, if DFS encounters an ancestor node currently active on the recursion stack (a back-edge), a cycle exists!',
        },
      },
      visualExample: {
        title: '4. Visual Example: Deep Exploration & Backtracking',
        description: 'See the deep search sequence before unwinding:',
        items: [
          { label: 'Step 1: Root', value: 'Visit Node A', note: 'Pushes A to Call Stack' },
          { label: 'Step 2: Dive', value: 'Visit Node B', note: 'Pushes B to Call Stack' },
          { label: 'Step 3: Dead End', value: 'Visit Node D', note: 'No more neighbors! Backtracks to B' },
          { label: 'Step 4: Alternate', value: 'Visit Node E', note: 'Explores alternate branch' },
        ],
        breakdownNote: 'Plunges down single path until reaching dead end, then unwinds recursion stack.',
      },
      operations: [
        { name: 'DFS Traversal', description: 'Recursive depth traversal.', bestCase: 'O(V + E)', worstCase: 'O(V + E)', note: 'Visits all reachable components.' },
      ],
      timeComplexity: [
        { operation: 'Traversal', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', reason: 'Traverses each vertex and edge once' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(V)',
        explanation: 'Recursion call stack memory is proportional to maximum path depth (worst case O(V)).',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where DFS powers algorithms:',
        examples: [
          { title: 'Topological Sorting & Build Systems', detail: 'Schedules compilation tasks respecting prerequisites in build tools like Webpack and Make.' },
          { title: 'Maze Solving & Path Finding', detail: 'Autonomous robotics finding exits in mazes using wall-following algorithms.' },
          { title: 'Garbage Collection Mark-and-Sweep', detail: 'JVM and V8 engines trace live memory objects reachable from roots using DFS.' },
        ],
      },
      quickCheck: {
        question: 'What data structure powers the standard recursive implementation of Depth-First Search?',
        options: ['Queue', 'Call Stack', 'Hash Set', 'Binary Heap'],
        correctIndex: 1,
        explanation: 'Recursive DFS implicitly utilizes the CPU Execution Call Stack to maintain state and backtrack.',
      },
    },
  },

  // Dijkstra's Algorithm
  dijkstra: {
    topicId: 'dijkstra',
    topicTitle: "Dijkstra's Algorithm",
    tagline: 'Single-source shortest path algorithm using greedy relaxation on non-negative weighted graphs.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          "Dijkstra's Algorithm is a greedy graph search algorithm that finds the shortest path between a starting source vertex and all other vertices in a weighted graph with non-negative edge weights.",
        points: [
          'Greedy Strategy: Always selects the unvisited vertex with the minimum tentative distance.',
          'Edge Relaxation: Updates neighbor distances if a shorter path via the current vertex is discovered.',
          'Requires non-negative edge weights (weights >= 0).',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Dijkstra guarantees the optimal shortest path in O((V + E) log V) time when using a Priority Queue / Min-Heap, powering modern GPS routing, network packet routing protocols (OSPF), and logistics.',
        points: [
          'Guaranteed optimal shortest paths from a single source.',
          'Widely implemented in mapping engines and network routing protocols.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Initializes dist[start] = 0 and all other dist[v] = ∞. In each iteration, extracts the unvisited vertex u with minimum dist[u], marks it settled, and relaxes all edges (u, v): if dist[u] + weight(u, v) < dist[v], updates dist[v] = dist[u] + weight(u, v).',
        code: 'dist[start] = 0;\npq.push(start, 0);\nwhile (!pq.empty()) {\n  u = pq.extractMin();\n  for (const [v, weight] of adj[u]) {\n    if (dist[u] + weight < dist[v]) {\n      dist[v] = dist[u] + weight;\n      pq.push(v, dist[v]);\n    }\n  }\n}',
        highlightBox: {
          label: 'Edge Relaxation Rule',
          text: 'Relaxation tests whether going through vertex u yields a shorter path to v: if (dist[u] + w < dist[v]) dist[v] = dist[u] + w.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Path Relaxation',
        description: 'Track how distances update from source A:',
        items: [
          { label: 'Source Node A', value: 'dist[A] = 0', note: 'Start node' },
          { label: 'Node C via (A, C, wt 2)', value: 'dist[C] = 2', note: 'Shortest path found' },
          { label: 'Node B via (A, C, B, wt 3)', value: 'dist[B] = 3', note: 'Relaxed from direct 4 to 3!' },
          { label: 'Target Node F', value: 'dist[F] = 10', note: 'Optimal path: A->C->B->E->F' },
        ],
        breakdownNote: 'Nodes are permanently settled once extracted from the priority queue.',
      },
      operations: [
        { name: 'Extract Min Vertex', description: 'Extract vertex with smallest distance from priority queue.', bestCase: 'O(log V)', worstCase: 'O(log V)', note: 'Binary heap extraction.' },
        { name: 'Relax Edge', description: 'Check and update neighbor distance if path through u is shorter.', bestCase: 'O(1)', worstCase: 'O(log V)', note: 'Heap decrease-key.' },
      ],
      timeComplexity: [
        { operation: 'Shortest Path Tree', best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', reason: 'Each vertex extracted once; each edge relaxed once' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(V)',
        explanation: 'Distance table, predecessor map, and Priority Queue store at most V vertices.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where Dijkstra runs in real-world infrastructure:',
        examples: [
          { title: 'Google Maps / Waze Directions', detail: 'Finds optimal turn-by-turn routes with road travel times as weights.' },
          { title: 'OSPF & IS-IS Internet Routing', detail: 'Interior gateway protocols compute shortest path packet forwarding across routers.' },
          { title: 'Flight Ticket Connections', detail: 'Identifies cheapest flight route combinations across global airports.' },
        ],
      },
      quickCheck: {
        question: "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
        options: ['It causes infinite loops in unweighted graphs', 'It assumes once a node is visited, its shortest distance is final and cannot decrease further', 'It cannot calculate adjacency matrices', 'Priority queues only store strings'],
        correctIndex: 1,
        explanation: 'Dijkstra assumes a settled node already has its shortest distance; negative weights can violate this greedy invariant (Bellman-Ford is needed for negative weights).',
      },
    },
  },

  // Prim's Algorithm
  prims: {
    topicId: 'prims',
    topicTitle: "Prim's Algorithm",
    tagline: 'Greedy Minimum Spanning Tree (MST) algorithm growing a tree by picking minimum cut edges.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          "Prim's Algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a weighted undirected graph. An MST is a subset of edges that connects all vertices together without cycles and with the minimum possible total edge weight.",
        points: [
          'Grows a single tree from an arbitrary starting vertex.',
          'Cut Property: At each step, selects the minimum-weight edge connecting the tree to an outside vertex.',
          'Produces a connected spanning tree of V vertices using exactly V - 1 edges.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Prim is highly efficient for dense graphs (running in O(V² ) or O((V + E) log V) with heaps), making it ideal for laying telecommunications fiber, electrical grids, and pipeline networks at minimal cost.',
        points: [
          'Guarantees optimal minimum total cost spanning tree.',
          'Ideal for networks where connection cost must be minimized.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Starts with an empty tree and adds a starting vertex. At each step, evaluates all edges crossing from vertices already in the tree to vertices outside the tree (the cut), and greedily chooses the one with the smallest weight until all vertices are in the tree.',
        code: 'inMST.add(start);\nwhile (inMST.size < V) {\n  [u, v, weight] = getMinCutEdge(inMST);\n  mst.addEdge(u, v);\n  inMST.add(v);\n  totalCost += weight;\n}',
        highlightBox: {
          label: 'The Cut Property',
          text: 'For any cut in a connected graph, the minimum-weight edge crossing the cut belongs to every Minimum Spanning Tree of the graph.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Tree Expansion',
        description: 'Watch the tree grow from vertex A:',
        items: [
          { label: 'Step 1: Start at A', value: 'inMST = {A}', note: 'Cut edges: (A-C: 2), (A-B: 4)' },
          { label: 'Step 2: Pick (A, C, 2)', value: 'inMST = {A, C}', note: 'Minimum cut edge added' },
          { label: 'Step 3: Pick (B, C, 1)', value: 'inMST = {A, B, C}', note: 'Added B to tree' },
          { label: 'Step 4: Pick (B, E, 3)', value: 'inMST = {A, B, C, E}', note: 'Added E to tree' },
        ],
        breakdownNote: 'Vertices inside the tree never get disconnected; the tree simply grows outward.',
      },
      operations: [
        { name: 'Find Min Cut Edge', description: 'Extract smallest edge crossing the cut from priority queue.', bestCase: 'O(log V)', worstCase: 'O(log V)', note: 'Greedy choice.' },
        { name: 'Add to MST', description: 'Include edge and newly discovered vertex into tree.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Set insertion.' },
      ],
      timeComplexity: [
        { operation: 'MST Construction', best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', reason: 'Priority queue maintains min cut edge across V vertices' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(V + E)',
        explanation: 'Maintains priority queue of candidate cut edges and adjacency list in memory.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where Minimum Spanning Trees solve real engineering challenges:',
        examples: [
          { title: 'Electrical Power Grid Laying', detail: 'Connects electrical substations with minimal cabling length.' },
          { title: 'Telecommunications Fiber Optics', detail: 'Connects cities in broadband fiber optic network at lowest infrastructure cost.' },
          { title: 'Cluster Analysis & Machine Learning', detail: 'Single-linkage hierarchical clustering builds MSTs on feature distance graphs.' },
        ],
      },
      quickCheck: {
        question: 'How many edges does a Minimum Spanning Tree have in a connected graph with V vertices?',
        options: ['V', 'V - 1', 'V + 1', 'V * (V - 1) / 2'],
        correctIndex: 1,
        explanation: 'Any spanning tree connecting V vertices without cycles must contain exactly V - 1 edges.',
      },
    },
  },

  // Kruskal's Algorithm
  kruskals: {
    topicId: 'kruskals',
    topicTitle: "Kruskal's Algorithm",
    tagline: 'Greedy MST algorithm sorting edges globally and preventing cycles via Disjoint Set Union (Union-Find).',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          "Kruskal's Algorithm is a greedy Minimum Spanning Tree (MST) algorithm that sorts all edges in non-decreasing order of weight and adds them one by one to the spanning forest, provided they do not form a cycle.",
        points: [
          'Edge-Centric: Considers edges globally in sorted order of weight.',
          'Disjoint Set Union (DSU): Uses Union-Find with path compression to detect cycles in near O(1) time.',
          'Produces an optimal Minimum Spanning Tree of total weight matching Prim.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Kruskal is especially efficient on sparse graphs (running in O(E log E) time due to initial sorting). Unlike Prim, it does not need a connected graph to start and works naturally on disconnected components (generating Minimum Spanning Forests).',
        points: [
          'Optimal for sparse networks with fewer edges.',
          'Simple conceptually: Sort edges, greedily pick unless cycle is formed.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          '1) Sort all edges by weight ascending. 2) Initialize each vertex in its own disjoint set. 3) For each edge (u, v): check if find(u) == find(v). If different, accept edge and union(u, v); if same, discard edge (would create a cycle). 4) Stop when V - 1 edges are accepted.',
        code: 'edges.sort((a, b) => a.weight - b.weight);\nfor (const e of edges) {\n  if (find(e.u) !== find(e.v)) {\n    union(e.u, e.v);\n    mst.push(e);\n    totalWeight += e.weight;\n    if (mst.length === V - 1) break;\n  }\n}',
        highlightBox: {
          label: 'Cycle Detection with DSU',
          text: 'If find(u) == find(v), u and v already belong to the same connected component. Adding edge (u, v) would complete a cycle and is skipped!',
        },
      },
      visualExample: {
        title: '4. Visual Example: Edge Sorting & Selection',
        description: 'Inspect sorted edges and selection decisions:',
        items: [
          { label: 'Edge (B-C, wt 1)', value: 'ACCEPTED', note: 'Union components {B} and {C}' },
          { label: 'Edge (A-C, wt 2)', value: 'ACCEPTED', note: 'Union components {A} and {B, C}' },
          { label: 'Edge (D-E, wt 2)', value: 'ACCEPTED', note: 'Union components {D} and {E}' },
          { label: 'Edge (A-B, wt 4)', value: 'CYCLE REJECTED', note: 'Both A and B already in {A, B, C}! Skipped.' },
        ],
        breakdownNote: 'Cycle rejection prevents loops while greedily picking the lightest available edges.',
      },
      operations: [
        { name: 'Sort Edges', description: 'Sort all E edges in non-decreasing order of weight.', bestCase: 'O(E log E)', worstCase: 'O(E log E)', note: 'Comparison sort.' },
        { name: 'Find / Union', description: 'Query component and merge sets with path compression.', bestCase: 'O(α(V))', worstCase: 'O(α(V))', note: 'Nearly O(1) inverse Ackermann.' },
      ],
      timeComplexity: [
        { operation: 'Total MST Time', best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', reason: 'Dominated by initial sorting of E edges' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(V + E)',
        explanation: 'Stores edge list of size E and DSU parent array of size V.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Practical applications of Kruskal’s MST algorithm:',
        examples: [
          { title: 'LAN Network Wiring (STP Protocol)', detail: 'Spanning Tree Protocol in Ethernet switches disables redundant paths to avoid broadcast loops.' },
          { title: 'Water & Gas Pipeline Layout', detail: 'Connects municipal water supplies across neighborhoods at minimum trenching cost.' },
          { title: 'Image Segmentation in Computer Vision', detail: 'Graph-based image segmentation treats pixels as vertices and edge weights as color similarity.' },
        ],
      },
      quickCheck: {
        question: 'What data structure enables Kruskal’s algorithm to detect cycles efficiently?',
        options: ['Binary Search Tree', 'Disjoint Set Union (Union-Find)', 'FIFO Queue', 'Adjacency Matrix'],
        correctIndex: 1,
        explanation: 'Union-Find (DSU) maintains connected components and detects whether two vertices are already connected in nearly O(1) time.',
      },
    },
  },

  // 16. Linear Search
  'linear-search': {
    topicId: 'linear-search',
    topicTitle: 'Linear Search',
    tagline: 'Simple sequential scan: inspects each item one by one from start to finish.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Linear Search is the most straightforward search algorithm. It sequentially checks every element in a collection starting from the very first item until a match is found or the end of the collection is reached.',
        points: [
          'No sorting required: Operates seamlessly on completely unsorted data.',
          'Sequential: Inspects index 0, 1, 2, ... n - 1.',
          'Best case O(1) if target is at index 0; worst case O(n).',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'For small collections (e.g. fewer than 20 items) or unsorted lists where sorting overhead would exceed search time, linear search is the simplest and fastest approach.',
        points: [
          'Zero setup or pre-sorting cost.',
          'Works on any iterable data structure (arrays, linked lists, streams).',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'A simple for-loop iterates through the indices. If arr[i] === target, return i. If loop completes, return -1.',
        code: 'for (let i = 0; i < arr.length; i++) {\n  if (arr[i] === target) return i;\n}\nreturn -1;',
        highlightBox: {
          label: 'Cache Advantage on Small Data',
          text: 'Because contiguous array memory prefetches into CPU caches, linear search on 10 integers is faster in raw nanoseconds than a complex binary search branch pipeline!',
        },
      },
      visualExample: {
        title: '4. Visual Example: Sequential Pointer Scanning',
        description: 'Scanning for target 42 across unsorted numbers:',
        items: [
          { label: 'Index [0]', value: 14, note: '14 != 42 (Advance pointer)' },
          { label: 'Index [1]', value: 87, note: '87 != 42 (Advance pointer)' },
          { label: 'Index [2]', value: 42, note: 'MATCH FOUND! Return index 2' },
          { label: 'Index [3]', value: 59, note: 'Not inspected (early exit)' },
        ],
        breakdownNote: 'Number of comparisons equals target position + 1.',
      },
      operations: [
        { name: 'Search', description: 'Scan items in order.', bestCase: 'O(1)', worstCase: 'O(n)', note: 'O(n/2) average comparisons.' },
      ],
      timeComplexity: [
        { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', reason: 'Target might be at start, middle, end, or absent' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(1)',
        explanation: 'Uses a single integer loop counter. Zero auxiliary memory.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Everyday linear scans:',
        examples: [
          { title: 'Finding your keys on a desk', detail: 'Scanning a small collection of unsorted items visually one by one.' },
          { title: 'JavaScript Array.prototype.indexOf()', detail: 'Standard linear scan across generic array elements.' },
        ],
      },
      quickCheck: {
        question: 'What is the worst-case number of comparisons in a linear search on an array of 100 elements?',
        options: ['1', '7', '50', '100'],
        correctIndex: 3,
        explanation: 'In the worst case (item is at the very last index or not present), linear search inspects all 100 elements.',
      },
    },
  },

  // 17. Binary Search
  'binary-search': {
    topicId: 'binary-search',
    topicTitle: 'Binary Search',
    tagline: 'Divide & conquer on sorted arrays: halves the search space at every single step in O(log n) time.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Binary Search is an ultra-fast search algorithm that finds the position of a target value within a sorted array. It repeatedly compares the target with the middle element, eliminating half of the search interval in every step.',
        points: [
          'Requirement: Array MUST be sorted in monotonic order.',
          'Divide and Conquer: Cuts search space in half each iteration.',
          'Blazing speed: Can search 4 billion items in only 32 comparisons!',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Logarithmic scaling means doubling the data size only adds a single comparison. It is the gold standard for searching sorted collections.',
        points: [
          'O(log n) worst-case time complexity.',
          'Minimal comparisons on large-scale datasets.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Maintains low and high pointers. Computes mid = low + (high - low) / 2. If arr[mid] == target, done! If target < arr[mid], discard right half (high = mid - 1); else discard left half (low = mid + 1).',
        code: 'let low = 0, high = arr.length - 1;\nwhile (low <= high) {\n  let mid = Math.floor((low + high) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) low = mid + 1;\n  else high = mid - 1;\n}\nreturn -1;',
        highlightBox: {
          label: 'Avoid Integer Overflow',
          text: 'In languages like Java and C++, compute `mid = low + (high - low) / 2` instead of `(low + high) / 2` to avoid 32-bit integer arithmetic overflow!',
        },
      },
      visualExample: {
        title: '4. Visual Example: Halving the Sorted Interval',
        description: 'Searching for 42 in a sorted array [4, 12, 19, 27, 35, 42, 58, 63, 74, 88]:',
        items: [
          { label: 'Step 1: Mid [4]', value: 35, note: '35 < 42 -> Target is in right half [5..9]' },
          { label: 'Step 2: Mid [7]', value: 63, note: '63 > 42 -> Target is in left half [5..6]' },
          { label: 'Step 3: Mid [5]', value: 42, note: 'MATCH FOUND! Target 42 at index 5 in only 3 steps!' },
        ],
        breakdownNote: 'Logarithmic efficiency: log₂(1000) ≈ 10 comparisons, log₂(1,000,000) ≈ 20 comparisons.',
      },
      operations: [
        { name: 'Binary Search', description: 'Halve search range repeatedly.', bestCase: 'O(1)', worstCase: 'O(log n)', note: 'Requires sorted input.' },
      ],
      timeComplexity: [
        { operation: 'Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', reason: 'Search space N is divided by 2 at every step: N/2^k = 1 -> k = log₂(N)' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(1)',
        explanation: 'Iterative implementation uses only 3 pointers (low, mid, high).',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Where Binary Search powers software:',
        examples: [
          { title: 'Git Bisect Bug Tracking', detail: 'Performs binary search across commit history to isolate the exact commit that introduced a bug.' },
          { title: 'Database B+ Tree Index Lookups', detail: 'Searches sorted index keys to locate physical record block addresses.' },
          { title: 'Looking up a word in a paper dictionary', detail: 'Opening to the middle and flipping forward or backward.' },
        ],
      },
      quickCheck: {
        question: 'What is the maximum number of comparisons binary search needs to find an element in a sorted array of 1,024 elements?',
        options: ['10', '100', '512', '1,024'],
        correctIndex: 0,
        explanation: 'log₂(1024) = 10. In at most 10 comparisons, binary search resolves any element in a 1,024-item sorted array.',
      },
    },
  },

  // 18. Recursion
  recursion: {
    topicId: 'recursion',
    topicTitle: 'Recursion',
    tagline: 'Self-referential problem solving: functions calling themselves with base cases via Call Stack.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Recursion is a programming technique where a function solves a problem by calling a smaller instance of itself. Every recursive solution requires two critical components: a Base Case (which halts recursion) and a Recursive Step (which reduces the problem size).',
        points: [
          'Base Case: The stopping condition preventing infinite loops.',
          'Recursive Call: The function invokes itself with smaller parameters.',
          'Call Stack: Each call pushes a new execution stack frame into memory.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Naturally mirrors problems with self-similar structures like tree traversals, divide-and-conquer algorithms (MergeSort/QuickSort), and combinatorial permutations.',
        points: [
          'Elegant, concise code for nested hierarchical structures.',
          'Simplifies complex branching logic without deeply nested manual loops.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Calls pile up on the call stack until reaching the base case, then unwind in reverse order returning intermediate values.',
        code: 'function factorial(n) {\n  if (n <= 1) return 1; // Base case\n  return n * factorial(n - 1); // Recursive call\n}',
        highlightBox: {
          label: 'Stack Overflow Error',
          text: 'If a recursive function lacks a valid base case, or exceeds maximum call stack depth (typically 10,000 frames in V8), it crashes with a StackOverflowException.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Call Stack Push and Unwind',
        description: 'Calculating factorial(4):',
        items: [
          { label: 'fact(4)', value: '4 * fact(3)', note: 'Waits for fact(3) = 6 -> returns 24' },
          { label: 'fact(3)', value: '3 * fact(2)', note: 'Waits for fact(2) = 2 -> returns 6' },
          { label: 'fact(2)', value: '2 * fact(1)', note: 'Waits for fact(1) = 1 -> returns 2' },
          { label: 'fact(1)', value: '1 (BASE CASE)', note: 'Halts recursion! Unwinds stack upward' },
        ],
        breakdownNote: 'Pushes frames downward to base case, then unwinds upward multiplying results: 1 -> 2 -> 6 -> 24.',
      },
      operations: [
        { name: 'Recursive Call', description: 'Push stack frame with subproblem.', bestCase: 'O(1)', worstCase: 'Varies', note: 'Stack memory allocation.' },
      ],
      timeComplexity: [
        { operation: 'Linear Recursion (e.g. factorial)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'N total stack frames executed' },
        { operation: 'Binary Tree Traversal', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'Visits each node in tree once' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(depth)',
        explanation: 'Memory is proportional to maximum stack depth of recursive call chain.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Core applications of recursion:',
        examples: [
          { title: 'DOM Tree Rendering & React Reconciler', detail: 'React recursively renders nested component hierarchies into the virtual DOM.' },
          { title: 'JSON / XML Serialization & Parsing', detail: 'Recursively parses nested arrays and objects within arbitrary data structures.' },
          { title: 'MergeSort & QuickSort', detail: 'Divides arrays into halves recursively until sub-arrays of size 1 are sorted.' },
        ],
      },
      quickCheck: {
        question: 'What happens if a recursive function does not define a valid base case?',
        options: [
          'It runs in O(1) time',
          'It returns 0 automatically',
          'It triggers a Stack Overflow crash due to infinite recursion',
          'It converts into a while loop',
        ],
        correctIndex: 2,
        explanation: 'Without a base case to halt recursion, calls push onto the call stack continuously until available memory is exhausted, throwing a Stack Overflow error.',
      },
    },
  },

  // 19. Greedy Algorithms
  'greedy-algorithms': {
    topicId: 'greedy-algorithms',
    topicTitle: 'Greedy Algorithms',
    tagline: 'Making the locally optimal choice at each step with the goal of reaching a global optimum.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'A Greedy Algorithm builds up a solution piece by piece, always choosing the immediate next piece that offers the most obvious and immediate benefit (locally optimal choice) without ever reconsidering past decisions.',
        points: [
          'Greedy-choice property: A global optimum can be arrived at by making locally optimal decisions.',
          'Optimal substructure: An optimal solution to the problem contains optimal solutions to subproblems.',
          'No backtracking: Decisions once made are never revoked.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Greedy algorithms are straightforward, intuitive, and remarkably fast (typically O(n) or O(n log n)), avoiding the expensive combinatorial exploration of dynamic programming or backtracking.',
        points: [
          'Extremely fast execution with simple heuristics.',
          'Solves classic problems like Kruskal’s MST, Prim’s MST, and Huffman Coding.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Sorts candidates by an evaluation metric, then iterates through them selecting valid elements greedily.',
        code: '// Coin Change Problem (Standard denominations)\nfor (let coin of [25, 10, 5, 1]) {\n  while (amount >= coin) {\n    amount -= coin;\n    coins.push(coin);\n  }\n}',
        highlightBox: {
          label: 'Caution: Greedy Does Not Always Work!',
          text: 'If coin denominations are [1, 3, 4] and target is 6, greedy picks 4 + 1 + 1 (3 coins), but the true global optimum is 3 + 3 (2 coins)! Verify greedy choice property first.',
        },
      },
      visualExample: {
        title: '4. Visual Example: Greedy Coin Change (68¢)',
        description: 'Greedily picking largest denomination at every step:',
        items: [
          { label: 'Step 1 (25¢)', value: 'Pick Quarter', note: 'Remaining: 68 - 25 = 43¢' },
          { label: 'Step 2 (25¢)', value: 'Pick Quarter', note: 'Remaining: 43 - 25 = 18¢' },
          { label: 'Step 3 (10¢)', value: 'Pick Dime', note: 'Remaining: 18 - 10 = 8¢' },
          { label: 'Step 4 (5¢)', value: 'Pick Nickel', note: 'Remaining: 8 - 5 = 3¢' },
          { label: 'Step 5 (1¢ x3)', value: 'Pick 3 Pennies', note: 'Remaining: 0¢! 7 total coins.' },
        ],
        breakdownNote: 'Locally optimal choice of largest coin at each step delivers minimum coin count.',
      },
      operations: [
        { name: 'Greedy Selection', description: 'Pick top candidate.', bestCase: 'O(1)', worstCase: 'O(n log n)', note: 'Dominated by initial sorting.' },
      ],
      timeComplexity: [
        { operation: 'Greedy Algorithm', best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', reason: 'Typically requires sorting candidates first' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(1) to O(n)',
        explanation: 'Requires minimal extra space to store the selected items.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Industry-standard greedy algorithms:',
        examples: [
          { title: 'Huffman Data Compression (ZIP / JPEG)', detail: 'Greedily merges lowest frequency character nodes to construct optimal prefix compression trees.' },
          { title: "Dijkstra's Shortest Path", detail: 'Greedily selects the unvisited vertex with shortest tentative distance.' },
          { title: "Kruskal's Minimum Spanning Tree", detail: 'Greedily selects lowest weight edges that do not form a cycle.' },
        ],
      },
      quickCheck: {
        question: 'What is the defining characteristic of a Greedy Algorithm?',
        options: [
          'It explores all possible combinations exhaustively',
          'It always makes the locally optimal choice at each step without backtracking',
          'It uses memoization to cache subproblem results',
          'It randomly guesses candidate answers',
        ],
        correctIndex: 1,
        explanation: 'A greedy algorithm makes the immediate best local choice at each stage with the expectation that it leads to a globally optimal solution.',
      },
    },
  },

  // 20. Dynamic Programming
  'dynamic-programming': {
    topicId: 'dynamic-programming',
    topicTitle: 'Dynamic Programming (DP)',
    tagline: 'Optimization strategy: solves overlapping subproblems once and memoizes results to defeat exponential time.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Dynamic Programming (DP) is an algorithmic paradigm that solves complex optimization problems by breaking them down into simpler overlapping subproblems, computing each subproblem solution once, and storing (memoizing) results in a table.',
        points: [
          'Overlapping Subproblems: The same subproblems are solved repeatedly in naive recursion.',
          'Optimal Substructure: Optimal solution to problem is built from optimal subproblem solutions.',
          'Two Flavors: Top-Down (Memoization) and Bottom-Up (Tabulation).',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Turns catastrophic exponential O(2^n) brute force algorithms into polynomial O(n) or O(n * W) linear algorithms by eliminating redundant computations.',
        points: [
          'Transforms O(2^n) Fibonacci calculation into O(n) linear time.',
          'Powers knapsack optimization, sequence alignment, and graph shortest paths.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Identify the recurrence relation (state transition formula), initialize base cases in a DP array, and iteratively compute values.',
        code: '// Fibonacci Bottom-Up Tabulation\nconst dp = [0, 1];\nfor (let i = 2; i <= n; i++) {\n  dp[i] = dp[i - 1] + dp[i - 2];\n}\nreturn dp[n];',
        highlightBox: {
          label: 'Memoization vs Tabulation',
          text: 'Memoization is recursive and fills cache on demand (Top-Down). Tabulation is iterative and populates table from base cases up (Bottom-Up, cache friendly).',
        },
      },
      visualExample: {
        title: '4. Visual Example: Fibonacci DP Table State',
        description: 'Bottom-up computation of Fibonacci(5):',
        items: [
          { label: 'dp[0]', value: 0, note: 'Base Case' },
          { label: 'dp[1]', value: 1, note: 'Base Case' },
          { label: 'dp[2]', value: 1, note: 'dp[1] + dp[0] = 1 + 0 = 1' },
          { label: 'dp[3]', value: 2, note: 'dp[2] + dp[1] = 1 + 1 = 2' },
          { label: 'dp[4]', value: 3, note: 'dp[3] + dp[2] = 2 + 1 = 3' },
          { label: 'dp[5]', value: 5, note: 'dp[4] + dp[3] = 3 + 2 = 5 (Target Result!)' },
        ],
        breakdownNote: 'Every step uses previously cached values in O(1) time instead of recomputing branch trees.',
      },
      operations: [
        { name: 'State Transition', description: 'Compute dp[i] from subproblems.', bestCase: 'O(1)', worstCase: 'O(1)', note: 'Constant time table lookup.' },
      ],
      timeComplexity: [
        { operation: 'Fibonacci (Naive)', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)', reason: 'Exponential branching tree' },
        { operation: 'Fibonacci (DP)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', reason: 'Computes each state once' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n) or O(1)',
        explanation: 'Table size proportional to number of states (can be optimized to O(1) if keeping only last 2 variables).',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'High-impact dynamic programming applications:',
        examples: [
          { title: 'Diff Tools & Git Merge (Longest Common Subsequence)', detail: 'Git diff uses LCS dynamic programming to identify added and deleted lines.' },
          { title: 'DNA Genome Sequence Alignment', detail: 'Needleman-Wunsch DP aligns genetic sequences in bioinformatics.' },
          { title: 'Text Justification in Word Processors', detail: 'Typesetting engines (LaTeX) break paragraphs into lines with minimal whitespace penalty.' },
        ],
      },
      quickCheck: {
        question: 'What are the two key properties a problem must satisfy to be solvable with Dynamic Programming?',
        options: [
          'Greedy choice and sorted data',
          'Overlapping subproblems and optimal substructure',
          'Binary branching and leaf termination',
          'Contiguous memory and fixed capacity',
        ],
        correctIndex: 1,
        explanation: 'Dynamic Programming applies strictly when problems feature Overlapping Subproblems (so caching avoids duplicate work) and Optimal Substructure (optimal answers build from optimal sub-answers).',
      },
    },
  },

  // 21. Backtracking
  backtracking: {
    topicId: 'backtracking',
    topicTitle: 'Backtracking',
    tagline: 'Systematic depth-first candidate search pruning branches that fail constraints.',
    sections: {
      whatIsIt: {
        title: '1. What is it?',
        content:
          'Backtracking is a systematic algorithmic technique for solving constraint satisfaction problems. It incrementally builds candidate solutions, and abandons ("backtracks") a candidate as soon as it determines the candidate cannot lead to a valid solution.',
        points: [
          'Trial and Error: Explores choices recursively.',
          'Constraint Pruning: Immediately stops and retreats when a rule is violated.',
          'State restoration: Undoes mutations so the next choice starts with a clean board.',
        ],
      },
      whyUsed: {
        title: '2. Why is it used?',
        content:
          'Instead of brute-forcing billions of impossible permutations, backtracking prunes huge dead branches early, drastically accelerating puzzle solvers and combinatorial search.',
        points: [
          'Solves N-Queens, Sudoku, Subset Sum, and Knight’s Tour.',
          'Significantly faster than raw brute-force permutation testing.',
        ],
      },
      howItWorks: {
        title: '3. How does it work?',
        content:
          'Choose -> Explore -> Unchoose pattern: make a tentative move, recurse. If downstream calls fail, undo the move and try the next alternative.',
        code: 'function solve(row) {\n  if (row === N) return true; // Solved\n  for (let col = 0; col < N; col++) {\n    if (isValid(row, col)) {\n      placeQueen(row, col); // Choose\n      if (solve(row + 1)) return true; // Explore\n      removeQueen(row, col); // Unchoose (Backtrack)\n    }\n  }\n  return false;\n}',
        highlightBox: {
          label: 'Pruning Power',
          text: 'In 8-Queens, brute force checks 16,777,216 placements. Backtracking constraint pruning checks only 2,057 states to find all 92 valid solutions!',
        },
      },
      visualExample: {
        title: '4. Visual Example: 4-Queens Backtracking Progress',
        description: 'Placing non-attacking queens on a 4x4 board:',
        items: [
          { label: 'Row 0', value: 'Queen at (0, 1)', note: 'Valid placement' },
          { label: 'Row 1', value: 'Queen at (1, 3)', note: 'Valid placement' },
          { label: 'Row 2', value: 'Queen at (2, 0)', note: 'Valid placement' },
          { label: 'Row 3', value: 'Queen at (3, 2)', note: 'Solution found! No queens attack.' },
        ],
        breakdownNote: 'If a row has no valid columns, the algorithm rewinds to previous row, shifting that queen to the next available column.',
      },
      operations: [
        { name: 'Backtrack Search', description: 'Recursive candidate search with pruning.', bestCase: 'O(1)', worstCase: 'O(n!)', note: 'Pruning skips invalid branches.' },
      ],
      timeComplexity: [
        { operation: 'Backtracking', best: 'O(1)', average: 'Varies', worst: 'O(2^n) or O(n!)', reason: 'Worst case explores factorial permutation space' },
      ],
      spaceComplexity: {
        title: '7. Space Complexity',
        complexity: 'O(n)',
        explanation: 'Call stack and board state occupy memory proportional to board dimension or recursion depth.',
      },
      realWorldExample: {
        title: '8. Real-world Examples',
        description: 'Real applications of backtracking:',
        examples: [
          { title: 'Sudoku & Crossword Puzzle Solvers', detail: 'Fills valid numbers/letters; backtracks immediately upon rule conflict.' },
          { title: 'Printed Circuit Board (PCB) Wire Routing', detail: 'Routes electrical traces on chips; backtracks if traces cross or conflict.' },
          { title: 'Regex Pattern Matching Engines', detail: 'Matches text patterns with wildcards; backtracks when sub-patterns mismatch.' },
        ],
      },
      quickCheck: {
        question: 'What is the core action in the "Choose -> Explore -> Unchoose" backtracking pattern when a candidate path fails?',
        options: [
          'Re-start from scratch',
          'Unchoose (undo the tentative move and restore previous state)',
          'Throw an exception',
          'Sort the array',
        ],
        correctIndex: 1,
        explanation: 'When a candidate branch fails constraint checks, backtracking "unchooses" (reverts the move) and proceeds to try the next alternate candidate.',
      },
    },
  },
};
