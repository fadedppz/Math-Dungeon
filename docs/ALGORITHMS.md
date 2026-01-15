# 🧠 Algorithm Explanations - Math Dungeon Adventure

This document provides **beginner-friendly, in-depth explanations** of every algorithm used in Math Dungeon Adventure. After reading this, you should be able to explain how each algorithm works, where it's used in the code, why we chose it, and why we didn't choose alternatives.

---

## 📋 Table of Contents

1. [What Are Algorithms?](#what-are-algorithms)
2. [Searching Algorithms](#searching-algorithms)
   - [Binary Search (Recursive)](#binary-search-recursive)
   - [Linear Search](#linear-search)
3. [Sorting Algorithms](#sorting-algorithms)
   - [Quicksort](#quicksort)
   - [Bubble Sort](#bubble-sort)
4. [Game-Specific Algorithms](#game-specific-algorithms)
   - [Damage Calculation](#damage-calculation-algorithm)
   - [Boss Damage Cap (Fair Play)](#boss-damage-cap-algorithm)
   - [Experience & Level Up](#experience--level-up-algorithm)
   - [Problem Generation & Selection](#problem-generation-algorithm)
5. [Algorithm Comparison Table](#algorithm-comparison-table)
6. [Why These Algorithms Matter](#why-these-algorithms-matter)

---

## What Are Algorithms?

> **Definition**: An algorithm is a step-by-step procedure for solving a problem or accomplishing a task.

Think of algorithms like recipes:
- A **recipe** tells you step-by-step how to make a cake
- An **algorithm** tells a computer step-by-step how to solve a problem

In Math Dungeon, we use algorithms to:
- **Find things quickly** (searching)
- **Organize data** (sorting)
- **Calculate game mechanics** (damage, experience)
- **Generate math problems** (problem selection)

---

## Searching Algorithms

### Binary Search (Recursive)

> **File Location**: `src/game/Dungeon/DungeonSearcher.js` (Lines 22-44)

#### 🎯 What Does It Do?

Binary search finds a specific item in a **sorted list** by repeatedly cutting the search area in half. It's like finding a word in a dictionary - you don't start at page 1 and read every page. Instead, you open to the middle and decide if your word comes before or after.

#### 🔧 Where Is It Used In The Game?

```
Player clicks on "Grade 5 Dungeon"
        ↓
Game needs to find Grade 5 data in curriculum
        ↓
Binary Search runs on sorted grade list
        ↓
Grade 5 found in just 2-3 steps (not 5!)
```

**Specific Use Cases:**
1. **Finding a grade** when player enters a dungeon entrance
2. **Locating units** within a grade for unit selection
3. **Quick curriculum lookup** for problem generation

#### 📝 How The Code Works (Line-by-Line)

```javascript
// File: src/game/Dungeon/DungeonSearcher.js (Lines 22-44)

function binarySearchGrade(sortedGrades, targetGrade, left = 0, right = sortedGrades.length - 1) {
  // STEP 1: BASE CASE - Did we run out of places to look?
  // If left > right, the search space is empty - the item isn't here!
  if (left > right) {
    return null  // "Sorry, couldn't find it!"
  }

  // STEP 2: Find the MIDDLE of our search area
  // Math.floor rounds down so we get a whole number index
  const mid = Math.floor((left + right) / 2)
  const midGrade = sortedGrades[mid]  // Get the grade at the middle

  // STEP 3: Did we find it?
  if (midGrade.grade === targetGrade) {
    return midGrade  // "Found it!"
  }

  // STEP 4: RECURSIVE CASES - Which half should we search?
  if (midGrade.grade < targetGrade) {
    // Target is BIGGER than middle, so search the RIGHT half
    // The new left boundary is mid + 1 (skip the middle, we checked it)
    return binarySearchGrade(sortedGrades, targetGrade, mid + 1, right)
  } else {
    // Target is SMALLER than middle, so search the LEFT half
    // The new right boundary is mid - 1
    return binarySearchGrade(sortedGrades, targetGrade, left, mid - 1)
  }
}
```

#### 🎨 Visual Example

Let's find **Grade 8** in a list of grades `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]`:

```
Step 1: Search [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        Middle = Grade 6
        8 > 6, so search RIGHT half

Step 2: Search [7, 8, 9, 10, 11, 12]
        Middle = Grade 9
        8 < 9, so search LEFT half

Step 3: Search [7, 8]
        Middle = Grade 7
        8 > 7, so search RIGHT half

Step 4: Search [8]
        Middle = Grade 8
        FOUND IT! ✓

Total steps: 4 (instead of 8 with linear search!)
```

#### ⏱️ Time & Space Complexity

| Measure | Complexity | What It Means |
|---------|-----------|---------------|
| **Best Case** | O(1) | Target is in the exact middle - instant find! |
| **Average Case** | O(log n) | Each step eliminates HALF the remaining items |
| **Worst Case** | O(log n) | Even worst case is still very fast |
| **Space** | O(log n) | Each recursive call uses some memory (call stack) |

**What does O(log n) mean?**
- For 12 grades: At most 4 steps needed (`log₂(12) ≈ 4`)
- For 1000 items: Only ~10 steps needed!
- For 1,000,000 items: Only ~20 steps needed!

#### ✅ Why We Chose Binary Search

1. **Perfect for curriculum data**: Grades 1-12 are naturally sorted numbers
2. **Very fast**: O(log n) means finding Grade 12 takes 4 steps, not 12
3. **Recursive version is educational**: Shows students how recursion works
4. **Self-documenting**: The code structure matches the mathematical definition

#### ❌ Why Not Other Algorithms?

| Alternative | Why We Didn't Choose It |
|-------------|------------------------|
| **Linear Search** | Too slow - would check every grade from 1 until finding the target |
| **Hash Table** | Overkill for 12 items; adds memory overhead |
| **Iterative Binary Search** | Would work, but recursive version better demonstrates the divide-and-conquer concept |
| **Interpolation Search** | More complex; only faster for uniformly distributed data |

#### 💡 Key Insight

> Binary search is **recursive** because each step is the same problem on a smaller list. The function calls itself with narrower boundaries until it either finds the target or runs out of places to look.

---

### Linear Search

> **File Location**: `src/game/Dungeon/DungeonSearcher.js` (Lines 91-102)

#### 🎯 What Does It Do?

Linear search looks at **every item one by one** from start to finish until it finds what it's looking for. It's like looking for your keys by checking every pocket in order.

#### 🔧 Where Is It Used In The Game?

```
Player wants problems about "fractions"
        ↓
Game has a list of 50 problems (not sorted by topic)
        ↓
Linear Search checks each problem's topic
        ↓
Returns ALL problems that match "fractions"
```

**Specific Use Cases:**
1. **Finding all problems** with a specific topic
2. **Searching available dungeons** based on player level
3. **Finding problems** within a difficulty range
4. **Content discovery** when player explores units

#### 📝 How The Code Works (Line-by-Line)

```javascript
// File: src/game/Dungeon/DungeonSearcher.js (Lines 91-102)

function linearSearchProblems(problems, topic) {
  // Create an empty bucket to collect matching problems
  const results = []

  // Check EVERY problem in the list, one by one
  for (let i = 0; i < problems.length; i++) {
    // Check if this problem matches our topic
    // The "?." is optional chaining - safely checks if topics array exists
    if (problems[i].topic === topic || 
        problems[i].topics?.includes(topic)) {
      // Found a match! Add it to our results
      results.push(problems[i])
    }
  }

  // Return ALL matching problems (not just the first one)
  return results
}
```

#### 🎨 Visual Example

Finding all "addition" problems in: `[mult, add, sub, add, div, add]`

```
Step 1: Check "mult" → Not addition, skip
Step 2: Check "add"  → Match! Add to results
Step 3: Check "sub"  → Not addition, skip
Step 4: Check "add"  → Match! Add to results
Step 5: Check "div"  → Not addition, skip
Step 6: Check "add"  → Match! Add to results

Results: [add, add, add] (found all 3!)
```

#### ⏱️ Time & Space Complexity

| Measure | Complexity | What It Means |
|---------|-----------|---------------|
| **Best Case** | O(1) | Find it on the very first check |
| **Average Case** | O(n/2) → O(n) | On average, check half the items |
| **Worst Case** | O(n) | Item is last or not found - check everything |
| **Space** | O(1) | Only need a small results array |

#### ✅ Why We Chose Linear Search

1. **Works on unsorted data**: Problems aren't sorted by topic
2. **Finds ALL matches**: Binary search only finds ONE; we need ALL matching problems
3. **Simple to understand**: Perfect for small to medium lists
4. **No prep work needed**: No need to sort data first

#### ❌ Why Not Other Algorithms?

| Alternative | Why We Didn't Choose It |
|-------------|------------------------|
| **Binary Search** | Requires sorted data; only finds ONE match |
| **Hash Table** | Would need to pre-build index; problems change often |
| **Indexing** | Adds complexity; problem lists are small enough |
| **Parallel Search** | Browser JavaScript is single-threaded |

#### 💡 Key Insight

> Linear search is the **only option** when you need to find ALL matches or when data isn't sorted. Its O(n) time is acceptable for small lists (problems per unit are typically under 100).

---

## Sorting Algorithms

### Quicksort

> **File Location**: `src/game/Data/LeaderboardSorter.js` (Lines 20-51)

#### 🎯 What Does It Do?

Quicksort organizes a list by picking a "pivot" element, then grouping items into "smaller than pivot" and "bigger than pivot" groups. It then recursively sorts each group.

Think of it like organizing a messy deck of cards:
1. Pick a random card (the "pivot")
2. Put all smaller cards in a left pile, bigger cards in a right pile
3. Repeat for each pile until everything is sorted

#### 🔧 Where Is It Used In The Game?

```
10 players complete a dungeon
        ↓
Their scores need to be ranked (highest first)
        ↓
Quicksort organizes the leaderboard
        ↓
Display: 1st: 9500, 2nd: 8200, 3rd: 7100...
```

**Specific Use Cases:**
1. **Sorting leaderboard** by score (highest first)
2. **Ranking players** by completion percentage
3. **Organizing progress data** efficiently
4. **Displaying sorted lists** in the UI

#### 📝 How The Code Works (Line-by-Line)

```javascript
// File: src/game/Data/LeaderboardSorter.js (Lines 20-51)

// MAIN QUICKSORT FUNCTION
function quicksortLeaderboard(arr, left = 0, right = arr.length - 1) {
  // Only sort if there's more than one element
  if (left < right) {
    // Step 1: Partition the array and get the pivot's final position
    const pivotIndex = partitionLeaderboard(arr, left, right)
    
    // Step 2: Recursively sort the LEFT half (elements smaller than pivot)
    quicksortLeaderboard(arr, left, pivotIndex - 1)
    
    // Step 3: Recursively sort the RIGHT half (elements bigger than pivot)
    quicksortLeaderboard(arr, pivotIndex + 1, right)
  }
  return arr
}

// PARTITION FUNCTION - The heart of quicksort
function partitionLeaderboard(arr, left, right) {
  // Use the last element as the pivot
  const pivot = arr[right].score || arr[right].completionPercentage || 0
  
  // 'i' tracks where smaller elements should go
  let i = left - 1

  // Check each element from left to right-1
  for (let j = left; j < right; j++) {
    const currentScore = arr[j].score || arr[j].completionPercentage || 0
    
    // For DESCENDING order: if current >= pivot, it goes to the left section
    if (currentScore >= pivot) {
      i++
      // Swap: move this element to the left section
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // Put the pivot in its correct position (between smaller and larger elements)
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]
  
  // Return where the pivot ended up
  return i + 1
}
```

#### 🎨 Visual Example

Sorting scores `[85, 92, 78, 95, 88]` in descending order:

```
Initial: [85, 92, 78, 95, 88]
Pivot = 88 (last element)

Partition:
- 85 < 88? Yes → skip (goes to right section)
- 92 ≥ 88? Yes → move to left section
- 78 < 88? Yes → skip
- 95 ≥ 88? Yes → move to left section

After partition: [92, 95, 88, 85, 78]
                  ↑ left ↑pivot ↑ right

Recursively sort left [92, 95] → [95, 92]
Recursively sort right [85, 78] → [85, 78]

Final: [95, 92, 88, 85, 78] ✓
```

#### ⏱️ Time & Space Complexity

| Measure | Complexity | What It Means |
|---------|-----------|---------------|
| **Best Case** | O(n log n) | Pivot always splits list in half |
| **Average Case** | O(n log n) | Very fast for most data |
| **Worst Case** | O(n²) | Already sorted data (rare with random pivots) |
| **Space** | O(log n) | Recursive call stack depth |

#### ✅ Why We Chose Quicksort

1. **Fast average case**: O(n log n) handles large leaderboards efficiently
2. **In-place sorting**: Doesn't need extra memory for a copy
3. **Good with random data**: Leaderboard scores are usually random
4. **Industry standard**: Used in many real-world applications

#### ❌ Why Not Other Algorithms?

| Alternative | Why We Didn't Choose It |
|-------------|------------------------|
| **Bubble Sort** | O(n²) is too slow for larger leaderboards |
| **Merge Sort** | Needs O(n) extra space for temporary arrays |
| **Heap Sort** | Harder to implement; not as cache-friendly |
| **Built-in `.sort()`** | Works, but we wanted to demonstrate the algorithm |

#### 💡 Key Insight

> Quicksort's power comes from **partitioning**. By putting elements on the correct "side" of the pivot, we reduce the problem size by half each time - that's where the O(n log n) comes from!

---

### Bubble Sort

> **File Location**: `src/game/Data/LeaderboardSorter.js` (Lines 63-93)

#### 🎯 What Does It Do?

Bubble sort repeatedly compares adjacent (next-to-each-other) elements and swaps them if they're in the wrong order. The largest elements "bubble up" to the end of the list like bubbles rising in water.

#### 🔧 Where Is It Used In The Game?

```
Player has 5 progress entries to display
        ↓
Need to sort by completion percentage
        ↓
Bubble Sort is fast enough for 5 items
        ↓
Display: Unit 3 (95%), Unit 1 (80%), Unit 5 (60%)...
```

**Specific Use Cases:**
1. **Sorting progress entries** (usually small lists)
2. **Organizing inventory items**
3. **Educational demonstration** of sorting concepts
4. **Small datasets** where simplicity beats speed

#### 📝 How The Code Works (Line-by-Line)

```javascript
// File: src/game/Data/LeaderboardSorter.js (Lines 63-93)

function bubbleSort(arr, sortBy = 'score', ascending = false) {
  const n = arr.length
  const arrCopy = [...arr]  // Don't modify the original array

  // Outer loop: repeat n-1 times (each pass puts one element in place)
  for (let i = 0; i < n - 1; i++) {
    let swapped = false  // Track if we made any swaps this pass
    
    // Inner loop: compare adjacent pairs
    // (n - i - 1) because last i elements are already sorted
    for (let j = 0; j < n - i - 1; j++) {
      const a = arrCopy[j][sortBy] || 0      // Current element's value
      const b = arrCopy[j + 1][sortBy] || 0  // Next element's value
      
      // Decide if we should swap based on sort direction
      let shouldSwap = false
      if (ascending) {
        shouldSwap = a > b  // For ascending: swap if current > next
      } else {
        shouldSwap = a < b  // For descending: swap if current < next
      }

      if (shouldSwap) {
        // Swap the two elements using destructuring
        [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]]
        swapped = true
      }
    }
    
    // OPTIMIZATION: If no swaps happened, array is already sorted!
    if (!swapped) {
      break
    }
  }

  return arrCopy
}
```

#### 🎨 Visual Example

Sorting scores `[64, 34, 25, 12, 22]` in descending order:

```
Pass 1:
  [64, 34, 25, 12, 22]
   ↑   ↑  Compare: 64 > 34? Yes, keep
      [64, 34, 25, 12, 22]
           ↑   ↑  Compare: 34 > 25? Yes, keep
              [64, 34, 25, 12, 22]
                   ↑   ↑  Compare: 25 > 12? Yes, keep
                      [64, 34, 25, 22, 12]
                           ↑   ↑  Compare: 12 < 22? Swap!
  After Pass 1: [64, 34, 25, 22, 12] (12 bubbled to end)

Pass 2:
  [64, 34, 25, 22, 12]
  After comparisons: [64, 34, 25, 22, 12] (already good!)

Pass 3: One comparison, no swaps → DONE! ✓

Final: [64, 34, 25, 22, 12]
```

#### ⏱️ Time & Space Complexity

| Measure | Complexity | What It Means |
|---------|-----------|---------------|
| **Best Case** | O(n) | Already sorted (with early-exit optimization) |
| **Average Case** | O(n²) | Slow for large lists |
| **Worst Case** | O(n²) | Reverse sorted - maximum swaps needed |
| **Space** | O(1) | Only need a few temporary variables |

#### ✅ Why We Chose Bubble Sort

1. **Simple to understand**: Perfect for learning sorting concepts
2. **Fast for small data**: Progress lists are typically 5-10 items
3. **Stable sort**: Maintains relative order of equal elements
4. **Easy to implement**: Less code = fewer bugs
5. **Early exit optimization**: Can stop early if already sorted

#### ❌ Why Not Other Algorithms?

| Alternative | Why We Didn't Choose It |
|-------------|------------------------|
| **Quicksort** | Overkill complexity for 5-10 items |
| **Merge Sort** | Needs extra memory |
| **Insertion Sort** | Similar performance; bubble sort more intuitive |
| **Selection Sort** | No early-exit optimization |

#### 💡 Key Insight

> Bubble sort is **not efficient** for large datasets, but it's **perfect** for small ones! The game uses it strategically - there's a check in `sortLeaderboardByScore()` (line 104-108) that chooses bubble sort for ≤10 items and quicksort for larger lists.

---

## Game-Specific Algorithms

### Damage Calculation Algorithm

> **File Location**: `src/game/Battle/AttackSystem.js`

#### 🎯 What Does It Do?

Calculates how much damage an attack deals based on attack power, defense, answer correctness, and some randomness.

#### 📝 The Formula

```
baseDamage = attackerAttack + weaponBonus
if (wrongAnswer): baseDamage *= 0.5
variance = random(0 to 5)
totalDamage = baseDamage + variance
defensePenalty = defenderDefense × 0.5
finalDamage = max(1, totalDamage - defensePenalty)
```

#### 🎨 Example Walkthrough

```
Player Stats: Attack = 20, Weapon Bonus = 5
Enemy Stats: Defense = 10
Answer: CORRECT ✓

Step 1: baseDamage = 20 + 5 = 25
Step 2: (correct answer, no penalty)
Step 3: variance = 3 (random roll)
Step 4: totalDamage = 25 + 3 = 28
Step 5: defensePenalty = 10 × 0.5 = 5
Step 6: finalDamage = 28 - 5 = 23 damage! ⚔️
```

#### ✅ Why This Formula?

1. **Attack matters**: Higher attack = more damage
2. **Defense matters**: Higher defense = take less damage
3. **Correct answers rewarded**: Wrong answers halve your damage
4. **Randomness adds excitement**: ±5 damage variance keeps battles interesting
5. **Minimum 1 damage**: Prevents attacks from doing nothing

---

### Boss Damage Cap Algorithm

> **File Location**: `src/game/Battle/BattleManager.js` (Lines 581-593)

#### 🎯 What Does It Do?

Ensures the boss can **NEVER one-shot the player**. This keeps the game fair and educational - players should lose because they got problems wrong, not because of bad luck!

#### 📝 The Formula

```javascript
function figureOutHowMuchDamageTheBossDoes(bossNormalDamage, heroLevel, heroMaxHP) {
  // Level scaling: +5% damage per level above 1
  const levelsAboveOne = Math.max(0, heroLevel - 1)
  const damageMultiplier = 1 + (levelsAboveOne * 0.05)
  const boostedDamage = bossNormalDamage * damageMultiplier

  // SAFETY CAP: Max 20% of hero's HP per hit
  const maxAllowedDamage = heroMaxHP * 0.20

  // Use the SMALLER value (protect the player!)
  const finalDamage = Math.max(1, Math.floor(Math.min(boostedDamage, maxAllowedDamage)))
  return finalDamage
}
```

#### 🎨 Example Walkthrough

```
Hero: Level 5, Max HP = 400
Boss: Wants to deal 100 damage

Step 1: levelsAboveOne = 5 - 1 = 4
Step 2: damageMultiplier = 1 + (4 × 0.05) = 1.20
Step 3: boostedDamage = 100 × 1.20 = 120

Step 4: maxAllowedDamage = 400 × 0.20 = 80

Step 5: finalDamage = min(120, 80) = 80 ✓

The boss wanted to deal 120 damage, but was CAPPED at 80!
Player always survives at least 5 hits.
```

#### ✅ Why This Design?

1. **Fair play**: Players need at least 5 hits to die
2. **Learning time**: Players have time to answer questions
3. **Level scaling**: Higher-level players face slightly more damage
4. **No frustration**: Can't be "cheesed" by overpowered bosses

---

### Experience & Level Up Algorithm

> **File Location**: `src/game/Characters/CharacterStats.js` (Lines 727-746)

#### 📝 How Leveling Works

```javascript
// When you gain experience:
this.experience += expGained

// Check if you have enough to level up
while (this.experience >= this.experienceToNextLevel) {
  this.experience -= this.experienceToNextLevel
  this.levelUp()
}

// Level up increases stats:
levelUp() {
  this.level++
  this.maxHP = Math.floor(this.maxHP * 1.20)        // +20% HP
  this.currentHP += (this.maxHP - oldMaxHP)         // Heal the difference
  this.attack = Math.floor(this.attack * 1.15)      // +15% attack
  this.defense = Math.floor(this.defense * 1.10)   // +10% defense
  this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5)
}
```

#### 🎨 Example: Level 1 → Level 2

```
Starting Stats (Level 1):
- HP: 400
- Attack: 10
- Defense: 5
- EXP needed: 100

After Level Up (Level 2):
- HP: 400 × 1.20 = 480 (+80)
- Attack: 10 × 1.15 = 11 (+1)
- Defense: 5 × 1.10 = 5 (rounded from 5.5)
- EXP needed: 100 × 1.50 = 150

Each level requires 50% more EXP than the last!
```

---

### Problem Generation Algorithm

> **File Location**: `src/game/Math/ProblemGenerator.js`

#### 🎯 What Does It Do?

Generates curriculum-aligned math problems based on grade level and topic. Uses a two-tier lookup system:

1. **Unit Generators**: Maps exact unit names (like "fractions") to generator functions
2. **Topic Generators**: Maps keyword topics (like "addition") to generators

#### 📝 How Problem Selection Works

```javascript
// Step 1: Try to find an exact unit match
const generator = this.unitGenerators[unitName.toLowerCase()]
if (generator) {
  return generator(grade)
}

// Step 2: Try to find a topic keyword match
for (const [keyword, gen] of Object.entries(this.topicGenerators)) {
  if (unitName.includes(keyword)) {
    return gen(grade)
  }
}

// Step 3: Fall back to grade-based defaults
if (grade <= 3) return this.genAddition(grade)
if (grade <= 6) return this.genMultiplication(grade)
if (grade <= 9) return this.genLinearEquations(grade)
return this.genFactoringPolynomials(grade)
```

#### 🎨 Example: Generating a Grade 5 Fractions Problem

```javascript
genFractions(grade) {
  // Pick a random problem type (1-6)
  const problemType = Math.floor(Math.random() * 6) + 1
  
  if (problemType === 1) {
    // Adding fractions with same denominator
    const denom = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)]  // Pick 2, 3, 4, 5, or 6
    const n1 = Math.floor(Math.random() * (denom - 1)) + 1        // Random numerator
    const n2 = Math.floor(Math.random() * (denom - n1)) + 1       // Another numerator
    
    return this.createProblem(
      `${n1}/${denom} + ${n2}/${denom} = ?`,  // "2/5 + 1/5 = ?"
      `${n1 + n2}/${denom}`,                   // "3/5"
      'Adding Fractions',
      grade
    )
  }
  // ... other problem types ...
}
```

---

## Algorithm Comparison Table

| Algorithm | Time Complexity | Space | Best For | Used In Game For |
|-----------|----------------|-------|----------|------------------|
| **Binary Search** | O(log n) | O(log n) | Sorted data, single item | Finding grades/units |
| **Linear Search** | O(n) | O(1) | Unsorted data, multiple matches | Finding problems by topic |
| **Quicksort** | O(n log n) | O(log n) | Large datasets | Leaderboard sorting |
| **Bubble Sort** | O(n²) | O(1) | Small datasets (≤10 items) | Progress/inventory sorting |

---

## Why These Algorithms Matter

### Educational Value

These algorithms demonstrate important computer science concepts:

1. **Efficiency Matters**: Binary search (O(log n)) vs Linear search (O(n)) shows how algorithm choice affects performance
2. **Trade-offs Exist**: Quicksort is faster but more complex than Bubble sort
3. **Right Tool for the Job**: We use different algorithms for different situations

### Real-World Applications

The algorithms we use are found everywhere:

- **Binary Search**: Used by Google to search billions of web pages
- **Quicksort**: Used by most programming languages' built-in sort functions
- **Linear Search**: Used when data isn't sorted (like searching emails)

### Game Functionality

Without these algorithms, the game would be:
- **Slow**: Loading dungeons would take longer
- **Unfair**: Boss damage could one-shot players
- **Disorganized**: Leaderboards would be unsorted

---

## Summary For Beginners

Here's what you need to remember for your presentation:

1. **Binary Search**: "It cuts the search area in half each time - like looking for a word in a dictionary by opening to the middle first."

2. **Linear Search**: "It checks every item one by one - simple but necessary when we need ALL matches."

3. **Quicksort**: "It picks a pivot and separates smaller/larger items - very fast for big lists."

4. **Bubble Sort**: "It swaps adjacent items until sorted - simple and good for small lists."

5. **Damage Calculation**: "Combines attack, defense, and answer correctness with some randomness."

6. **Boss Damage Cap**: "Protects players by limiting boss damage to 20% of their HP."

