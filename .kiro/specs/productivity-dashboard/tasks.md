# Implementation Plan: Productivity Dashboard

## Overview

This implementation plan creates a single-page productivity dashboard using vanilla JavaScript, HTML, and CSS. The application is entirely client-side with Local Storage persistence. Following the user's constraint, all CSS will be in a single file (css/styles.css) and all JavaScript in a single file (js/app.js). The implementation follows a component-based architecture with five main components: GreetingDisplay, FocusTimer, TaskList, QuickLinks, and StorageManager.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create index.html with semantic HTML structure for all components
  - Create css/ folder with styles.css file
  - Create js/ folder with app.js file
  - Include meta tags for viewport and charset
  - Link CSS and JavaScript files
  - _Requirements: 7.5, 9.1, 9.4, 9.5_

- [x] 2. Implement StorageManager module
  - [x] 2.1 Create StorageManager with Local Storage abstraction
    - Implement getTasks() and saveTasks() methods
    - Implement getLinks() and saveLinks() methods
    - Add JSON serialization/deserialization with error handling
    - Use namespaced keys: 'productivity-dashboard-tasks' and 'productivity-dashboard-links'
    - Handle storage quota exceeded errors
    - Handle corrupted data with try-catch on JSON.parse
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 2.2 Write property test for StorageManager persistence
    - **Property 11: Task Persistence Round Trip**
    - **Property 15: Link Persistence Round Trip**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.3, 6.4**

- [x] 3. Implement GreetingDisplay component
  - [x] 3.1 Create GreetingDisplay class with time and date display
    - Implement constructor and init() method
    - Implement updateTime() method with setInterval (1 second)
    - Implement getGreeting(hour) with time-based logic
    - Implement formatTime() for 12-hour format display
    - Implement formatDate() for "Day, Month Date, Year" format
    - Update DOM elements with current time, date, and greeting
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 3.2 Write property tests for GreetingDisplay
    - **Property 1: Time Format Contains Required Components**
    - **Property 2: Date Format Contains Required Components**
    - **Property 3: Greeting Matches Time of Day**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6**

- [x] 4. Checkpoint - Verify greeting and storage functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement FocusTimer component
  - [x] 5.1 Create FocusTimer class with countdown logic
    - Implement constructor with initial state (1500 seconds, not running)
    - Implement start() method to begin countdown
    - Implement stop() method to pause countdown
    - Implement reset() method to return to 25 minutes
    - Implement tick() method for countdown logic
    - Implement formatDisplay() to show MM:SS format
    - Implement notifyCompletion() for timer completion
    - Update UI to disable start button while running
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 5.2 Write property tests for FocusTimer
    - **Property 4: Timer Reset Returns to Initial State**
    - **Property 5: Running Timer Disables Start Button**
    - **Validates: Requirements 2.5, 2.7**

- [x] 6. Implement TaskList component
  - [x] 6.1 Create TaskList class with CRUD operations
    - Implement constructor with StorageManager dependency
    - Implement init() and loadTasks() methods
    - Implement addTask(text) with ID generation (task-{timestamp}-{random})
    - Implement editTask(id, newText) preserving ID and timestamp
    - Implement deleteTask(id) to remove task
    - Implement toggleComplete(id) to flip completion status
    - Implement renderTasks() to update DOM with task list
    - Display empty state message when no tasks exist
    - Maintain creation order based on createdAt timestamps
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 6.2 Write property tests for TaskList operations
    - **Property 6: Task Addition Increases List Size**
    - **Property 7: Task Edit Updates Task Text**
    - **Property 8: Task Toggle Changes Completion Status**
    - **Property 9: Task Deletion Removes Task**
    - **Property 10: Task Order Preserved by Creation Time**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 7. Implement input validation for TaskList
  - [x] 7.1 Add validateTaskInput() method
    - Reject empty or whitespace-only input
    - Enforce maximum 500 character limit
    - Return descriptive error messages
    - Display error messages in UI near input field
    - Prevent form submission on validation failure
    - _Requirements: 10.1, 10.5_

  - [ ]* 7.2 Write property tests for task validation
    - **Property 16: Empty Task Input Rejected**
    - **Property 20: Validation Errors Return Error Messages**
    - **Validates: Requirements 10.1, 10.5**

- [x] 8. Checkpoint - Verify timer and task functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement QuickLinks component
  - [x] 9.1 Create QuickLinks class with link management
    - Implement constructor with StorageManager dependency
    - Implement init() and loadLinks() methods
    - Implement addLink(name, url) with ID generation (link-{timestamp}-{random})
    - Implement deleteLink(id) to remove link
    - Implement renderLinks() to update DOM with link buttons
    - Implement openLink(url) with window.open in new tab (noopener, noreferrer)
    - Display empty state message when no links exist
    - Maintain creation order based on createdAt timestamps
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 9.2 Write property tests for QuickLinks operations
    - **Property 12: Link Addition Increases List Size**
    - **Property 13: Link Click Opens Correct URL**
    - **Property 14: Link Deletion Removes Link**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 10. Implement input validation for QuickLinks
  - [x] 10.1 Add validateLinkInput() and validateURL() methods
    - Reject empty or whitespace-only name input
    - Reject empty or whitespace-only URL input
    - Validate URL format matches ^https?:\/\/.+
    - Enforce maximum 100 characters for name
    - Enforce maximum 2000 characters for URL
    - Return descriptive error messages for each validation failure
    - Display error messages in UI near input fields
    - Prevent form submission on validation failure
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

  - [ ]* 10.2 Write property tests for link validation
    - **Property 17: Empty Link Name Rejected**
    - **Property 18: Empty Link URL Rejected**
    - **Property 19: Invalid URL Format Rejected**
    - **Property 20: Validation Errors Return Error Messages**
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.5**

- [x] 11. Implement CSS styling
  - [x] 11.1 Create complete styles in css/styles.css
    - Implement consistent color scheme across all components
    - Set minimum 14px font size for body text
    - Add hover states for all interactive elements
    - Create clear visual separation between components using spacing/borders
    - Style all buttons with descriptive labels
    - Add visual feedback for actions (button clicks, task completion)
    - Ensure focus indicators are visible for keyboard navigation
    - Use flexbox/grid for responsive layout
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 12. Wire all components together in app.js
  - [x] 12.1 Initialize application on DOMContentLoaded
    - Instantiate StorageManager
    - Instantiate GreetingDisplay component
    - Instantiate FocusTimer component
    - Instantiate TaskList component with StorageManager
    - Instantiate QuickLinks component with StorageManager
    - Call init() on all components
    - Add event listeners for all user interactions
    - Handle Local Storage unavailable scenario with warning message
    - _Requirements: 4.5, 4.6, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 12.2 Write integration tests
    - Test task CRUD operations persist to storage
    - Test link CRUD operations persist to storage
    - Test timer state changes update UI
    - Test greeting updates with time changes
    - Test error messages display on validation failures
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 10.5_

- [x] 13. Performance optimization and testing
  - [x] 13.1 Optimize for performance requirements
    - Minimize DOM manipulation in render methods
    - Use event delegation where appropriate
    - Test with 100 tasks to ensure responsive performance
    - Test with 50 links to ensure responsive performance
    - Verify initial load time is under 1 second
    - Verify interaction response time is under 100ms
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 14. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All JavaScript code goes in js/app.js (single file constraint)
- All CSS code goes in css/styles.css (single file constraint)
- Each task references specific requirements for traceability
- Property tests use fast-check library with minimum 100 iterations
- The application is entirely client-side with no backend dependencies
- Local Storage provides automatic persistence for all user data
