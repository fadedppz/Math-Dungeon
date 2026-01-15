# Algorithm Explanations

This document explains the iterative algorithms implemented in Math Dungeon Adventure.

## Searching Algorithms

### Binary Search

**Location**: `src/game/Dungeon/DungeonSearcher.js`

**Purpose**: Efficiently find specific grades and units in sorted curriculum data.

**Algorithm Description**:
Binary search works by repeatedly dividing the search space in half. It compares the target value with the middle element of the array:
- If they match, the search is complete
- If the target is less than the middle element, search the left half
- If the target is greater than the middle element, search the right half
- Repeat until found or search space is exhausted

**Time Complexity**: O(log n)
- Best case: O(1) - target is the middle element
- Average case: O(log n)
- Worst case: O(log n)

**Space Complexity**: O(1) - iterative implementation uses constant space

**Implementation**:
```javascript
function binarySearchGrade(sortedGrades, targetGrade) {
  let left = 0
  let right = sortedGrades.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midGrade = sortedGrades[mid]

    if (midGrade.grade === targetGrade) {
      return midGrade
    } else if (midGrade.grade < targetGrade) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return null // Not found
}
```

**Use Cases in Game**:
- Finding a specific grade when player navigates to a dungeon entrance
- Locating units within a grade for unit selection
- Quick curriculum content lookup for problem generation

**Why Binary Search?**
The curriculum data is sorted by grade number, making binary search ideal for fast lookups. This is especially important when the game needs to quickly find content as the player navigates through different grades.

### Linear Search

**Location**: `src/game/Dungeon/DungeonSearcher.js`

**Purpose**: Search through problems, dungeons, and content by various criteria.

**Algorithm Description**:
Linear search sequentially checks each element in the array until it finds a match or reaches the end:
- Start from the first element
- Compare each element with the target
- Return when match is found or array is exhausted

**Time Complexity**: O(n)
- Best case: O(1) - target is the first element
- Average case: O(n/2)
- Worst case: O(n) - target is last or not found

**Space Complexity**: O(1) - uses constant space

**Implementation**:
```javascript
function linearSearchProblems(problems, topic) {
  const results = []
  
  for (let i = 0; i < problems.length; i++) {
    if (problems[i].topic === topic || 
        problems[i].topics?.includes(topic)) {
      results.push(problems[i])
    }
  }
  
  return results
}
```

**Use Cases in Game**:
- Finding all problems with a specific topic
- Searching available dungeons based on player level
- Finding problems within a difficulty range
- Content discovery when player explores units

**Why Linear Search?**
Linear search is used when:
1. Data is not sorted (problems may be organized by topic, not sorted)
2. We need to find all matches, not just one
3. The dataset is relatively small (problems per unit)
4. Simplicity is preferred over optimization for smaller datasets

## Sorting Algorithms

### Quicksort

**Location**: `src/game/Data/LeaderboardSorter.js`

**Purpose**: Sort leaderboard entries by score, level, or completion percentage.

**Algorithm Description**:
Quicksort is a divide-and-conquer algorithm:
1. **Partition**: Choose a pivot element and partition the array so that:
   - Elements less than pivot are on the left
   - Elements greater than pivot are on the right
2. **Recurse**: Recursively sort the left and right subarrays
3. **Combine**: No combine step needed (elements are in place)

**Time Complexity**: 
- Best case: O(n log n) - balanced partitions
- Average case: O(n log n)
- Worst case: O(n²) - unbalanced partitions (rare with good pivot selection)

**Space Complexity**: O(log n) - recursive call stack

**Implementation**:
```javascript
function quicksortLeaderboard(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partitionLeaderboard(arr, left, right)
    quicksortLeaderboard(arr, left, pivotIndex - 1)
    quicksortLeaderboard(arr, pivotIndex + 1, right)
  }
  return arr
}

function partitionLeaderboard(arr, left, right) {
  const pivot = arr[right].score || arr[right].completionPercentage || 0
  let i = left - 1

  for (let j = left; j < right; j++) {
    const currentScore = arr[j].score || arr[j].completionPercentage || 0
    if (currentScore >= pivot) { // Descending order
      i++
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]
  return i + 1
}
```

**Use Cases in Game**:
- Sorting leaderboard by score (highest first)
- Ranking players by completion percentage
- Organizing progress data efficiently
- Displaying sorted lists in UI

**Why Quicksort?**
Quicksort is chosen for leaderboards because:
1. Efficient average-case performance (O(n log n))
2. In-place sorting (memory efficient)
3. Good performance on larger datasets (leaderboards can grow)
4. Well-suited for sorting by numeric values (scores, percentages)

### Bubble Sort

**Location**: `src/game/Data/LeaderboardSorter.js`

**Purpose**: Simple sorting for smaller datasets (progress, inventory).

**Algorithm Description**:
Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order:
1. Compare adjacent pairs of elements
2. Swap if they are in wrong order
3. Repeat until no swaps are needed

**Time Complexity**: O(n²)
- Best case: O(n) - already sorted (with optimization)
- Average case: O(n²)
- Worst case: O(n²)

**Space Complexity**: O(1) - in-place sorting

**Implementation**:
```javascript
function bubbleSort(arr, sortBy = 'score', ascending = false) {
  const n = arr.length
  const arrCopy = [...arr]

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      const a = arrCopy[j][sortBy] || 0
      const b = arrCopy[j + 1][sortBy] || 0
      
      let shouldSwap = false
      if (ascending) {
        shouldSwap = a > b
      } else {
        shouldSwap = a < b
      }

      if (shouldSwap) {
        [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]]
        swapped = true
      }
    }
    
    // Optimization: early exit if no swaps
    if (!swapped) break
  }

  return arrCopy
}
```

**Use Cases in Game**:
- Sorting progress entries (usually small lists)
- Organizing inventory items
- Demonstrating different sorting approaches
- Simple sorting tasks where performance is not critical

**Why Bubble Sort?**
Bubble sort is included because:
1. Simple to understand and implement
2. Adequate for small datasets (progress lists are typically small)
3. Demonstrates a different sorting approach (educational value)
4. Stable sort (maintains relative order of equal elements)
5. No additional memory overhead

**When to Use Each Algorithm**:

- **Binary Search**: Use when data is sorted and you need fast lookups
- **Linear Search**: Use when data is unsorted or you need all matches
- **Quicksort**: Use for larger datasets that need efficient sorting
- **Bubble Sort**: Use for small datasets where simplicity is preferred

## Algorithm Contribution to Game's Serious Purpose

### Educational Value
The algorithms demonstrate important computer science concepts:
- **Efficiency**: Shows how different algorithms have different time complexities
- **Problem Solving**: Demonstrates how to choose the right algorithm for the task
- **Real-World Application**: Algorithms are used in practical game features

### Game Functionality
- **Searching**: Enables quick navigation and content discovery
- **Sorting**: Provides organized leaderboards and progress tracking
- **Performance**: Ensures the game runs smoothly even with growing data

### Learning Support
- **Quick Access**: Binary search allows fast grade/unit lookup
- **Content Discovery**: Linear search helps find relevant problems
- **Progress Tracking**: Sorting algorithms organize and display progress effectively

These algorithms are essential for the game's functionality while also serving as examples of iterative problem-solving techniques that students can learn from.
