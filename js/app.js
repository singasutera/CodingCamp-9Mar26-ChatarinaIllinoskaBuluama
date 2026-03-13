/**
 * Productivity Dashboard
 * A client-side productivity application with greeting display, focus timer,
 * task management, and quick links functionality.
 */

/**
 * StorageManager Module
 * Provides abstraction layer for Local Storage operations with error handling
 */
const StorageManager = {
  KEYS: {
    TASKS: 'productivity-dashboard-tasks',
    LINKS: 'productivity-dashboard-links',
    USER_NAME: 'productivity-dashboard-user-name',
    THEME: 'productivity-dashboard-theme'
  },

  /**
   * Retrieve tasks from Local Storage
   * @returns {Array} Array of task objects, or empty array if none exist or on error
   */
  getTasks() {
    try {
      const data = localStorage.getItem(this.KEYS.TASKS);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem(this.KEYS.TASKS);
      } catch (e) {
        console.error('Failed to clear corrupted task data:', e);
      }
      return [];
    }
  },

  /**
   * Save tasks to Local Storage
   * @param {Array} tasks - Array of task objects to save
   * @returns {Object} Result object with success boolean and optional error message
   */
  saveTasks(tasks) {
    try {
      const data = JSON.stringify(tasks);
      localStorage.setItem(this.KEYS.TASKS, data);
      return { success: true };
    } catch (error) {
      console.error('Failed to save tasks to storage:', error);
      
      if (error.name === 'QuotaExceededError') {
        return {
          success: false,
          error: 'Storage limit reached. Please delete some tasks or links.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to save tasks. Please try again.'
      };
    }
  },

  /**
   * Retrieve links from Local Storage
   * @returns {Array} Array of link objects, or empty array if none exist or on error
   */
  getLinks() {
    try {
      const data = localStorage.getItem(this.KEYS.LINKS);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load links from storage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem(this.KEYS.LINKS);
      } catch (e) {
        console.error('Failed to clear corrupted link data:', e);
      }
      return [];
    }
  },

  /**
   * Save links to Local Storage
   * @param {Array} links - Array of link objects to save
   * @returns {Object} Result object with success boolean and optional error message
   */
  saveLinks(links) {
    try {
      const data = JSON.stringify(links);
      localStorage.setItem(this.KEYS.LINKS, data);
      return { success: true };
    } catch (error) {
      console.error('Failed to save links to storage:', error);
      
      if (error.name === 'QuotaExceededError') {
        return {
          success: false,
          error: 'Storage limit reached. Please delete some tasks or links.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to save links. Please try again.'
      };
    }
  },

  /**
   * Clear all stored data (useful for testing and reset)
   */
  clear() {
    try {
      localStorage.removeItem(this.KEYS.TASKS);
      localStorage.removeItem(this.KEYS.LINKS);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return { success: false, error: 'Failed to clear storage.' };
    }
  },

  /**
   * Get user name from Local Storage
   * @returns {string|null} User name or null if not set
   */
  getUserName() {
    try {
      return localStorage.getItem(this.KEYS.USER_NAME);
    } catch (error) {
      console.error('Failed to load user name:', error);
      return null;
    }
  },

  /**
   * Save user name to Local Storage
   * @param {string} name - User name to save
   * @returns {Object} Result object with success boolean
   */
  saveUserName(name) {
    try {
      localStorage.setItem(this.KEYS.USER_NAME, name);
      return { success: true };
    } catch (error) {
      console.error('Failed to save user name:', error);
      return { success: false };
    }
  },

  /**
   * Get theme preference from Local Storage
   * @returns {string} Theme preference ('light' or 'dark')
   */
  getTheme() {
    try {
      return localStorage.getItem(this.KEYS.THEME) || 'light';
    } catch (error) {
      console.error('Failed to load theme:', error);
      return 'light';
    }
  },

  /**
   * Save theme preference to Local Storage
   * @param {string} theme - Theme preference ('light' or 'dark')
   * @returns {Object} Result object with success boolean
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.KEYS.THEME, theme);
      return { success: true };
    } catch (error) {
      console.error('Failed to save theme:', error);
      return { success: false };
    }
  }
};

/**
 * GreetingDisplay Component
 * Manages the display of current time, date, and time-appropriate greeting
 */
class GreetingDisplay {
  /**
   * @param {HTMLElement} containerElement - The container element for the greeting display
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.greetingElement = null;
    this.timeElement = null;
    this.dateElement = null;
    this.intervalId = null;
    this.userName = '';
  }

  /**
   * Initialize the component and start the time update interval
   */
  init() {
    // Get DOM elements
    this.greetingElement = document.getElementById('greeting-message');
    this.timeElement = document.getElementById('current-time');
    this.dateElement = document.getElementById('current-date');

    if (!this.greetingElement || !this.timeElement) {
      console.error('GreetingDisplay: Required DOM elements not found');
      return;
    }

    // Load user name
    this.userName = StorageManager.getUserName() || '';

    // Initial update
    this.updateTime();

    // Update every second
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  /**
   * Set the user name and update the greeting
   * @param {string} name - The user's name
   */
  setUserName(name) {
    this.userName = name;
    this.updateTime();
  }

  /**
   * Update the time, date, and greeting display
   */
  updateTime() {
    const now = new Date();
    const hour = now.getHours();

    // Update greeting based on time of day with user name
    const greeting = this.getGreeting(hour);
    if (this.greetingElement) {
      this.greetingElement.textContent = greeting;
    }

    // Update time display
    const timeString = this.formatTime(now);
    if (this.timeElement) {
      this.timeElement.textContent = timeString;
      this.timeElement.setAttribute('datetime', now.toISOString());
    }

    // Update date display (if element exists)
    if (this.dateElement) {
      const dateString = this.formatDate(now);
      this.dateElement.textContent = dateString;
      this.dateElement.setAttribute('datetime', now.toISOString().split('T')[0]);
    }
  }

  /**
   * Get the appropriate greeting based on the hour of day
   * @param {number} hour - Hour in 24-hour format (0-23)
   * @returns {string} The appropriate greeting message
   */
  getGreeting(hour) {
    let timeGreeting = '';
    if (hour >= 5 && hour < 12) {
      timeGreeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = "Good evening";
    } else {
      timeGreeting = "Good night";
    }

    // Add user name if available
    if (this.userName) {
      return `${timeGreeting}, ${this.userName}`;
    }
    return timeGreeting;
  }

  /**
   * Format time in 12-hour format with AM/PM
   * @param {Date} date - The date object to format
   * @returns {string} Formatted time string (e.g., "3:45 PM")
   */
  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Pad minutes with leading zero if needed
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
  }

  /**
   * Format date as "Day, Month Date, Year"
   * @param {Date} date - The date object to format
   * @returns {string} Formatted date string (e.g., "Monday, January 1, 2024")
   */
  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;
  }

  /**
   * Clean up the component and stop the interval
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

/**
 * FocusTimer Component
 * Manages a 25-minute Pomodoro countdown timer with start/stop/reset controls
 */
class FocusTimer {
  /**
   * @param {HTMLElement} containerElement - The container element for the focus timer
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.duration = 1500; // 25 minutes in seconds
    this.remaining = 1500;
    this.isRunning = false;
    this.intervalId = null;
    
    // DOM elements
    this.displayElement = null;
    this.startButton = null;
    this.stopButton = null;
    this.resetButton = null;
  }

  /**
   * Initialize the component and set up event listeners
   */
  init() {
    // Get DOM elements
    this.displayElement = document.getElementById('timer-display');
    this.startButton = document.getElementById('timer-start');
    this.stopButton = document.getElementById('timer-stop');
    this.resetButton = document.getElementById('timer-reset');

    if (!this.displayElement || !this.startButton || !this.stopButton || !this.resetButton) {
      console.error('FocusTimer: Required DOM elements not found');
      return;
    }

    // Set up event listeners
    this.startButton.addEventListener('click', () => this.start());
    this.stopButton.addEventListener('click', () => this.stop());
    this.resetButton.addEventListener('click', () => this.reset());

    // Make timer display editable
    this.displayElement.addEventListener('click', () => {
      if (!this.isRunning) {
        this.enableEdit();
      }
    });

    // Initial display update
    this.updateUI();
  }

  /**
   * Enable editing of timer duration
   */
  enableEdit() {
    const currentValue = this.displayElement.textContent;
    this.displayElement.contentEditable = 'true';
    this.displayElement.classList.add('editing');
    this.displayElement.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(this.displayElement);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Handle blur (save)
    const saveEdit = () => {
      this.displayElement.contentEditable = 'false';
      this.displayElement.classList.remove('editing');
      const newValue = this.displayElement.textContent.trim();
      
      // Parse MM:SS format
      const match = newValue.match(/^(\d+):(\d{2})$/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        if (seconds < 60) {
          const totalSeconds = minutes * 60 + seconds;
          this.duration = totalSeconds;
          this.remaining = totalSeconds;
          this.updateUI();
        } else {
          // Invalid seconds, revert
          this.displayElement.textContent = currentValue;
        }
      } else {
        // Invalid format, revert
        this.displayElement.textContent = currentValue;
      }
    };

    this.displayElement.addEventListener('blur', saveEdit, { once: true });
    
    // Handle Enter key
    this.displayElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.displayElement.blur();
      } else if (e.key === 'Escape') {
        this.displayElement.textContent = currentValue;
        this.displayElement.blur();
      }
    }, { once: true });
  }

  /**
   * Start the countdown timer
   */
  start() {
    if (this.isRunning) {
      return; // Already running
    }

    this.isRunning = true;
    this.updateUI();

    // Start the countdown interval
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  /**
   * Stop (pause) the countdown timer
   */
  stop() {
    if (!this.isRunning) {
      return; // Not running
    }

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.updateUI();
  }

  /**
   * Reset the timer to 25 minutes and stop it
   */
  reset() {
    // Stop the timer if running
    if (this.isRunning) {
      this.stop();
    }

    // Reset to initial state
    this.remaining = this.duration;
    this.updateUI();
  }

  /**
   * Countdown logic - called every second when timer is running
   */
  tick() {
    if (this.remaining > 0) {
      this.remaining--;
      this.updateUI();
    } else {
      // Timer completed
      this.stop();
      this.notifyCompletion();
    }
  }

  /**
   * Format seconds as MM:SS display
   * @param {number} seconds - Total seconds to format
   * @returns {string} Formatted time string (e.g., "25:00")
   */
  formatDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Pad with leading zeros
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');
    
    return `${minutesStr}:${secondsStr}`;
  }

  /**
   * Notify user when timer completes
   */
  notifyCompletion() {
    // Display browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Timer Complete!', {
        body: 'Your 25-minute focus session is complete. Time for a break!',
        icon: '/favicon.ico'
      });
    }

    // Visual notification - could be enhanced with a modal or alert
    alert('Focus Timer Complete! Your 25-minute focus session is complete. Time for a break!');
  }

  /**
   * Update the UI to reflect current timer state
   */
  updateUI() {
    // Update display
    if (this.displayElement) {
      this.displayElement.textContent = this.formatDisplay(this.remaining);
    }

    // Update button states
    if (this.startButton) {
      this.startButton.disabled = this.isRunning;
    }
  }

  /**
   * Clean up the component and stop the timer
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }
}

/**
 * TaskList Component
 * Manages task CRUD operations with Local Storage persistence
 */
class TaskList {
  /**
   * @param {HTMLElement} containerElement - The container element for the task list
   * @param {Object} storageManager - StorageManager instance for persistence
   */
  constructor(containerElement, storageManager) {
    this.container = containerElement;
    this.storage = storageManager;
    this.tasks = [];
    
    // DOM elements
    this.formElement = null;
    this.inputElement = null;
    this.errorElement = null;
    this.emptyMessageElement = null;
    
    // Eisenhower Matrix quadrant elements
    this.quadrants = {
      'new': null,
      'urgent-important': null,
      'urgent-unimportant': null,
      'not-urgent-important': null,
      'not-urgent-unimportant': null
    };
    
    // Drag and drop state
    this.draggedTask = null;
  }

  /**
   * Initialize the component and set up event listeners
   * Uses event delegation for better performance with many tasks
   */
  init() {
    // Get DOM elements
    this.formElement = document.getElementById('task-form');
    this.inputElement = document.getElementById('task-input');
    this.errorElement = document.getElementById('task-error');
    this.emptyMessageElement = document.getElementById('task-empty-message');

    // Get all quadrant elements
    this.quadrants['new'] = document.getElementById('task-items-new');
    this.quadrants['urgent-important'] = document.getElementById('task-items-urgent-important');
    this.quadrants['urgent-unimportant'] = document.getElementById('task-items-urgent-unimportant');
    this.quadrants['not-urgent-important'] = document.getElementById('task-items-not-urgent-important');
    this.quadrants['not-urgent-unimportant'] = document.getElementById('task-items-not-urgent-unimportant');

    if (!this.formElement || !this.inputElement) {
      console.error('TaskList: Required DOM elements not found');
      return;
    }

    // Set up event listener for form submission
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.inputElement.value;
      this.addTask(text);
    });

    // Set up event delegation for all quadrants
    Object.values(this.quadrants).forEach(quadrant => {
      if (!quadrant) return;
      
      quadrant.addEventListener('click', (e) => {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        
        if (!taskItem) return;
        
        const taskId = taskItem.getAttribute('data-task-id');
        
        // Handle checkbox toggle
        if (target.classList.contains('task-checkbox')) {
          this.toggleComplete(taskId);
        }
        // Handle delete button
        else if (target.classList.contains('btn-delete')) {
          this.deleteTask(taskId);
        }
        // Handle task text edit
        else if (target.classList.contains('task-text')) {
          this.handleTaskEdit(taskId, target);
        }
      });

      // Set up drag and drop for each quadrant
      this.setupDragAndDrop(quadrant);
    });

    // Update task section title with date
    this.updateTaskSectionTitle();
    // Update every minute
    setInterval(() => this.updateTaskSectionTitle(), 60000);

    // Load tasks from storage
    this.loadTasks();
  }

  /**
   * Update the task section title with current date
   */
  updateTaskSectionTitle() {
    const titleElement = document.querySelector('.tasks-section h2');
    if (titleElement) {
      const now = new Date();
      const dateString = this.formatDate(now);
      titleElement.textContent = `Tasks - ${dateString}`;
    }
  }

  /**
   * Format date as "Day, Month Date, Year"
   * @param {Date} date - The date object to format
   * @returns {string} Formatted date string (e.g., "Monday, January 1, 2024")
   */
  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;
  }

  /**
   * Set up drag and drop for a quadrant
   */
  setupDragAndDrop(quadrant) {
    quadrant.addEventListener('dragover', (e) => {
      e.preventDefault();
      const container = e.currentTarget.closest('.matrix-quadrant, .new-tasks-area');
      if (container) {
        container.classList.add('drag-over');
      }

      // Get the draggable element being dragged over
      const afterElement = this.getDragAfterElement(quadrant, e.clientY);
      const draggingElement = document.querySelector('.dragging');
      
      if (afterElement == null) {
        quadrant.appendChild(draggingElement);
      } else {
        quadrant.insertBefore(draggingElement, afterElement);
      }
    });

    quadrant.addEventListener('dragleave', (e) => {
      const container = e.currentTarget.closest('.matrix-quadrant, .new-tasks-area');
      if (container && !container.contains(e.relatedTarget)) {
        container.classList.remove('drag-over');
      }
    });

    quadrant.addEventListener('drop', (e) => {
      e.preventDefault();
      const container = e.currentTarget.closest('.matrix-quadrant, .new-tasks-area');
      if (container) {
        container.classList.remove('drag-over');
      }
      
      if (this.draggedTask) {
        const targetQuadrant = e.currentTarget.getAttribute('data-quadrant');
        this.moveTaskToQuadrant(this.draggedTask, targetQuadrant);
        this.draggedTask = null;
      }
    });
  }

  /**
   * Get the element that should come after the dragged element
   * @param {HTMLElement} container - The container element
   * @param {number} y - The Y coordinate of the mouse
   * @returns {HTMLElement|null} The element after which to insert
   */
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  /**
   * Move a task to a different quadrant and update order
   */
  moveTaskToQuadrant(taskId, targetQuadrant) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update quadrant
    task.quadrant = targetQuadrant;

    // Update order based on current DOM position
    const quadrantElement = this.quadrants[targetQuadrant];
    if (quadrantElement) {
      const taskElements = [...quadrantElement.querySelectorAll('.task-item')];
      taskElements.forEach((el, index) => {
        const id = el.getAttribute('data-task-id');
        const t = this.tasks.find(task => task.id === id);
        if (t) {
          t.order = index;
        }
      });
    }

    this.storage.saveTasks(this.tasks);
    this.renderTasks();
  }

  /**
   * Load tasks from Local Storage
   */
  loadTasks() {
    this.tasks = this.storage.getTasks();
    this.renderTasks();
  }
  /**
   * Validate task input text
   * @param {string} text - The task text to validate
   * @returns {Object} Result object with valid boolean and optional error message
   */
  validateTaskInput(text) {
    const trimmedText = text.trim();

    // Check for empty or whitespace-only input
    if (!trimmedText) {
      return { valid: false, error: 'Task cannot be empty' };
    }

    // Check maximum character limit
    if (trimmedText.length > 500) {
      return { valid: false, error: 'Task must be 500 characters or less' };
    }

    return { valid: true, text: trimmedText };
  }

  /**
   * Add a new task
   * @param {string} text - The task text
   * @returns {Object} Result object with success boolean and optional error message
   */
  addTask(text) {
    // Clear any previous error messages
    if (this.errorElement) {
      this.errorElement.textContent = '';
    }

    // Validate input using dedicated validation method
    const validation = this.validateTaskInput(text);
    if (!validation.valid) {
      if (this.errorElement) {
        this.errorElement.textContent = validation.error;
      }
      return { success: false, error: validation.error };
    }

    // Create new task object with quadrant property
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const task = {
      id: `task-${timestamp}-${random}`,
      text: validation.text,
      completed: false,
      createdAt: timestamp,
      quadrant: 'new', // New tasks start in the staging area
      order: this.tasks.filter(t => t.quadrant === 'new').length // Add to end of new tasks
    };

    // Add to tasks array
    this.tasks.push(task);

    // Save to storage
    const saveResult = this.storage.saveTasks(this.tasks);
    if (!saveResult.success) {
      // Rollback on save failure
      this.tasks.pop();
      if (this.errorElement) {
        this.errorElement.textContent = saveResult.error;
      }
      return saveResult;
    }

    // Clear input and render
    if (this.inputElement) {
      this.inputElement.value = '';
    }
    this.renderTasks();

    return { success: true };
  }

  /**
   * Edit an existing task
   * @param {string} id - The task ID
   * @param {string} newText - The new task text
   * @returns {Object} Result object with success boolean and optional error message
   */
  editTask(id, newText) {
    // Validate input using dedicated validation method
    const validation = this.validateTaskInput(newText);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Find task by ID
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    // Update task text (preserve ID and createdAt)
    task.text = validation.text;

    // Save to storage
    const saveResult = this.storage.saveTasks(this.tasks);
    if (!saveResult.success) {
      return saveResult;
    }

    // Re-render
    this.renderTasks();

    return { success: true };
  }

  /**
   * Delete a task
   * @param {string} id - The task ID to delete
   * @returns {Object} Result object with success boolean and optional error message
   */
  deleteTask(id) {
    // Find task index
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return { success: false, error: 'Task not found' };
    }

    // Remove task
    this.tasks.splice(index, 1);

    // Save to storage
    const saveResult = this.storage.saveTasks(this.tasks);
    if (!saveResult.success) {
      return saveResult;
    }

    // Re-render
    this.renderTasks();

    return { success: true };
  }

  /**
   * Toggle task completion status
   * @param {string} id - The task ID to toggle
   * @returns {Object} Result object with success boolean and optional error message
   */
  toggleComplete(id) {
    // Find task by ID
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    // Toggle completion status
    task.completed = !task.completed;

    // If task is now completed, move it to the end of its quadrant
    if (task.completed) {
      const quadrantTasks = this.tasks.filter(t => t.quadrant === task.quadrant);
      const maxOrder = Math.max(...quadrantTasks.map(t => t.order || 0), -1);
      task.order = maxOrder + 1;
    }

    // Save to storage
    const saveResult = this.storage.saveTasks(this.tasks);
    if (!saveResult.success) {
      return saveResult;
    }

    // Re-render
    this.renderTasks();

    return { success: true };
  }

  /**
   * Render the task list to the DOM
   * Optimized to use DocumentFragment for batch DOM updates
   * Renders tasks into their respective quadrants
   */
  renderTasks() {
    // Show/hide empty message
    if (this.emptyMessageElement) {
      if (this.tasks.length === 0) {
        this.emptyMessageElement.style.display = 'block';
        // Clear all quadrants
        Object.values(this.quadrants).forEach(quadrant => {
          if (quadrant) quadrant.innerHTML = '';
        });
        return;
      } else {
        this.emptyMessageElement.style.display = 'none';
      }
    }

    // Group tasks by quadrant
    const tasksByQuadrant = {
      'new': [],
      'urgent-important': [],
      'urgent-unimportant': [],
      'not-urgent-important': [],
      'not-urgent-unimportant': []
    };

    // Group tasks by their quadrant (default to 'new' if not set)
    this.tasks.forEach(task => {
      const quadrant = task.quadrant || 'new';
      if (tasksByQuadrant[quadrant]) {
        tasksByQuadrant[quadrant].push(task);
      } else {
        tasksByQuadrant['new'].push(task);
      }
    });

    // Render tasks in each quadrant
    Object.keys(tasksByQuadrant).forEach(quadrantKey => {
      const quadrantElement = this.quadrants[quadrantKey];
      if (!quadrantElement) return;

      const tasks = tasksByQuadrant[quadrantKey];
      
      // Sort tasks: incomplete first (by order), then completed (by order)
      const sortedTasks = tasks.sort((a, b) => {
        // Completed tasks always go to the end
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Within same completion status, sort by order (or createdAt if no order)
        const orderA = a.order !== undefined ? a.order : a.createdAt;
        const orderB = b.order !== undefined ? b.order : b.createdAt;
        return orderA - orderB;
      });
      
      // Use DocumentFragment for efficient batch DOM updates
      const fragment = document.createDocumentFragment();

      sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-task-id', task.id);
        li.setAttribute('draggable', 'true');
        if (task.completed) {
          li.classList.add('completed');
        }

        // Add drag event handlers
        li.addEventListener('dragstart', (e) => {
          this.draggedTask = task.id;
          li.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        li.addEventListener('dragend', (e) => {
          li.classList.remove('dragging');
        });

        // Task checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);

        // Task text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = '×';
        deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);

        // Assemble task item
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        fragment.appendChild(li);
      });

      // Single DOM update per quadrant
      quadrantElement.innerHTML = '';
      quadrantElement.appendChild(fragment);
    });
  }

  /**
   * Handle inline task editing
   * @param {string} id - The task ID
   * @param {HTMLElement} textElement - The text span element
   */
  handleTaskEdit(id, textElement) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return;
    }

    // Create input for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    input.maxLength = 500;

    // Replace text with input
    textElement.replaceWith(input);
    input.focus();
    input.select();

    // Handle save on blur or Enter key
    const saveEdit = () => {
      const newText = input.value;
      const result = this.editTask(id, newText);
      
      if (!result.success && this.errorElement) {
        this.errorElement.textContent = result.error;
        // Re-render to restore original state
        this.renderTasks();
      }
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      } else if (e.key === 'Escape') {
        // Cancel edit
        this.renderTasks();
      }
    });
  }
}

/**
 * QuickLinks Component
 * Manages quick link CRUD operations with Local Storage persistence
 */
class QuickLinks {
  /**
   * @param {HTMLElement} containerElement - The container element for the quick links
   * @param {Object} storageManager - StorageManager instance for persistence
   */
  constructor(containerElement, storageManager) {
    this.container = containerElement;
    this.storage = storageManager;
    this.links = [];
    
    // DOM elements
    this.formElement = null;
    this.nameInputElement = null;
    this.urlInputElement = null;
    this.errorElement = null;
    this.listElement = null;
    this.emptyMessageElement = null;
  }

  /**
   * Initialize the component and set up event listeners
   * Uses event delegation for better performance with many links
   */
  init() {
    // Get DOM elements
    this.formElement = document.getElementById('link-form');
    this.nameInputElement = document.getElementById('link-name-input');
    this.urlInputElement = document.getElementById('link-url-input');
    this.errorElement = document.getElementById('link-error');
    this.listElement = document.getElementById('link-items');
    this.emptyMessageElement = document.getElementById('link-empty-message');
    this.modal = document.getElementById('link-modal');
    this.addButton = document.getElementById('btn-add-link');
    this.closeButton = document.getElementById('modal-close');
    this.cancelButton = document.getElementById('modal-cancel');

    if (!this.formElement || !this.nameInputElement || !this.urlInputElement || !this.listElement) {
      console.error('QuickLinks: Required DOM elements not found');
      return;
    }

    // Set up event listener for opening modal
    if (this.addButton) {
      this.addButton.addEventListener('click', () => this.openModal());
    }

    // Set up event listeners for closing modal
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.closeModal());
    }
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => this.closeModal());
    }

    // Close modal when clicking outside
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });

    // Set up event listener for form submission
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.nameInputElement.value;
      const url = this.urlInputElement.value;
      const result = this.addLink(name, url);
      
      // Close modal on successful add
      if (result.success) {
        this.closeModal();
      }
    });

    // Use event delegation for link list interactions
    this.listElement.addEventListener('click', (e) => {
      const target = e.target;
      const linkItem = target.closest('.link-item');
      
      if (!linkItem) return;
      
      const linkId = linkItem.getAttribute('data-link-id');
      
      // Handle link button click
      if (target.classList.contains('btn-link')) {
        const url = linkItem.getAttribute('data-link-url');
        this.openLink(url);
      }
      // Handle delete button
      else if (target.classList.contains('btn-delete')) {
        this.deleteLink(linkId);
      }
    });

    // Load links from storage
    this.loadLinks();
  }

  /**
   * Open the add link modal
   */
  openModal() {
    if (this.modal) {
      this.modal.classList.add('show');
      // Clear form and errors
      if (this.nameInputElement) this.nameInputElement.value = '';
      if (this.urlInputElement) this.urlInputElement.value = '';
      if (this.errorElement) this.errorElement.textContent = '';
      // Focus on first input
      if (this.nameInputElement) {
        setTimeout(() => this.nameInputElement.focus(), 100);
      }
    }
  }

  /**
   * Close the add link modal
   */
  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('show');
    }
  }

  /**
   * Load links from Local Storage
   */
  loadLinks() {
    this.links = this.storage.getLinks();
    this.renderLinks();
  }

  /**
   * Validate link input (name and URL)
   * @param {string} name - The link name to validate
   * @param {string} url - The link URL to validate
   * @returns {Object} Result object with valid boolean and optional error message
   */
  validateLinkInput(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    // Validate name
    if (!trimmedName) {
      return { valid: false, error: 'Link name cannot be empty' };
    }

    if (trimmedName.length > 100) {
      return { valid: false, error: 'Link name must be 100 characters or less' };
    }

    // Validate URL
    if (!trimmedUrl) {
      return { valid: false, error: 'URL cannot be empty' };
    }

    if (trimmedUrl.length > 2000) {
      return { valid: false, error: 'URL must be 2000 characters or less' };
    }

    const urlValidation = this.validateURL(trimmedUrl);
    if (!urlValidation.valid) {
      return urlValidation;
    }

    return { valid: true };
  }

  /**
   * Validate URL format
   * @param {string} url - The URL to validate
   * @returns {Object} Result object with valid boolean and optional error message
   */
  validateURL(url) {
    const urlPattern = /^https?:\/\/.+/;
    
    if (!urlPattern.test(url)) {
      return { 
        valid: false, 
        error: 'Please enter a valid URL starting with http:// or https://' 
      };
    }

    return { valid: true };
  }

  /**
   * Add a new link
   * @param {string} name - The link name
   * @param {string} url - The link URL
   * @returns {Object} Result object with success boolean and optional error message
   */
  addLink(name, url) {
    // Clear any previous error messages
    if (this.errorElement) {
      this.errorElement.textContent = '';
    }

    // Validate input using the new validation method
    const validation = this.validateLinkInput(name, url);
    if (!validation.valid) {
      if (this.errorElement) {
        this.errorElement.textContent = validation.error;
      }
      return { success: false, error: validation.error };
    }

    // Get trimmed values
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    // Create new link object
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const link = {
      id: `link-${timestamp}-${random}`,
      name: trimmedName,
      url: trimmedUrl,
      createdAt: timestamp
    };

    // Add to links array
    this.links.push(link);

    // Save to storage
    const saveResult = this.storage.saveLinks(this.links);
    if (!saveResult.success) {
      // Rollback on save failure
      this.links.pop();
      if (this.errorElement) {
        this.errorElement.textContent = saveResult.error;
      }
      return saveResult;
    }

    // Clear inputs and render
    if (this.nameInputElement) {
      this.nameInputElement.value = '';
    }
    if (this.urlInputElement) {
      this.urlInputElement.value = '';
    }
    this.renderLinks();

    return { success: true };
  }

  /**
   * Delete a link
   * @param {string} id - The link ID to delete
   * @returns {Object} Result object with success boolean and optional error message
   */
  deleteLink(id) {
    // Find link index
    const index = this.links.findIndex(l => l.id === id);
    if (index === -1) {
      return { success: false, error: 'Link not found' };
    }

    // Remove link
    this.links.splice(index, 1);

    // Save to storage
    const saveResult = this.storage.saveLinks(this.links);
    if (!saveResult.success) {
      return saveResult;
    }

    // Re-render
    this.renderLinks();

    return { success: true };
  }

  /**
   * Render the link list to the DOM
   * Optimized to use DocumentFragment for batch DOM updates
   */
  renderLinks() {
    if (!this.listElement) {
      return;
    }

    // Show/hide empty message
    if (this.emptyMessageElement) {
      if (this.links.length === 0) {
        this.emptyMessageElement.style.display = 'block';
        this.listElement.innerHTML = '';
        return;
      } else {
        this.emptyMessageElement.style.display = 'none';
      }
    }

    // Sort links by creation time (earliest first)
    const sortedLinks = [...this.links].sort((a, b) => a.createdAt - b.createdAt);

    // Use DocumentFragment for efficient batch DOM updates
    const fragment = document.createDocumentFragment();

    // Render each link
    sortedLinks.forEach(link => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      linkItem.setAttribute('data-link-id', link.id);
      linkItem.setAttribute('data-link-url', link.url);

      // Link button
      const linkButton = document.createElement('button');
      linkButton.type = 'button';
      linkButton.className = 'btn btn-link';
      linkButton.textContent = link.name;
      linkButton.setAttribute('aria-label', `Open ${link.name}`);

      // Delete button with X
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-delete';
      deleteBtn.textContent = '×';
      deleteBtn.setAttribute('aria-label', `Delete link "${link.name}"`);

      // Assemble link item
      linkItem.appendChild(linkButton);
      linkItem.appendChild(deleteBtn);

      fragment.appendChild(linkItem);
    });

    // Single DOM update
    this.listElement.innerHTML = '';
    this.listElement.appendChild(fragment);
  }

  /**
   * Open a link in a new tab
   * @param {string} url - The URL to open
   */
  openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

console.log('Productivity Dashboard loaded');

/**
 * ThemeManager
 * Manages dark/light theme switching
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.toggleButton = null;
  }

  init() {
    // Load saved theme
    this.currentTheme = StorageManager.getTheme();
    this.applyTheme(this.currentTheme);

    // Create theme toggle button
    this.createToggleButton();
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle dark/light mode');
    button.innerHTML = this.currentTheme === 'light' ? '☀️' : '🌙';
    
    button.addEventListener('click', () => this.toggleTheme());
    
    document.body.appendChild(button);
    this.toggleButton = button;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    StorageManager.saveTheme(this.currentTheme);
    
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.currentTheme === 'light' ? '☀️' : '🌙';
    }
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}

/**
 * NamePrompt
 * Prompts user for their name on first visit
 */
class NamePrompt {
  constructor() {
    this.modal = null;
    this.input = null;
    this.greetingDisplay = null;
  }

  init(greetingDisplay) {
    this.greetingDisplay = greetingDisplay;
    
    // Check if user name is already saved
    const savedName = StorageManager.getUserName();
    if (savedName) {
      this.greetingDisplay.setUserName(savedName);
      return;
    }

    // Show name prompt modal
    this.showPrompt();
  }

  showPrompt() {
    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal show name-prompt-modal';
    this.modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Welcome!</h3>
        </div>
        <form class="name-prompt-form" id="name-prompt-form">
          <div class="link-form-group">
            <label for="name-prompt-input">What's your name?</label>
            <input 
              type="text" 
              id="name-prompt-input" 
              class="link-input" 
              placeholder="Enter your name"
              maxlength="50"
              required
              autofocus
            >
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Continue</button>
          </div>
        </form>
      </div>
    `;

    // Blur background
    document.querySelector('.dashboard').classList.add('blurred');

    document.body.appendChild(this.modal);

    // Get form and input
    const form = document.getElementById('name-prompt-form');
    this.input = document.getElementById('name-prompt-input');

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.input.value.trim();
      if (name) {
        StorageManager.saveUserName(name);
        this.greetingDisplay.setUserName(name);
        this.closePrompt();
      }
    });

    // Focus input
    setTimeout(() => this.input.focus(), 100);
  }

  closePrompt() {
    if (this.modal) {
      this.modal.remove();
      document.querySelector('.dashboard').classList.remove('blurred');
    }
  }
}

/**
 * Application Initialization
 * Initialize all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Productivity Dashboard...');

  // Check for Local Storage availability
  if (typeof Storage === 'undefined') {
    console.warn('Local Storage is unavailable. Your data will not be saved.');
    // Display warning to user
    const warningDiv = document.createElement('div');
    warningDiv.className = 'storage-warning';
    warningDiv.textContent = 'Local Storage is unavailable. Your data will not be saved.';
    warningDiv.setAttribute('role', 'alert');
    document.body.insertBefore(warningDiv, document.body.firstChild);
  }

  // Initialize ThemeManager
  const themeManager = new ThemeManager();
  themeManager.init();
  console.log('ThemeManager initialized');

  // Initialize GreetingDisplay component
  let greetingDisplay = null;
  const greetingSection = document.querySelector('.greeting-section');
  if (greetingSection) {
    greetingDisplay = new GreetingDisplay(greetingSection);
    greetingDisplay.init();
    console.log('GreetingDisplay initialized');
  }

  // Initialize NamePrompt
  if (greetingDisplay) {
    const namePrompt = new NamePrompt();
    namePrompt.init(greetingDisplay);
    console.log('NamePrompt initialized');
  }

  // Initialize FocusTimer component
  const timerSection = document.querySelector('.timer-section');
  if (timerSection) {
    const focusTimer = new FocusTimer(timerSection);
    focusTimer.init();
    console.log('FocusTimer initialized');
  }

  // Initialize TaskList component
  const tasksSection = document.querySelector('.tasks-section');
  if (tasksSection) {
    const taskList = new TaskList(tasksSection, StorageManager);
    taskList.init();
    console.log('TaskList initialized');
  }

  // Initialize QuickLinks component
  const linksSection = document.querySelector('.links-section');
  if (linksSection) {
    const quickLinks = new QuickLinks(linksSection, StorageManager);
    quickLinks.init();
    console.log('QuickLinks initialized');
  }

  console.log('Productivity Dashboard initialized successfully');
});
