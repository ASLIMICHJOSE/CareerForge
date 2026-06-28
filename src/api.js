const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
}

async function request(url, options = {}) {
  const headers = { ...defaultHeaders, ...options.headers }
  
  // If the body is FormData (file upload), let the browser set the boundary headers automatically
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // crucial for sending/receiving HttpOnly cookies
  })

  // Attempt to parse JSON response
  let data = {}
  try {
    data = await response.json()
  } catch (err) {
    // Response had no JSON body
  }

  if (!response.ok) {
    const errMsg = data.error || `Request failed with status ${response.status}`
    throw new Error(errMsg)
  }

  return data
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' })
}
