# Math Dungeon Adventure - Design Document

## Purpose

Math Dungeon Adventure is a serious educational game designed to help students learn and practice mathematics according to the Alberta curriculum. The game combines elements of exploration (like Prodigy) with interactive problem-solving (like Kahoot) to create an engaging learning experience.

The game's primary purpose is to:
- Make math learning fun and engaging through gamification
- Align with Alberta math curriculum for grades 1-12 (Math 1 to Math 30-1)
- Provide interactive visualizations to help students understand mathematical concepts
- Track student progress and provide feedback on their learning journey

## Audience

The target audience includes:
- **Primary Users**: Students in grades 1-12 studying Alberta math curriculum
  - Math 1-6: Elementary school students
  - Math 7-9: Middle school students
  - Math 10-1, 20-1, 30-1: High school students
- **Secondary Users**: Teachers and parents who want to support student learning

The game is designed to be accessible to students of varying skill levels, with progressive difficulty that adapts to the student's grade level and progress.

## Characters

### Hero Character
- **Role**: Player avatar representing the student
- **Functionality**:
  - Movement: WASD or Arrow keys for navigation
  - Stats: HP (Health Points), Attack, Defense, Level, Experience
  - Progression: Gains experience and levels up by solving math problems correctly
  - Visual: Procedurally generated sprite with customizable appearance
- **Purpose**: Provides a sense of ownership and progression for the student

### Enemy Characters
- **Types**: Various monster types (Slime, Goblin, Skeleton, etc.)
- **Functionality**:
  - Different difficulty levels based on grade and unit
  - Turn-based combat system
  - Grade-appropriate math challenges
  - Unique attack patterns and visual designs
- **Purpose**: Creates challenge and motivation to solve math problems correctly

## Algorithms

### Searching Algorithms

#### Binary Search
- **Location**: `src/game/Dungeon/DungeonSearcher.js`
- **Purpose**: Efficiently find specific grades and units in sorted curriculum data
- **Time Complexity**: O(log n)
- **Use Cases**:
  - Finding a specific grade when navigating dungeons
  - Locating units within a grade
  - Quick curriculum content lookup

#### Linear Search
- **Location**: `src/game/Dungeon/DungeonSearcher.js`
- **Purpose**: Search through problems, dungeons, and content by various criteria
- **Time Complexity**: O(n)
- **Use Cases**:
  - Finding problems by topic
  - Searching available dungeons based on player level
  - Finding problems within a difficulty range

### Sorting Algorithms

#### Quicksort
- **Location**: `src/game/Data/LeaderboardSorter.js`
- **Purpose**: Sort leaderboard entries by score or completion percentage
- **Time Complexity**: O(n log n) average case, O(n²) worst case
- **Use Cases**:
  - Displaying sorted leaderboards
  - Ranking players by performance
  - Organizing progress data efficiently

#### Bubble Sort
- **Location**: `src/game/Data/LeaderboardSorter.js`
- **Purpose**: Simple sorting for smaller datasets (progress, inventory)
- **Time Complexity**: O(n²)
- **Use Cases**:
  - Sorting progress entries
  - Organizing inventory items
  - Demonstrating different sorting approaches

## Game Mechanics

### Map Exploration
- **Lobby Area**: Central hub where players start and can access different grade dungeons
- **Dungeon Entrances**: Marked entrances for each grade level (Math 1-9, 10-1, 20-1, 30-1)
- **Player Movement**: Top-down 2D movement with camera following
- **Navigation**: WASD or Arrow keys for movement, E key to enter dungeons

### Dungeon Progression
- **Grade-Based Dungeons**: Each grade has its own dungeon with multiple units
- **Unit System**: Each grade contains multiple math units covering different topics
- **Progressive Difficulty**: Problems become more challenging as students progress
- **Searching System**: Uses binary and linear search to efficiently find content

### Turn-Based Math Battles
- **Combat System**: Pokemon-style turn-based combat
- **Math Integration**: Players must solve math problems to perform attacks
- **Damage Calculation**: 
  - Correct answers: Full attack damage
  - Incorrect answers: Reduced damage (50% of normal)
- **Turn Flow**:
  1. Player's turn: Solve math problem to attack
  2. Enemy's turn: Enemy attacks automatically
  3. Repeat until victory or defeat
- **Rewards**: Experience points and level progression for victories

### Math Problem System
- **Curriculum Alignment**: Problems aligned with Alberta curriculum standards
- **Problem Types**:
  - Multiple choice (grades 1-6)
  - Fill-in-the-blank (all grades)
  - Drag-and-drop (future implementation)
- **Topics Covered**:
  - Math 1-6: Arithmetic, fractions, geometry, patterns, measurement
  - Math 7-9: Algebra, ratios, percentages, statistics
  - Math 10-1: Linear relations, quadratics, trigonometry basics
  - Math 20-1: Radicals, rational expressions, advanced trigonometry
  - Math 30-1: Functions, logarithms, polynomial equations

### Interactive Visualizations
- **Number Line**: Visual representation for arithmetic operations
- **Graph Plotter**: Function graphing for linear and quadratic equations
- **Geometry Visualizer**: Shape visualization for geometry problems
- **Purpose**: Help students visualize and understand mathematical concepts

### Progress Tracking
- **Save System**: LocalStorage-based save/load functionality
- **Statistics**: Tracks problems solved, accuracy, battles won/lost
- **Achievements**: Grade and unit completion tracking
- **Leaderboard**: Sorted leaderboard using quicksort and bubble sort algorithms

## Technology

- **Platform**: Web Browser (React + Vite)
- **Language**: JavaScript/TypeScript
- **Rendering**: HTML5 Canvas for game, React for UI
- **Assets**: Procedurally generated (no external downloads)
- **Storage**: Browser localStorage for save data
- **Audio**: Web Audio API for programmatically generated sounds

## Technical Architecture

### Core Systems
1. **Game Engine**: Main game loop and state management
2. **Map System**: Lobby and dungeon navigation
3. **Battle System**: Turn-based combat mechanics
4. **Math System**: Problem generation and validation
5. **Visualization System**: Interactive math visualizations
6. **Data System**: Save/load and progress tracking
7. **UI System**: React components for all screens

### Data Flow
1. Player starts game → Main Menu
2. Player selects "Start Game" → Map/Lobby loaded
3. Player navigates to dungeon entrance → Dungeon Selection screen
4. Player selects grade and unit → Battle initiated
5. Player solves math problems → Attack enemy
6. Battle outcome → Experience gained, progress saved
7. Return to map → Continue exploration

## Future Enhancements

- Multiplayer functionality
- More enemy types and battle mechanics
- Additional visualization types
- Achievement system expansion
- Teacher dashboard for progress monitoring
- Mobile device optimization
