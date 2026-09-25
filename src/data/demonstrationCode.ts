// Real-world, standard Java and C++ implementations with synchronized step line mappings
export interface CodeSnippet {
  code: string;
  // 1-based line numbers to highlight at each step
  lineMapping: number[];
  // Key variable names / watch points for this algorithm
  watchVars?: string[];
}

export interface TopicCodeEntry {
  title: string;
  java: CodeSnippet;
  cpp: CodeSnippet;
}

// Map from "topicId:operation" or "topicId" to TopicCodeEntry
export const CODE_REGISTRY: Record<string, TopicCodeEntry> = {
  // ==========================================
  // 1. ARRAY
  // ==========================================
  'array:insert': {
    title: 'Array Insertion at Index',
    java: {
      code: `public void insert(int[] arr, int size, int index, int value) {
    if (index < 0 || index > size) {
        throw new IndexOutOfBoundsException();
    }
    // Shift elements to the right to make room
    for (int i = size - 1; i >= index; i--) {
        arr[i + 1] = arr[i]; // Memory shift
    }
    // Place new value at target index
    arr[index] = value;
    size++; // Update capacity/size
}`,
      lineMapping: [1, 2, 6, 7, 6, 7, 10, 11],
      watchVars: ['index', 'value', 'size', 'i'],
    },
    cpp: {
      code: `void insert(std::vector<int>& arr, int index, int value) {
    if (index < 0 || index > arr.size()) {
        throw std::out_of_range("Invalid index");
    }
    // Shift elements to right
    arr.push_back(0); // expand size
    for (int i = arr.size() - 2; i >= index; i--) {
        arr[i + 1] = arr[i];
    }
    arr[index] = value; // Assign value
}`,
      lineMapping: [1, 2, 6, 7, 8, 7, 8, 10],
      watchVars: ['index', 'value', 'i'],
    },
  },

  'array:delete': {
    title: 'Array Deletion at Index',
    java: {
      code: `public int delete(int[] arr, int size, int index) {
    if (index < 0 || index >= size) {
        throw new IndexOutOfBoundsException();
    }
    int removed = arr[index];
    // Shift elements left to fill vacancy
    for (int i = index; i < size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    size--;
    return removed;
}`,
      lineMapping: [1, 5, 7, 8, 7, 8, 10, 11],
      watchVars: ['index', 'removed', 'i', 'size'],
    },
    cpp: {
      code: `int deleteAt(std::vector<int>& arr, int index) {
    if (index < 0 || index >= arr.size()) {
        throw std::out_of_range("Invalid index");
    }
    int removed = arr[index];
    // Shift elements left
    for (size_t i = index; i < arr.size() - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr.pop_back(); // reduce size
    return removed;
}`,
      lineMapping: [1, 5, 7, 8, 7, 8, 10, 11],
      watchVars: ['index', 'removed', 'i'],
    },
  },

  'array:search': {
    title: 'Array Linear Search',
    java: {
      code: `public int search(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        // Inspect current array element
        if (arr[i] == target) {
            return i; // Target found!
        }
    }
    return -1; // Not present
}`,
      lineMapping: [1, 2, 4, 2, 4, 5, 8],
      watchVars: ['target', 'i', 'arr[i]'],
    },
    cpp: {
      code: `int search(const std::vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        // Inspect current element
        if (arr[i] == target) {
            return i; // Target found!
        }
    }
    return -1; // Not found
}`,
      lineMapping: [1, 2, 4, 2, 4, 5, 8],
      watchVars: ['target', 'i', 'arr[i]'],
    },
  },

  'array:traverse': {
    title: 'Array Traversal',
    java: {
      code: `public void traverse(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        System.out.print(arr[i] + " ");
    }
}`,
      lineMapping: [1, 2, 3, 2, 3, 4],
      watchVars: ['i', 'arr[i]'],
    },
    cpp: {
      code: `void traverse(const std::vector<int>& arr) {
    for (size_t i = 0; i < arr.size(); i++) {
        std::cout << arr[i] << " ";
    }
}`,
      lineMapping: [1, 2, 3, 2, 3, 4],
      watchVars: ['i', 'arr[i]'],
    },
  },

  // ==========================================
  // 2. LINKED LIST (SINGLY & DOUBLY)
  // ==========================================
  'linked-list:insert': {
    title: 'Linked List Node Insertion',
    java: {
      code: `public void insertHead(int val) {
    // 1. Allocate new Node in Heap
    Node newNode = new Node(val);
    // 2. Point newNode.next to current head
    newNode.next = head;
    // 3. Move head pointer to newNode
    head = newNode;
    size++;
}`,
      lineMapping: [1, 3, 5, 7, 8],
      watchVars: ['val', 'newNode', 'head'],
    },
    cpp: {
      code: `void insertHead(int val) {
    // 1. Allocate new Node on Heap
    Node* newNode = new Node(val);
    // 2. Link newNode->next to head
    newNode->next = head;
    // 3. Update head to point to newNode
    head = newNode;
    size++;
}`,
      lineMapping: [1, 3, 5, 7, 8],
      watchVars: ['val', 'newNode', 'head'],
    },
  },

  'linked-list:delete': {
    title: 'Linked List Node Deletion',
    java: {
      code: `public void deleteHead() {
    if (head == null) return;
    Node temp = head; // store node to remove
    head = head.next; // bypass head node
    temp.next = null; // isolate node
    size--;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6],
      watchVars: ['head', 'temp'],
    },
    cpp: {
      code: `void deleteHead() {
    if (!head) return;
    Node* temp = head;
    head = head->next; // advance head pointer
    delete temp;       // free heap memory
    size--;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6],
      watchVars: ['head', 'temp'],
    },
  },

  'linked-list:search': {
    title: 'Linked List Traversal Search',
    java: {
      code: `public boolean search(int target) {
    Node curr = head;
    while (curr != null) {
        if (curr.val == target) return true;
        curr = curr.next; // traverse forward
    }
    return false;
}`,
      lineMapping: [1, 2, 3, 4, 5, 3, 7],
      watchVars: ['target', 'curr', 'curr.val'],
    },
    cpp: {
      code: `bool search(int target) {
    Node* curr = head;
    while (curr != nullptr) {
        if (curr->val == target) return true;
        curr = curr->next; // advance pointer
    }
    return false;
}`,
      lineMapping: [1, 2, 3, 4, 5, 3, 7],
      watchVars: ['target', 'curr', 'curr->val'],
    },
  },

  'linked-list:reverse': {
    title: 'Reverse Linked List',
    java: {
      code: `public Node reverse(Node head) {
    Node prev = null;
    Node curr = head;
    while (curr != null) {
        Node nextTemp = curr.next; // store next
        curr.next = prev;          // reverse link
        prev = curr;               // advance prev
        curr = nextTemp;           // advance curr
    }
    return prev; // new head
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 4, 10],
      watchVars: ['prev', 'curr', 'nextTemp'],
    },
    cpp: {
      code: `Node* reverse(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr != nullptr) {
        Node* nextTemp = curr->next;
        curr->next = prev; // reverse pointer
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 4, 10],
      watchVars: ['prev', 'curr', 'nextTemp'],
    },
  },

  // ==========================================
  // 3. STACK
  // ==========================================
  'stack:push': {
    title: 'Stack Push Operation',
    java: {
      code: `public void push(int x) {
    if (top >= capacity - 1) {
        throw new StackOverflowError();
    }
    top++;            // Increment top index
    arr[top] = x;     // Store element at TOP
}`,
      lineMapping: [1, 2, 5, 6],
      watchVars: ['x', 'top', 'arr[top]'],
    },
    cpp: {
      code: `void push(int x) {
    if (top >= capacity - 1) {
        throw std::overflow_error("Stack Overflow");
    }
    top++;
    arr[top] = x;
}`,
      lineMapping: [1, 2, 5, 6],
      watchVars: ['x', 'top', 'arr[top]'],
    },
  },

  'stack:pop': {
    title: 'Stack Pop Operation',
    java: {
      code: `public int pop() {
    if (isEmpty()) {
        throw new EmptyStackException();
    }
    int popped = arr[top]; // Retrieve TOP element
    top--;                 // Decrement top pointer
    return popped;
}`,
      lineMapping: [1, 2, 5, 6, 7],
      watchVars: ['top', 'popped'],
    },
    cpp: {
      code: `int pop() {
    if (top < 0) {
        throw std::underflow_error("Stack Underflow");
    }
    int popped = arr[top];
    top--;
    return popped;
}`,
      lineMapping: [1, 2, 5, 6, 7],
      watchVars: ['top', 'popped'],
    },
  },

  'stack:peek': {
    title: 'Stack Peek / Top Operation',
    java: {
      code: `public int peek() {
    if (isEmpty()) throw new EmptyStackException();
    return arr[top]; // O(1) direct top access
}`,
      lineMapping: [1, 2, 3],
      watchVars: ['top', 'arr[top]'],
    },
    cpp: {
      code: `int top() const {
    if (topIndex < 0) throw std::underflow_error("Empty");
    return arr[topIndex];
}`,
      lineMapping: [1, 2, 3],
      watchVars: ['topIndex'],
    },
  },

  // ==========================================
  // 4. QUEUE
  // ==========================================
  'queue:enqueue': {
    title: 'Queue Enqueue Operation',
    java: {
      code: `public void enqueue(int x) {
    if (isFull()) throw new IllegalStateException("Queue Full");
    rear = (rear + 1) % capacity;
    arr[rear] = x; // Place item at REAR
    size++;
}`,
      lineMapping: [1, 2, 3, 4, 5],
      watchVars: ['x', 'rear', 'size'],
    },
    cpp: {
      code: `void enqueue(int x) {
    if (isFull()) throw std::runtime_error("Queue Full");
    rear = (rear + 1) % capacity;
    arr[rear] = x;
    size++;
}`,
      lineMapping: [1, 2, 3, 4, 5],
      watchVars: ['x', 'rear', 'size'],
    },
  },

  'queue:dequeue': {
    title: 'Queue Dequeue Operation',
    java: {
      code: `public int dequeue() {
    if (isEmpty()) throw new NoSuchElementException();
    int item = arr[front];
    front = (front + 1) % capacity; // Advance FRONT
    size--;
    return item;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6],
      watchVars: ['front', 'item', 'size'],
    },
    cpp: {
      code: `int dequeue() {
    if (isEmpty()) throw std::runtime_error("Empty Queue");
    int item = arr[front];
    front = (front + 1) % capacity;
    size--;
    return item;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6],
      watchVars: ['front', 'item', 'size'],
    },
  },

  // ==========================================
  // 5. PRIORITY QUEUE
  // ==========================================
  'priority-queue:insert': {
    title: 'Priority Queue Insert (Heapify Up)',
    java: {
      code: `public void insert(int val) {
    heap.add(val);
    int i = heap.size() - 1;
    // Sift up to maintain Max-Heap property
    while (i > 0 && heap.get(parent(i)) < heap.get(i)) {
        swap(i, parent(i));
        i = parent(i);
    }
}`,
      lineMapping: [1, 2, 3, 5, 6, 7, 5],
      watchVars: ['val', 'i', 'parent(i)'],
    },
    cpp: {
      code: `void insert(int val) {
    heap.push_back(val);
    int i = heap.size() - 1;
    while (i > 0 && heap[parent(i)] < heap[i]) {
        std::swap(heap[i], heap[parent(i)]);
        i = parent(i);
    }
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 4],
      watchVars: ['val', 'i', 'parent(i)'],
    },
  },

  // ==========================================
  // 6. HASH TABLE
  // ==========================================
  'hash-table:insert': {
    title: 'Hash Table Put with Chaining',
    java: {
      code: `public void put(int key, String value) {
    int bucketIndex = Math.abs(key.hashCode()) % buckets.length;
    Node head = buckets[bucketIndex];
    // Check if key already exists in chain
    while (head != null) {
        if (head.key == key) { head.value = value; return; }
        head = head.next;
    }
    // Prepend new node to chain
    Node newNode = new Node(key, value, buckets[bucketIndex]);
    buckets[bucketIndex] = newNode;
}`,
      lineMapping: [1, 2, 3, 5, 6, 7, 10, 11],
      watchVars: ['key', 'bucketIndex', 'value'],
    },
    cpp: {
      code: `void put(int key, const std::string& value) {
    size_t idx = std::hash<int>{}(key) % table.size();
    for (auto& pair : table[idx]) {
        if (pair.first == key) { pair.second = value; return; }
    }
    // Insert into bucket chain
    table[idx].emplace_back(key, value);
}`,
      lineMapping: [1, 2, 3, 4, 7],
      watchVars: ['key', 'idx', 'value'],
    },
  },

  // ==========================================
  // 7. TREE & BST
  // ==========================================
  'binary-search-tree:insert': {
    title: 'BST Recursive Insertion',
    java: {
      code: `public TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    // Traverse Left or Right subtrees
    if (val < root.val) {
        root.left = insert(root.left, val);
    } else if (val > root.val) {
        root.right = insert(root.right, val);
    }
    return root;
}`,
      lineMapping: [1, 2, 4, 5, 6, 7, 9],
      watchVars: ['val', 'root.val'],
    },
    cpp: {
      code: `TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    return root;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 8],
      watchVars: ['val', 'root->val'],
    },
  },

  'tree:traversal': {
    title: 'Inorder Tree Traversal (Left, Root, Right)',
    java: {
      code: `public void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);       // 1. Visit Left Subtree
    System.out.print(root.val + " "); // 2. Visit Root Node
    inorder(root.right);      // 3. Visit Right Subtree
}`,
      lineMapping: [1, 2, 3, 4, 5],
      watchVars: ['root.val'],
    },
    cpp: {
      code: `void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);      // Left
    std::cout << root->val << " "; // Current
    inorder(root->right);     // Right
}`,
      lineMapping: [1, 2, 3, 4, 5],
      watchVars: ['root->val'],
    },
  },

  // ==========================================
  // 8. AVL TREE
  // ==========================================
  'avl-tree:insert': {
    title: 'AVL Tree Self-Balancing Insertion',
    java: {
      code: `public Node insert(Node node, int key) {
    if (node == null) return new Node(key);
    if (key < node.key) node.left = insert(node.left, key);
    else if (key > node.key) node.right = insert(node.right, key);
    // Update node height
    node.height = 1 + Math.max(height(node.left), height(node.right));
    int balance = getBalance(node);
    // Rebalance via rotations: LL, RR, LR, RL
    if (balance > 1 && key < node.left.key) return rightRotate(node);
    if (balance < -1 && key > node.right.key) return leftRotate(node);
    return node;
}`,
      lineMapping: [1, 2, 3, 4, 6, 7, 9, 10, 11],
      watchVars: ['key', 'node.key', 'balance', 'height'],
    },
    cpp: {
      code: `Node* insert(Node* node, int key) {
    if (!node) return new Node(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    node->height = 1 + std::max(height(node->left), height(node->right));
    int balance = getBalance(node);
    // Perform AVL Rotations
    if (balance > 1 && key < node->left->key) return rightRotate(node);
    if (balance < -1 && key > node->right->key) return leftRotate(node);
    return node;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 8, 9, 10],
      watchVars: ['key', 'node->key', 'balance'],
    },
  },

  // ==========================================
  // 9. HEAP
  // ==========================================
  'heap:insert': {
    title: 'Heapify Sift-Up Insertion',
    java: {
      code: `public void insert(int val) {
    heap[size] = val; // append at bottom leaf
    int curr = size;
    size++;
    // Sift-up: compare with parent node
    while (curr > 0 && heap[curr] > heap[parent(curr)]) {
        swap(curr, parent(curr));
        curr = parent(curr); // climb upward
    }
}`,
      lineMapping: [1, 2, 3, 4, 6, 7, 8, 6],
      watchVars: ['val', 'curr', 'parent'],
    },
    cpp: {
      code: `void insert(int val) {
    heap.push_back(val);
    int curr = heap.size() - 1;
    // Sift-up to preserve heap ordering
    while (curr > 0 && heap[curr] > heap[parent(curr)]) {
        std::swap(heap[curr], heap[parent(curr)]);
        curr = parent(curr);
    }
}`,
      lineMapping: [1, 2, 3, 5, 6, 7, 5],
      watchVars: ['val', 'curr'],
    },
  },

  // ==========================================
  // 10. GRAPH BFS
  // ==========================================
  'graph:bfs': {
    title: 'Breadth-First Search (BFS)',
    java: {
      code: `public void bfs(int start, List<List<Integer>> adj) {
    boolean[] visited = new boolean[adj.size()];
    Queue<Integer> queue = new LinkedList<>();
    visited[start] = true;
    queue.offer(start);
    while (!queue.isEmpty()) {
        int u = queue.poll(); // Dequeue next vertex
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true; // Mark discovered
                queue.offer(v);    // Enqueue neighbor
            }
        }
    }
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 6],
      watchVars: ['u', 'v', 'queue.size()'],
    },
    cpp: {
      code: `void bfs(int start, const std::vector<std::vector<int>>& adj) {
    std::vector<bool> visited(adj.size(), false);
    std::queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        std::cout << u << " ";
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 6],
      watchVars: ['u', 'v', 'q.size()'],
    },
  },

  // ==========================================
  // 11. GRAPH DFS
  // ==========================================
  'graph:dfs': {
    title: 'Depth-First Search (DFS)',
    java: {
      code: `public void dfs(int u, boolean[] visited, List<List<Integer>> adj) {
    visited[u] = true; // Mark node visited
    System.out.print(u + " ");
    // Recur for all adjacent vertices
    for (int v : adj.get(u)) {
        if (!visited[v]) {
            dfs(v, visited, adj); // Deep dive
        }
    }
}`,
      lineMapping: [1, 2, 3, 5, 6, 7, 5],
      watchVars: ['u', 'v', 'visited[v]'],
    },
    cpp: {
      code: `void dfs(int u, std::vector<bool>& visited, const std::vector<std::vector<int>>& adj) {
    visited[u] = true;
    std::cout << u << " ";
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, visited, adj);
        }
    }
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 4],
      watchVars: ['u', 'v'],
    },
  },

  // ==========================================
  // 12. DIJKSTRA
  // ==========================================
  'graph:dijkstra': {
    title: "Dijkstra's Shortest Path Algorithm",
    java: {
      code: `public int[] dijkstra(int start, List<List<Edge>> graph, int V) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.weight));
    dist[start] = 0;
    pq.offer(new Node(start, 0));
    while (!pq.isEmpty()) {
        Node curr = pq.poll();
        int u = curr.id;
        for (Edge edge : graph.get(u)) {
            if (dist[u] + edge.weight < dist[edge.to]) {
                dist[edge.to] = dist[u] + edge.weight; // Relax edge
                pq.offer(new Node(edge.to, dist[edge.to]));
            }
        }
    }
    return dist;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 7, 16],
      watchVars: ['u', 'edge.to', 'dist[u]', 'dist[v]'],
    },
    cpp: {
      code: `std::vector<int> dijkstra(int start, const std::vector<std::vector<Edge>>& graph, int V) {
    std::vector<int> dist(V, 1e9);
    std::priority_queue<pii, std::vector<pii>, std::greater<pii>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : graph[u]) {
            if (dist[u] + edge.w < dist[edge.to]) {
                dist[edge.to] = dist[u] + edge.w; // Relaxation
                pq.push({dist[edge.to], edge.to});
            }
        }
    }
    return dist;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 6, 16],
      watchVars: ['u', 'edge.to', 'dist[u]'],
    },
  },

  // ==========================================
  // 13. PRIM'S MST
  // ==========================================
  'graph:prims': {
    title: "Prim's Minimum Spanning Tree Algorithm",
    java: {
      code: `public int primMST(List<List<Edge>> adj, int V) {
    boolean[] inMST = new boolean[V];
    PriorityQueue<Edge> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e.weight));
    int totalMSTWeight = 0;
    pq.offer(new Edge(0, 0)); // Start from vertex 0
    while (!pq.isEmpty()) {
        Edge curr = pq.poll();
        int u = curr.to;
        if (inMST[u]) continue;
        inMST[u] = true; // Include vertex in MST
        totalMSTWeight += curr.weight;
        for (Edge e : adj.get(u)) {
            if (!inMST[e.to]) pq.offer(e); // Explore boundary
        }
    }
    return totalMSTWeight;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 6, 16],
      watchVars: ['u', 'curr.weight', 'totalMSTWeight'],
    },
    cpp: {
      code: `int primMST(const std::vector<std::vector<Edge>>& adj, int V) {
    std::vector<bool> inMST(V, false);
    std::priority_queue<pii, std::vector<pii>, std::greater<pii>> pq;
    int mstCost = 0;
    pq.push({0, 0});
    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        mstCost += w;
        for (const auto& e : adj[u]) {
            if (!inMST[e.to]) pq.push({e.w, e.to});
        }
    }
    return mstCost;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 6, 15],
      watchVars: ['u', 'w', 'mstCost'],
    },
  },

  // ==========================================
  // 14. KRUSKAL'S MST
  // ==========================================
  'graph:kruskals': {
    title: "Kruskal's Minimum Spanning Tree Algorithm",
    java: {
      code: `public int kruskalMST(List<Edge> edges, int V) {
    Collections.sort(edges, Comparator.comparingInt(e -> e.weight));
    DisjointSet dsu = new DisjointSet(V);
    int totalCost = 0;
    int edgesCount = 0;
    for (Edge e : edges) {
        // Union-Find cycle check
        if (dsu.find(e.u) != dsu.find(e.v)) {
            dsu.union(e.u, e.v);
            totalCost += e.weight; // Add safe edge
            if (++edgesCount == V - 1) break;
        }
    }
    return totalCost;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 6, 14],
      watchVars: ['e.u', 'e.v', 'e.weight', 'totalCost'],
    },
    cpp: {
      code: `int kruskalMST(std::vector<Edge>& edges, int V) {
    std::sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b){ return a.w < b.w; });
    DSU dsu(V);
    int totalCost = 0;
    for (const auto& e : edges) {
        if (dsu.find(e.u) != dsu.find(e.v)) {
            dsu.unite(e.u, e.v);
            totalCost += e.w;
        }
    }
    return totalCost;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 5, 11],
      watchVars: ['e.u', 'e.v', 'totalCost'],
    },
  },

  // ==========================================
  // 15. SEARCH (LINEAR & BINARY)
  // ==========================================
  'search:linear': {
    title: 'Linear Search Algorithm',
    java: {
      code: `public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        // Compare current element with target
        if (arr[i] == target) {
            return i; // Found at index i
        }
    }
    return -1; // Target not present in array
}`,
      lineMapping: [1, 2, 4, 5, 2, 8],
      watchVars: ['target', 'i', 'arr[i]'],
    },
    cpp: {
      code: `int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return (int)i; // Target found
        }
    }
    return -1; // Not found
}`,
      lineMapping: [1, 2, 3, 4, 2, 7],
      watchVars: ['target', 'i', 'arr[i]'],
    },
  },

  'search:binary': {
    title: 'Binary Search Algorithm (Divide & Conquer)',
    java: {
      code: `public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Midpoint index
        if (arr[mid] == target) {
            return mid; // Target found!
        } else if (arr[mid] < target) {
            low = mid + 1;  // Search in RIGHT half
        } else {
            high = mid - 1; // Search in LEFT half
        }
    }
    return -1; // Element not found
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 13],
      watchVars: ['low', 'high', 'mid', 'arr[mid]', 'target'],
    },
    cpp: {
      code: `int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 13],
      watchVars: ['low', 'high', 'mid', 'target'],
    },
  },

  // ==========================================
  // 16. ALGORITHMS (RECURSION, GREEDY, DP, BACKTRACKING)
  // ==========================================
  'algorithm:recursion': {
    title: 'Recursive Factorial & Call Stack',
    java: {
      code: `public int factorial(int n) {
    // Base Case
    if (n <= 1) {
        return 1;
    }
    // Recursive Case: Call stack builds upward
    int subResult = factorial(n - 1);
    return n * subResult; // Unwind and compute
}`,
      lineMapping: [1, 3, 4, 7, 8],
      watchVars: ['n', 'subResult'],
    },
    cpp: {
      code: `int factorial(int n) {
    // Base Case
    if (n <= 1) {
        return 1;
    }
    // Recursive Step
    int subResult = factorial(n - 1);
    return n * subResult;
}`,
      lineMapping: [1, 3, 4, 7, 8],
      watchVars: ['n', 'subResult'],
    },
  },

  'algorithm:greedy-algorithms': {
    title: 'Greedy Interval / Activity Scheduling',
    java: {
      code: `public int maxActivities(int[] start, int[] end) {
    int count = 1;
    int lastEnd = end[0];
    for (int i = 1; i < start.length; i++) {
        // Greedily pick next compatible activity
        if (start[i] >= lastEnd) {
            count++;
            lastEnd = end[i];
        }
    }
    return count;
}`,
      lineMapping: [1, 2, 3, 4, 6, 7, 8, 4, 11],
      watchVars: ['i', 'lastEnd', 'count'],
    },
    cpp: {
      code: `int maxActivities(const std::vector<int>& start, const std::vector<int>& end) {
    int count = 1, lastEnd = end[0];
    for (size_t i = 1; i < start.size(); i++) {
        if (start[i] >= lastEnd) {
            count++;
            lastEnd = end[i];
        }
    }
    return count;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 3, 9],
      watchVars: ['i', 'lastEnd', 'count'],
    },
  },

  'algorithm:dynamic-programming': {
    title: 'Dynamic Programming: Memoized Fibonacci',
    java: {
      code: `public int fib(int n, int[] memo) {
    // 1. Base cases
    if (n <= 1) return n;
    // 2. Lookup existing subproblem in memo table
    if (memo[n] != 0) return memo[n];
    // 3. Compute and store optimal subproblem
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}`,
      lineMapping: [1, 3, 5, 7, 8],
      watchVars: ['n', 'memo[n]'],
    },
    cpp: {
      code: `int fib(int n, std::vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}`,
      lineMapping: [1, 2, 3, 4, 5],
      watchVars: ['n', 'memo[n]'],
    },
  },

  'algorithm:backtracking': {
    title: 'Backtracking Search & State Restoration',
    java: {
      code: `public boolean solve(int[][] board, int col) {
    if (col >= N) return true; // Solution found!
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col)) {
            board[i][col] = 1; // 1. Choose state
            if (solve(board, col + 1)) return true;
            board[i][col] = 0; // 2. Backtrack & undo state
        }
    }
    return false;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 3, 10],
      watchVars: ['col', 'i', 'board[i][col]'],
    },
    cpp: {
      code: `bool solve(std::vector<std::vector<int>>& board, int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col)) {
            board[i][col] = 1; // Choose
            if (solve(board, col + 1)) return true;
            board[i][col] = 0; // Backtrack
        }
    }
    return false;
}`,
      lineMapping: [1, 2, 3, 4, 5, 6, 7, 3, 10],
      watchVars: ['col', 'i'],
    },
  },
};

/**
 * Intelligent helper to retrieve the matching code snippet and calculate the active line
 */
export function getDemonstrationCode(topicId: string, operation?: string): TopicCodeEntry {
  const normTopic = (topicId || '').toLowerCase().trim();
  const normOp = (operation || '').toLowerCase().trim();

  // Try exact topic:operation match
  const directKey = `${normTopic}:${normOp}`;
  if (CODE_REGISTRY[directKey]) {
    return CODE_REGISTRY[directKey];
  }

  // Try fuzzy matching operation keywords
  for (const key of Object.keys(CODE_REGISTRY)) {
    const [t, o] = key.split(':');
    if (t === normTopic) {
      if (normOp && (normOp.includes(o) || o.includes(normOp))) {
        return CODE_REGISTRY[key];
      }
    }
  }

  // Check graph variants
  if (normTopic === 'bfs') return CODE_REGISTRY['graph:bfs'];
  if (normTopic === 'dfs') return CODE_REGISTRY['graph:dfs'];
  if (normTopic === 'dijkstra') return CODE_REGISTRY['graph:dijkstra'];
  if (normTopic === 'prims' || normTopic === 'prim') return CODE_REGISTRY['graph:prims'];
  if (normTopic === 'kruskals' || normTopic === 'kruskal') return CODE_REGISTRY['graph:kruskals'];
  if (normTopic === 'linear-search') return CODE_REGISTRY['search:linear'];
  if (normTopic === 'binary-search') return CODE_REGISTRY['search:binary'];
  if (normTopic === 'doubly-linked-list') return CODE_REGISTRY['linked-list:insert'];
  if (normTopic === 'circular-queue') return CODE_REGISTRY['queue:enqueue'];
  if (normTopic === 'binary-tree' || normTopic === 'binary-search-tree') return CODE_REGISTRY['binary-search-tree:insert'];

  // Default topic first entry
  for (const key of Object.keys(CODE_REGISTRY)) {
    if (key.startsWith(`${normTopic}:`)) {
      return CODE_REGISTRY[key];
    }
  }

  // Fallback to array:insert
  return CODE_REGISTRY['array:insert'];
}

/**
 * Compute the 1-based line number in Java or C++ code that corresponds to the current step
 */
export function calculateActiveLine(
  snippet: CodeSnippet,
  currentStepIndex: number,
  totalSteps: number,
  isPlaying: boolean
): number {
  if (totalSteps <= 0 || currentStepIndex < 0) {
    return snippet.lineMapping[0] || 1;
  }

  const mapping = snippet.lineMapping;
  if (!mapping || mapping.length === 0) return 1;

  // Direct mapping if within length
  if (currentStepIndex < mapping.length) {
    return mapping[currentStepIndex];
  }

  // Otherwise scale proportionally across the remaining loop steps
  const loopCandidates = mapping.slice(1, -1);
  if (loopCandidates.length > 0) {
    const candidateIdx = (currentStepIndex - mapping.length) % loopCandidates.length;
    return loopCandidates[candidateIdx];
  }

  return mapping[mapping.length - 1];
}
