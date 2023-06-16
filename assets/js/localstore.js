/**
 * Gets data from local storage
 * @param {string} key 
 * @returns {string}
 */
export function getData(key) {
    if (!key) {
        return null;
    }
    return localStorage.getItem(key);
}

/**
 * Saves data to local storage
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
export function setData(key, value) {
    if (!key) {
        return;
    }
    localStorage.setItem(key, value);
}