
/**
 * Generates a username for an employee based on their name and employee number.
 * Example: For name "John Doe" and employeeNumber "1234", returns "jdoe1234"
 * If name is missing, returns "user" + employeeNumber or a random string.
 * @param {string} name - Full name of the employee
 * @param {string|number} employeeNumber - Employee number or unique id
 * @returns {string} username
 */
function generateUsername(name, employeeNumber) {
    if (!employeeNumber) {
        // fallback: random username
        return 'user' + Math.floor(1000 + Math.random() * 9000);
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return 'user' + employeeNumber;
    }
    const parts = name.trim().split(/\s+/);
    let firstInitial = '';
    let lastName = '';
    if (parts.length === 1) {
        // Only one name part
        firstInitial = parts[0][0] || '';
        lastName = parts[0].slice(1) || '';
    } else {
        firstInitial = parts[0][0] || '';
        lastName = parts[parts.length - 1] || '';
    }
    const username = (firstInitial + lastName + employeeNumber).toLowerCase().replace(/[^a-z0-9]/g, '');
    return username;
}

module.exports = { generateUsername };
