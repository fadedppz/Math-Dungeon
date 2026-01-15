# Math Dungeon Adventure

A serious educational game combining Prodigy-style exploration with Kahoot-style interactive problem-solving, aligned with Alberta math curriculum.

## Description

Math Dungeon Adventure is a web-based educational game where students explore a map, enter grade-specific dungeons, and battle monsters by solving math problems. The game covers all Alberta math curriculum levels from Math 1 to Math 30-1, providing an engaging way to practice and master mathematical concepts.

## Features

- **Map Exploration**: Navigate a lobby area and discover dungeon entrances for different grade levels
- **Grade-Based Dungeons**: Access dungeons for Math 1-9, Math 10-1, Math 20-1, and Math 30-1
- **Turn-Based Combat**: Pokemon-style battles where solving math problems correctly deals more damage
- **Interactive Visualizations**: Visual aids including number lines, graphs, and geometric shapes
- **Progress Tracking**: Save progress, track statistics, and view leaderboards
- **Procedural Assets**: All visual assets generated programmatically (no external downloads)
- **Alberta Curriculum Alignment**: Problems aligned with official curriculum standards

## Technology Stack

- **Frontend**: React 18 with Vite
- **Language**: JavaScript/ES6+
- **Rendering**: HTML5 Canvas for game, React for UI
- **Storage**: Browser localStorage
- **Audio**: Web Audio API

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:3000`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Play

### Controls

- **WASD** or **Arrow Keys**: Move your character
- **E**: Enter a dungeon when near an entrance
- **Mouse**: Click buttons and interact with UI elements

### Gameplay Flow

1. **Start Game**: Click "Start Game" from the main menu
2. **Explore Map**: Use WASD to move around the lobby area
3. **Enter Dungeon**: Approach a grade entrance (e.g., "Math 1") and press E
4. **Select Unit**: Choose a math unit from the dungeon selection screen
5. **Battle**: Solve math problems to attack monsters
6. **Progress**: Gain experience, level up, and unlock new content

### Battle System

- **Player Turn**: Solve the displayed math problem to attack
- **Correct Answer**: Deal full damage to the enemy
- **Wrong Answer**: Deal reduced damage (50% of normal)
- **Enemy Turn**: Enemy attacks automatically
- **Victory**: Gain experience points and level up
- **Defeat**: Return to map (progress is saved)

## Project Structure

```
math-dungeon-game/
├── src/
│   ├── components/          # React UI components
│   │   ├── MainMenu.jsx
│   │   ├── GameHUD.jsx
│   │   ├── BattleUI.jsx
│   │   ├── DungeonSelection.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Settings.jsx
│   ├── game/                # Game logic
│   │   ├── Characters/      # Hero and Enemy classes
│   │   ├── Map/             # Map and navigation
│   │   ├── Dungeon/         # Dungeon system with searching algorithms
│   │   ├── Battle/          # Turn-based combat
│   │   ├── Math/            # Problem generation
│   │   ├── Visualization/   # Math visualizations
│   │   └── Data/            # Save/load and sorting algorithms
│   ├── utils/               # Utility functions
│   │   ├── assetGenerator.js
│   │   └── audioManager.js
│   ├── data/                # Game data
│   │   └── curriculum/      # Alberta curriculum structure
│   └── styles/              # CSS styles
├── docs/                    # Documentation
│   ├── DESIGN_DOCUMENT.md
│   └── ALGORITHMS.md
└── README.md
```

## Algorithms Implemented

### Searching Algorithms
- **Binary Search**: O(log n) - Finding grades/units in sorted curriculum data
- **Linear Search**: O(n) - Finding problems by topic, searching dungeons

### Sorting Algorithms
- **Quicksort**: O(n log n) - Sorting leaderboards by score
- **Bubble Sort**: O(n²) - Sorting progress and inventory

See `docs/ALGORITHMS.md` for detailed algorithm explanations.

## Curriculum Coverage

The game covers all Alberta math curriculum levels:

- **Math 1-6**: Number sense, operations, patterns, measurement, geometry, data analysis
- **Math 7-9**: Number operations, patterns and relations, shape and space, statistics
- **Math 10-1**: Measurement, algebra, relations and functions, trigonometry
- **Math 20-1**: Sequences and series, trigonometry, quadratics, radicals
- **Math 30-1**: Functions, logarithms, polynomial functions, trigonometry

## Development

### Key Files

- **Game Engine**: `src/game/GameEngine.js`
- **Map System**: `src/game/Map/MapManager.js`
- **Battle System**: `src/game/Battle/BattleManager.js`
- **Problem Generator**: `src/game/Math/ProblemGenerator.js`
- **Searching Algorithms**: `src/game/Dungeon/DungeonSearcher.js`
- **Sorting Algorithms**: `src/game/Data/LeaderboardSorter.js`

### Adding New Problems

Problems are generated programmatically in `src/game/Math/ProblemGenerator.js`. To add new problem types:

1. Add a new template function in `initializeTemplates()`
2. Update the topic mapping in `generateProblem()`
3. Ensure problems align with curriculum standards

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Note: Web Audio API support required for sound effects.

## License

This project is created for educational purposes as part of a serious game development assignment.

## Credits

- **Assets**: All assets procedurally generated using Canvas API
- **Audio**: Generated using Web Audio API
- **Curriculum**: Based on Alberta Education math curriculum

## Troubleshooting

### Game won't start
- Ensure Node.js is installed
- Run `npm install` to install dependencies
- Check browser console for errors

### Audio not working
- Some browsers require user interaction before playing audio
- Click anywhere on the page to enable audio
- Check browser audio settings

### Save data not persisting
- Ensure localStorage is enabled in your browser
- Check browser storage settings
- Clear browser cache if issues persist

## Future Enhancements

- Multiplayer functionality
- Additional enemy types
- More visualization types
- Mobile device optimization
- Teacher dashboard
- Achievement system expansion

## Contact

For questions or issues, please refer to the documentation in the `docs/` folder.
