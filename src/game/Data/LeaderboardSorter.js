/**
 * Leaderboard Sorter
 * Implements iterative sorting algorithms for leaderboards and progress organization
 * 
 * Algorithms implemented:
 * - Quicksort: O(n log n) average case for leaderboards
 * - Bubble Sort: O(n²) for smaller datasets (progress, inventory)
 */

/**
 * Quicksort Algorithm
 * Sorts an array of leaderboard entries by score (descending)
 * Time Complexity: O(n log n) average case, O(n²) worst case
 * 
 * @param {Array} arr - Array of leaderboard entries
 * @param {number} left - Left index
 * @param {number} right - Right index
 * @returns {Array} Sorted array
 */
export function quicksortLeaderboard(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partitionLeaderboard(arr, left, right)
    quicksortLeaderboard(arr, left, pivotIndex - 1)
    quicksortLeaderboard(arr, pivotIndex + 1, right)
  }
  return arr
}

/**
 * Partition function for quicksort
 * @param {Array} arr - Array to partition
 * @param {number} left - Left index
 * @param {number} right - Right index
 * @returns {number} Pivot index
 */
function partitionLeaderboard(arr, left, right) {
  const pivot = arr[right].score || arr[right].completionPercentage || 0
  let i = left - 1

  for (let j = left; j < right; j++) {
    const currentScore = arr[j].score || arr[j].completionPercentage || 0
    // Sort in descending order (highest score first)
    if (currentScore >= pivot) {
      i++
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]
  return i + 1
}

/**
 * Bubble Sort Algorithm
 * Sorts an array using bubble sort (useful for smaller datasets)
 * Time Complexity: O(n²)
 * 
 * @param {Array} arr - Array to sort
 * @param {string} sortBy - Field to sort by ('score', 'completionPercentage', 'level')
 * @param {boolean} ascending - Sort ascending (true) or descending (false)
 * @returns {Array} Sorted array
 */
export function bubbleSort(arr, sortBy = 'score', ascending = false) {
  const n = arr.length
  const arrCopy = [...arr] // Don't mutate original array

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
    
    // Optimization: if no swaps, array is sorted
    if (!swapped) {
      break
    }
  }

  return arrCopy
}

/**
 * Sort leaderboard entries by score using quicksort
 * @param {Array} entries - Array of leaderboard entries
 * @returns {Array} Sorted array (highest score first)
 */
export function sortLeaderboardByScore(entries) {
  if (entries.length === 0) return entries
  
  // Use quicksort for larger arrays, bubble sort for smaller ones
  if (entries.length > 10) {
    return quicksortLeaderboard([...entries])
  } else {
    return bubbleSort(entries, 'score', false)
  }
}

/**
 * Sort progress entries by completion percentage
 * @param {Array} entries - Array of progress entries
 * @returns {Array} Sorted array (highest completion first)
 */
export function sortProgressByCompletion(entries) {
  if (entries.length === 0) return entries
  
  // Use bubble sort for progress (usually smaller datasets)
  return bubbleSort(entries, 'completionPercentage', false)
}

/**
 * Sort inventory items
 * @param {Array} items - Array of inventory items
 * @param {string} sortBy - Field to sort by
 * @returns {Array} Sorted array
 */
export function sortInventory(items, sortBy = 'name') {
  if (items.length === 0) return items
  
  return bubbleSort(items, sortBy, true) // Ascending for inventory
}

/**
 * Leaderboard Sorter Class
 * Main interface for sorting leaderboards and progress
 */
export class LeaderboardSorter {
  /**
   * Sort leaderboard entries
   * @param {Array} entries - Leaderboard entries
   * @param {string} sortBy - Field to sort by
   * @returns {Array} Sorted entries
   */
  sortLeaderboard(entries, sortBy = 'score') {
    if (entries.length === 0) return entries
    
    // Use quicksort for larger arrays
    if (entries.length > 10) {
      return quicksortLeaderboard([...entries])
    } else {
      return bubbleSort(entries, sortBy, false)
    }
  }

  /**
   * Sort progress data
   * @param {Array} progress - Progress entries
   * @returns {Array} Sorted progress
   */
  sortProgress(progress) {
    return sortProgressByCompletion(progress)
  }

  /**
   * Sort by multiple criteria (e.g., score then level)
   * @param {Array} entries - Entries to sort
   * @param {Array} sortFields - Array of fields to sort by, in order
   * @returns {Array} Sorted entries
   */
  sortByMultipleFields(entries, sortFields = ['score', 'level']) {
    const sorted = [...entries]
    
    // Sort by each field in reverse order (last field first)
    for (let i = sortFields.length - 1; i >= 0; i--) {
      const field = sortFields[i]
      sorted.sort((a, b) => {
        const aVal = a[field] || 0
        const bVal = b[field] || 0
        return bVal - aVal // Descending
      })
    }
    
    return sorted
  }
}
