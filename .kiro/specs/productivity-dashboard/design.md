# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a single-page web application built with vanilla JavaScript, HTML, and CSS. It provides a focused productivity interface with personalized greeting, editable Pomodoro timer, Eisenhower Matrix task management, quick links, and dark/light theme support.

The application is entirely client-side with no backend dependencies. All data persistence is handled through the browser's Local Storage API, making it lightweight, fast, and privacy-focused. The architecture emphasizes simplicity, maintainability, and responsive user experience.

### Key Design Principles

- **Client-side only**: No server required, runs entirely in the browser
- **Immediate persistence**: All changes saved automatically to Local Storage
- **Component isolation**: Each feature operates independently
- **Personalization**: User name and theme preferences
- **Drag-and-drop**: Intuitive task organization with Eisenhower Matrix
- **Performance first**: Minimal DOM manipulation, efficient event handling

## Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    index.html (Shell)                         │
│  ┌────────────────┐  ┌──────────────────────────────────┐   │
│  │  Theme Toggle  │  │  Name Prompt (First Visit)       │   │
│  └────────────────┘  └──────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Greeting Display (Name + Time)                        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌────────────────────────────────────┐   │
│  │  Left Col    │  │  Right Col                         │   │
│  │  (2 units)   │  │  (8 units)                         │   │
│  │              │  │                                     │   │
│  │  Timer       │  │  Tasks - [Date]                    │   │
│  │  Quick Links │  │  ┌──────────────────────────────┐  │   │
│  │              │  │  │  New Tasks Staging Area      │  │   │
│  │              │  │  └──────────────────────────────┘  │   │
│  │              │  │  ┌────────────┬────────────────┐  │   │
│  │              │  │  │ Urgent &   │ Urgent &       │  │   │
│  │              │  │  │ Important  │ Unimportant    │  │   │
│  │              │  │  ├────────────┼────────────────┤  │   │
│  │              │  │  │ Not Urgent │ Not Urgent &   │  │   │
│  │              │  │  │ & Important│ Unimportant    │  │   │
│  │              │  │  └────────────┴────────────────┘  │   │
│  └──────────────┘  └────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────────┐
              │   Local Storage API       │
              │  ┌─────────────────────┐  │
              │  │ tasks: []           │  │
              │  │ quickLinks: []      │  │
              │  │ userName: string    │  │
              │  │ theme: string       │  │
              │  └─────────────────────┘  │
              └───────────────────────────┘
```

### Component Structure

1. **ThemeManager**: Manages dark/light theme switching and persistence
2. **NamePrompt**: Handles first-visit name collection with modal
3. **GreetingDisplay**: Manages time display and personalized greeting
4. **FocusTimer**: Handles editable countdown timer with emoji controls
5. **TaskList**: Manages Eisenhower Matrix with drag-and-drop
6. **QuickLinks**: Manages website shortcuts with modal interface
7. **StorageManager**: Abstracts Local Storage operations

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with CSS Grid for layout, CSS variables for theming
- **Vanilla JavaScript (ES6+)**: No frameworks, using modern JavaScript features
- **Local Storage API**: Browser-native persistence
- **Drag and Drop API**: Native HTML5 drag-and-drop for task organization
- **Web APIs**: Date, setInterval, setTimeout for time-based features

## Components and Interfaces

### 1. ThemeManager Component

**Responsibility**: Manage theme switching between light and dark modes

**Interface**:
```javascript
class ThemeManager {
  constructor()
  init()
  createToggleButton()
  toggleTheme()
  applyTheme(theme)
}
```

**State**:
```javascript
{
  currentTheme: 'light' | 'dark',
  toggleButton: HTMLElement
}
```

**Key Behaviors**:
- Loads saved theme from Local Storage on init
- Creates fixed-position toggle button with emoji (☀️/🌙)
- Applies theme by adding/removing 'dark-theme' class on body
- Saves theme preference to Local Storage on change

### 2. NamePrompt Component

**Responsibility**: Collect user name on first visit with modal interface

**Interface**:
```javascript
class NamePrompt {
  constructor()
  init(greetingDisplay)
  showPrompt()
  closePrompt()
}
```

**Key Behaviors**:
- Checks Local Storage for existing user name
- Shows modal with blur effect on background if no name found
- Prevents interaction with background while modal is open
- Saves name to Local Storage on submission
- Updates GreetingDisplay with user name
- Closes modal and removes blur effect after submission

### 3. GreetingDisplay Component

**Responsibility**: Display current time and personalized greeting

**Interface**:
```javascript
class GreetingDisplay {
  constructor(containerElement)
  init()
  setUserName(name)
  updateTime()
  getGreeting(hour)
  formatTime(date)
  destroy()
}
```

**State**:
```javascript
{
  userName: string,
  intervalId: number
}
```

**Key Behaviors**:
- Displays greeting and time on same horizontal line
- Updates time every second
- Formats greeting as "Good [time of day], [Name]"
- Both greeting and time displayed in bold
- No date display (moved to Tasks section)

### 4. FocusTimer Component

**Responsibility**: Manage editable countdown timer with emoji controls

**Interface**:
```javascript
class FocusTimer {
  constructor(containerElement)
  init()
  enableEdit()
  start()
  stop()
  reset()
  tick()
  formatDisplay(seconds)
  notifyCompletion()
  updateUI()
  destroy()
}
```

**State**:
```javascript
{
  duration: 1500,        // Default 25 minutes in seconds
  remaining: 1500,       // Current countdown value
  isRunning: false,      // Timer state
  intervalId: null       // setInterval reference
}
```

**Key Behaviors**:
- Timer display is clickable when not running
- Clicking display enables editing in MM:SS format
- Enter saves, Escape cancels edit
- Three buttons in single row: ▶️ (play), ⏸️ (pause), 🔄 (reset)
- Buttons use emoji symbols instead of text
- Updates display every second when running
- Shows notification when countdown reaches zero

### 5. TaskList Component

**Responsibility**: Manage Eisenhower Matrix task organization with drag-and-drop

**Interface**:
```javascript
class TaskList {
  constructor(containerElement, storageManager)
  init()
  updateTaskSectionTitle()
  formatDate(date)
  loadTasks()
  addTask(text)
  editTask(id, newText)
  deleteTask(id)
  toggleComplete(id)
  setupDragAndDrop(quadrant)
  getDragAfterElement(container, y)
  moveTaskToQuadrant(taskId, targetQuadrant)
  renderTasks()
  validateTaskInput(text)
}
```

**Task Data Model**:
```javascript
{
  id: string,           // Unique identifier
  text: string,         // Task description
  completed: boolean,   // Completion status
  createdAt: number,    // Timestamp
  quadrant: string,     // 'new', 'urgent-important', etc.
  order: number         // Position within quadrant
}
```

**Quadrants**:
- `new`: Staging area for new tasks
- `urgent-important`: Red border
- `urgent-unimportant`: Orange border
- `not-urgent-important`: Blue border
- `not-urgent-unimportant`: Gray border

**Key Behaviors**:
- Section title shows "Tasks - [Day, Month Date, Year]"
- Title updates every minute
- New tasks appear in staging area
- Tasks draggable between quadrants
- Tasks draggable within quadrants to reorder
- Completed tasks automatically move to end of quadrant
- Visual feedback during drag (dragging class, drag-over state)
- Persists quadrant and order to Local Storage
- Sorts tasks by completion status (incomplete first) then order

### 6. QuickLinks Component

**Responsibility**: Manage website shortcuts with modal interface

**Interface**:
```javascript
class QuickLinks {
  constructor(containerElement, storageManager)
  init()
  openModal()
  closeModal()
  loadLinks()
  addLink(name, url)
  deleteLink(id)
  renderLinks()
  validateLinkInput(name, url)
  validateURL(url)
  openLink(url)
}
```

**Link Data Model**:
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Display name
  url: string,          // Full URL
  createdAt: number     // Timestamp
}
```

**Key Behaviors**:
- + button opens modal for adding links
- Modal contains name and URL input fields
- Modal closeable via X, Cancel, outside click, or Escape key
- Links displayed vertically stacked
- Small × button next to each link for deletion
- Opens links in new tab with noopener/noreferrer
- Persists to Local Storage on every change

### 7. StorageManager Module

**Responsibility**: Abstract Local Storage operations

**Interface**:
```javascript
const StorageManager = {
  KEYS: {
    TASKS: 'productivity-dashboard-tasks',
    LINKS: 'productivity-dashboard-links',
    USER_NAME: 'productivity-dashboard-user-name',
    THEME: 'productivity-dashboard-theme'
  },
  
  getTasks()
  saveTasks(tasks)
  getLinks()
  saveLinks(links)
  getUserName()
  saveUserName(name)
  getTheme()
  saveTheme(theme)
  clear()
}
```

**Key Behaviors**:
- Handles JSON serialization/deserialization
- Provides error handling for storage quota exceeded
- Uses namespaced keys to avoid conflicts
- Returns empty arrays/null if no data exists or parsing fails

## Data Models

### Task Model

```javascript
{
  id: string,           // Format: "task-{timestamp}-{random}"
  text: string,         // Min: 1, Max: 500 characters
  completed: boolean,   // Default: false
  createdAt: number,    // Unix timestamp in milliseconds
  quadrant: string,     // 'new', 'urgent-important', etc.
  order: number         // Position within quadrant
}
```

**Validation Rules**:
- `text`: Must be non-empty after trimming whitespace
- `text`: Maximum 500 characters
- `quadrant`: Must be one of the five valid quadrant names
- `order`: Used for maintaining position within quadrant

### Link Model

```javascript
{
  id: string,           // Format: "link-{timestamp}-{random}"
  name: string,         // Min: 1, Max: 100 characters
  url: string,          // Must be valid URL with http/https
  createdAt: number     // Unix timestamp in milliseconds
}
```

**Validation Rules**:
- `name`: Must be non-empty after trimming whitespace
- `name`: Maximum 100 characters
- `url`: Must match pattern: `^https?:\/\/.+`
- `url`: Maximum 2000 characters

### Local Storage Schema

**Storage Key**: `productivity-dashboard-tasks`
```json
[
  {
    "id": "task-1234567890-abc",
    "text": "Complete project documentation",
    "completed": false,
    "createdAt": 1234567890000,
    "quadrant": "urgent-important",
    "order": 0
  }
]
```

**Storage Key**: `productivity-dashboard-links`
```json
[
  {
    "id": "link-1234567890-xyz",
    "name": "GitHub",
    "url": "https://github.com",
    "createdAt": 1234567890000
  }
]
```

**Storage Key**: `productivity-dashboard-user-name`
```
"John Doe"
```

**Storage Key**: `productivity-dashboard-theme`
```
"light" or "dark"
```

### Time and Greeting Logic

**Greeting Mapping**:
```javascript
{
  "5:00 AM - 11:59 AM": "Good morning, [Name]",
  "12:00 PM - 4:59 PM": "Good afternoon, [Name]",
  "5:00 PM - 8:59 PM": "Good evening, [Name]",
  "9:00 PM - 4:59 AM": "Good night, [Name]"
}
```

## Visual Design

### Layout

**Grid Structure**:
- Greeting section: Full width, reduced height (0.5rem padding)
- Main content: 2:8 column ratio (left:right)
- Left column: Timer on top, Quick Links below
- Right column: Tasks with Eisenhower Matrix

**Greeting Section**:
- Horizontal layout: Greeting on left, Time on right
- Both in bold font
- Centered alignment
- 3rem gap between greeting and time

**Timer Controls**:
- 3-column grid layout (equal widths)
- Emoji buttons: ▶️ ⏸️ 🔄
- 0.5rem gap between buttons

**Eisenhower Matrix**:
- 2x2 grid layout
- Color-coded borders:
  - Urgent & Important: Red (#dc3545)
  - Urgent & Unimportant: Orange (#ff9800)
  - Not Urgent & Important: Blue (#2196f3)
  - Not Urgent & Unimportant: Gray (#9e9e9e)
- Staging area above matrix (full width)

### Theme Colors

**Light Theme** (Default):
```css
--primary-color: #4a90e2
--secondary-color: #f5f7fa
--text-color: #333333
--text-light: #666666
--border-color: #e0e0e0
--background: #ffffff
```

**Dark Theme**:
```css
--primary-color: #5ba3f5
--secondary-color: #2a2a2a
--text-color: #e0e0e0
--text-light: #b0b0b0
--border-color: #404040
--background: #1e1e1e
body background: #121212
```

### Interactive Elements

**Theme Toggle Button**:
- Fixed position: top-right corner (2rem from edges)
- 50px diameter circle
- Emoji: ☀️ (light mode) or 🌙 (dark mode)
- Hover: Scale 1.1, enhanced shadow
- Z-index: 999

**Drag and Drop**:
- Dragging task: 0.5 opacity, grabbing cursor
- Drag over quadrant: Light blue background, thicker border
- Visual feedback for drop position

**Modals**:
- Semi-transparent backdrop (rgba(0, 0, 0, 0.5))
- Centered content with slide-in animation
- Blur effect on background for name prompt
- Close on X, Cancel, outside click, or Escape key

## Error Handling

### Local Storage Errors

**Quota Exceeded**:
- Display: "Storage limit reached. Please delete some tasks or links."
- Prevent operation from completing
- Log error to console

**Storage Unavailable**:
- Display warning: "Local Storage is unavailable. Your data will not be saved."
- Allow application to function without persistence
- Gracefully degrade to in-memory storage

**Corrupted Data**:
- Wrap JSON.parse in try-catch
- Return empty array/null on parse failure
- Clear corrupted data from storage
- Log error to console

### Input Validation Errors

**Task Validation**:
- Empty/whitespace: "Task cannot be empty"
- Too long (>500 chars): "Task must be 500 characters or less"
- Display error near input field
- Prevent form submission

**Link Validation**:
- Empty name: "Link name cannot be empty"
- Empty URL: "URL cannot be empty"
- Invalid URL: "Please enter a valid URL starting with http:// or https://"
- Too long (>2000 chars): "URL must be 2000 characters or less"
- Display errors near respective fields

**Name Validation**:
- Empty name: Prevent submission, require non-empty input
- Display error in modal

### Drag and Drop Errors

**Invalid Drop Target**:
- Only allow drops on valid quadrant elements
- Ignore drops outside quadrant areas
- Maintain task in original position if drop fails

## Performance Optimizations

### DOM Manipulation

- Use DocumentFragment for batch updates
- Minimize reflows by batching DOM changes
- Use event delegation for task and link lists
- CSS containment for isolated components

### Event Handling

- Debounce drag events for smooth performance
- Use passive event listeners where appropriate
- Remove event listeners on component destroy

### Storage Operations

- Batch storage writes when possible
- Avoid unnecessary serialization
- Cache parsed data in memory

### Rendering

- Only re-render affected quadrants on task move
- Use CSS transforms for drag animations
- Avoid layout thrashing during drag operations

## Accessibility

### Keyboard Navigation

- All interactive elements keyboard accessible
- Tab order follows logical flow
- Enter/Space activate buttons
- Escape closes modals
- Arrow keys for future enhancement (task navigation)

### Screen Reader Support

- Semantic HTML elements (section, button, form, etc.)
- ARIA labels for all buttons and inputs
- ARIA live regions for dynamic content updates
- ARIA modal attributes for dialogs

### Visual Accessibility

- Sufficient color contrast (WCAG AA)
- Focus indicators on all interactive elements
- No reliance on color alone for information
- Readable font sizes (minimum 14px)
- Both light and dark themes meet contrast requirements

### Motion and Animation

- Respect prefers-reduced-motion media query
- Provide instant feedback option
- Smooth but not excessive animations
