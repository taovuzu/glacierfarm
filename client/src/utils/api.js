export async function apiCall(endpoint, options = {}) {
  const baseURL = import.meta.env.VITE_API_URL || '/netlify/functions/api'
  const url = `${baseURL}${endpoint}`
  console.log(url);

  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

/**
 * Validation Functions
 */

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password) {
  return password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)
}

export function validatePhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10
}

/**
 * Format Functions
 */

export function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN')
}

export function formatQuantity(quantity, unit = 'kg') {
  return `${quantity} ${unit}`
}
