/**
 * RWCB Dashboard Controller
 * Main orchestration for interactive dashboard
 */

const RWCBDashboard = (function() {
  'use strict';

  // State management
  let state = {
    currentAudience: 'champion',
    indicatorStates: {}, // { indicatorId: activeOptionId }
    currentSection: 'operational'
  };

  const STORAGE_KEY = 'rwcb-dashboard-state';
  const LIVE_REGION_ID = 'dashboard-live-region';

  /**
   * Initialize dashboard
   */
  function init() {
    console.log('RWCB Dashboard initializing...');

    // Load saved state
    loadState();

    // Set up event listeners
    setupEventListeners();

    // Render initial state
    renderInitialState();

    // Create live region for screen readers
    createLiveRegion();

    console.log('RWCB Dashboard initialized', state);
  }

  /**
   * Load state from localStorage
   */
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load saved state:', error);
    }
  }

  /**
   * Save state to localStorage
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Visualization dropdown changes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('view-dropdown')) {
        const card = e.target.closest('.indicator-card');
        const indicatorId = card.dataset.indicator;
        const optionId = e.target.value;
        switchVisualization(indicatorId, optionId);
      }
    });

    // Keep legacy toggle button support
    document.addEventListener('click', handleToggleClick);

    // Audience selector clicks
    document.addEventListener('click', handleAudienceClick);

    // Navigation clicks
    document.addEventListener('click', handleNavigationClick);

    // Keyboard navigation for toggle groups
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Save state before unload
    window.addEventListener('beforeunload', saveState);
  }

  /**
   * Handle visualization toggle clicks
   */
  function handleToggleClick(event) {
    const toggle = event.target.closest('.viz-toggle');
    if (!toggle) return;

    const card = toggle.closest('.indicator-card');
    if (!card) return;

    const indicatorId = card.dataset.indicator;
    const optionId = toggle.dataset.option;

    if (!indicatorId || !optionId) return;

    // Switch visualization
    switchVisualization(indicatorId, optionId);
  }

  /**
   * Handle audience selector clicks
   */
  function handleAudienceClick(event) {
    const audienceBtn = event.target.closest('[data-audience]');
    if (!audienceBtn) return;

    const audience = audienceBtn.dataset.audience;
    if (!audience || audience === state.currentAudience) return;

    // Update audience
    setAudience(audience);
  }

  /**
   * Handle navigation clicks
   */
  function handleNavigationClick(event) {
    const navItem = event.target.closest('[data-section]');
    if (!navItem) return;

    const section = navItem.dataset.section;
    if (!section) return;

    // Navigate to section
    navigateToSection(section);
  }

  /**
   * Handle keyboard navigation within toggle groups
   */
  function handleKeyboardNavigation(event) {
    const toggle = event.target.closest('.viz-toggle');
    if (!toggle) return;

    const toggleGroup = toggle.closest('.viz-toggle-group');
    if (!toggleGroup) return;

    const toggles = Array.from(toggleGroup.querySelectorAll('.viz-toggle'));
    const currentIndex = toggles.indexOf(toggle);

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : toggles.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < toggles.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = toggles.length - 1;
        break;
      default:
        return;
    }

    toggles[newIndex].focus();
  }

  /**
   * Switch visualization for an indicator
   */
  function switchVisualization(indicatorId, optionId) {
    const card = document.querySelector(`[data-indicator="${indicatorId}"]`);
    if (!card) {
      console.warn(`Card not found for indicator: ${indicatorId}`);
      return;
    }

    // Update dropdown select value
    const select = card.querySelector('.view-dropdown');
    if (select) {
      select.value = optionId;
    }

    // Update toggle buttons (legacy support)
    const toggles = card.querySelectorAll('.viz-toggle');
    toggles.forEach(btn => {
      const isActive = btn.dataset.option === optionId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    // Update visualization options
    const vizOptions = card.querySelectorAll('.viz-option');
    vizOptions.forEach(viz => {
      const isActive = viz.dataset.option === optionId;
      viz.setAttribute('aria-hidden', !isActive);
      viz.style.opacity = isActive ? '1' : '0';
      viz.style.pointerEvents = isActive ? 'auto' : 'none';

      if (!isActive) {
        viz.style.position = 'absolute';
      } else {
        viz.style.position = 'relative';
      }
    });

    // Save state
    state.indicatorStates[indicatorId] = optionId;
    saveState();

    // Announce to screen readers
    const optionLabel = select?.querySelector(`option[value="${optionId}"]`)?.textContent ||
                       card.querySelector(`.viz-toggle[data-option="${optionId}"] .toggle-label`)?.textContent ||
                       optionId;
    announceToScreenReader(`Now showing ${optionLabel} view for ${indicatorId}`);

    console.log(`Switched ${indicatorId} to ${optionId}`);
  }

  /**
   * Set current audience
   */
  function setAudience(audience) {
    state.currentAudience = audience;
    saveState();

    // Update UI
    document.querySelectorAll('[data-audience]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.audience === audience);
    });

    // Announce change
    announceToScreenReader(`Switched to ${audience} view`);

    console.log(`Audience set to: ${audience}`);
  }

  /**
   * Navigate to section
   */
  function navigateToSection(section) {
    state.currentSection = section;
    saveState();

    // Update navigation UI
    document.querySelectorAll('[data-section]').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    // Scroll to section
    const sectionElement = document.getElementById(`section-${section}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    console.log(`Navigated to section: ${section}`);
  }

  /**
   * Render initial state from saved preferences
   */
  function renderInitialState() {
    // Restore indicator states
    Object.entries(state.indicatorStates).forEach(([indicatorId, optionId]) => {
      switchVisualization(indicatorId, optionId);
    });

    // Restore audience
    if (state.currentAudience) {
      setAudience(state.currentAudience);
    }

    // Restore section
    if (state.currentSection) {
      const navItem = document.querySelector(`[data-section="${state.currentSection}"]`);
      if (navItem) {
        navItem.classList.add('active');
      }
    }
  }

  /**
   * Create live region for screen reader announcements
   */
  function createLiveRegion() {
    if (document.getElementById(LIVE_REGION_ID)) return;

    const liveRegion = document.createElement('div');
    liveRegion.id = LIVE_REGION_ID;
    liveRegion.className = 'live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }

  /**
   * Announce message to screen readers
   */
  function announceToScreenReader(message) {
    const liveRegion = document.getElementById(LIVE_REGION_ID);
    if (!liveRegion) return;

    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Reset dashboard to default state
   */
  function resetToDefaults() {
    if (!confirm('Reset all preferences to defaults?')) return;

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Reset state
    state = {
      currentAudience: 'champion',
      indicatorStates: {},
      currentSection: 'operational'
    };

    // Reload page
    window.location.reload();
  }

  /**
   * Get current state (for debugging)
   */
  function getState() {
    return { ...state };
  }

  // Public API
  return {
    init,
    switchVisualization,
    setAudience,
    navigateToSection,
    resetToDefaults,
    getState
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', RWCBDashboard.init);
} else {
  RWCBDashboard.init();
}

// Expose to window for debugging
window.RWCBDashboard = RWCBDashboard;
