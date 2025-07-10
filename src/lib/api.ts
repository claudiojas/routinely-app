import { ApiResponse, ApiError } from '@/types/api'

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Classe para erros da API
export class ApiException extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiException'
  }
}

// Função para fazer requisições HTTP
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Configuração padrão
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)
    
    // Verificar se a resposta é ok
    if (!response.ok) {
      let errorMessage = 'Erro na requisição'
      let errorCode: string | undefined
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        errorCode = errorData.code
      } catch {
        // Se não conseguir parsear o erro, usar status text
        errorMessage = response.statusText || errorMessage
      }
      
      throw new ApiException(response.status, errorMessage, errorCode)
    }

    // Se a resposta for 204 (No Content), retornar void
    if (response.status === 204) {
      return {} as T
    }

    // Parsear resposta JSON
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }
    
    // Erro de rede ou outros
    throw new ApiException(0, 'Erro de conexão', 'NETWORK_ERROR')
  }
}

// Métodos HTTP
export const api = {
  // GET
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }
    return request<T>(url.pathname + url.search)
  },

  // POST
  post: <T>(endpoint: string, data?: unknown) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  // PUT
  put: <T>(endpoint: string, data?: unknown) => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  // PATCH
  patch: <T>(endpoint: string, data?: unknown) => {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  // DELETE
  delete: <T>(endpoint: string) => {
    return request<T>(endpoint, {
      method: 'DELETE',
    })
  },
}

// Interceptor para refresh token
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  
  failedQueue = []
}

// Função para refresh token
export const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refresh_token')
  
  if (!refreshToken) {
    return null
  }

  try {
    const response = await api.post<{ token: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    })
    
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('refresh_token', response.refreshToken)
    
    return response.token
  } catch (error) {
    // Se o refresh falhar, limpar tokens
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    throw error
  }
}

// Função para interceptar erros 401 e tentar refresh
export const handleAuthError = async (error: ApiException): Promise<boolean> => {
  if (error.status === 401 && !isRefreshing) {
    isRefreshing = true
    
    try {
      const newToken = await refreshAuthToken()
      processQueue(null, newToken)
      return true
    } catch (refreshError) {
      processQueue(refreshError, null)
      return false
    } finally {
      isRefreshing = false
    }
  }
  
  return false
}

// Utilitários para autenticação
export const auth = {
  // Login
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: unknown; token: string; refreshToken: string }>>('/auth/login', {
      email,
      password,
    })
    
    if (response.success) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('refresh_token', response.data.refreshToken)
    }
    
    return response
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token')
  },

  // Obter token atual
  getToken: () => {
    return localStorage.getItem('auth_token')
  },
} 