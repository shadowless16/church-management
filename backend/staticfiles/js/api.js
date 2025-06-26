// API Configuration and Helper Functions
class ChurchAPI {
  constructor() {
    this.baseURL = "http://localhost:8000/api"
    this.token = localStorage.getItem("access_token")
  }

  // Set authentication token
  setToken(token) {
    this.token = token
    localStorage.setItem("access_token", token)
  }

  // Remove authentication token
  removeToken() {
    this.token = null
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  // Handle API responses
  async handleResponse(response) {
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshToken()
      if (!refreshed) {
        this.removeToken()
        throw new Error('Authentication failed. Please log in again.')
      }
      // Retry the original request (not implemented here)
      throw new Error('Token refreshed. Please retry the request.')
    }

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        errorDetail = data.detail || data.error || JSON.stringify(data);
      } catch (e) {
        // ignore JSON parse error
      }
      throw new Error(errorDetail)
    }

    // Handle empty response (e.g., 204 No Content)
    if (response.status === 204) {
      return true;
    }
    const text = await response.text();
    if (!text) {
      return true;
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      // If not valid JSON, just return the text
      return text;
    }
  }

  // Refresh authentication token
  async refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) return false

    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.setToken(data.access)
        return true
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }

    return false
  }

  // Authentication methods
  async login(email, password, rememberMe = false) {
    const response = await fetch(`${this.baseURL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    })

    const data = await this.handleResponse(response)
    if (data && data.tokens) {
      this.setToken(data.tokens.access)
      localStorage.setItem("refresh_token", data.tokens.refresh)
      localStorage.setItem("user_data", JSON.stringify(data.user))
    }
    return data
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    return this.handleResponse(response)
  }

  async logout() {
    const refreshToken = localStorage.getItem("refresh_token")
    if (refreshToken) {
      try {
        await fetch(`${this.baseURL}/auth/logout/`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
    this.removeToken()
  }

  // Member methods
  async getMembers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${this.baseURL}/members/?${queryString}`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getMember(id) {
    const response = await fetch(`${this.baseURL}/members/${id}/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async createMember(memberData) {
    const response = await fetch(`${this.baseURL}/members/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(memberData),
    })
    return this.handleResponse(response)
  }

  async updateMember(id, memberData) {
    const response = await fetch(`${this.baseURL}/members/${id}/`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(memberData),
    })
    return this.handleResponse(response)
  }

  async deleteMember(id) {
    const response = await fetch(`${this.baseURL}/members/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getMemberStats() {
    const response = await fetch(`${this.baseURL}/members/stats/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  // Event methods
  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${this.baseURL}/events/?${queryString}`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getEvent(id) {
    const response = await fetch(`${this.baseURL}/events/${id}/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async createEvent(eventData) {
    const response = await fetch(`${this.baseURL}/events/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(eventData),
    })
    return this.handleResponse(response)
  }

  async updateEvent(id, eventData) {
    const response = await fetch(`${this.baseURL}/events/${id}/`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(eventData),
    })
    return this.handleResponse(response)
  }

  async deleteEvent(id) {
    const response = await fetch(`${this.baseURL}/events/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getUpcomingEvents() {
    const response = await fetch(`${this.baseURL}/events/upcoming/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getEventStats() {
    const response = await fetch(`${this.baseURL}/events/stats/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  // Donation methods
  async getDonations(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${this.baseURL}/donations/?${queryString}`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getDonation(id) {
    const response = await fetch(`${this.baseURL}/donations/${id}/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async createDonation(donationData) {
    const response = await fetch(`${this.baseURL}/donations/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(donationData),
    })
    return this.handleResponse(response)
  }

  async updateDonation(id, donationData) {
    const response = await fetch(`${this.baseURL}/donations/${id}/`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(donationData),
    })
    return this.handleResponse(response)
  }

  async deleteDonation(id) {
    const response = await fetch(`${this.baseURL}/donations/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async getDonationStats() {
    const response = await fetch(`${this.baseURL}/donations/stats/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  // Report methods
  async getReports() {
    const response = await fetch(`${this.baseURL}/reports/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }

  async generateMembershipReport(params) {
    const response = await fetch(`${this.baseURL}/reports/generate/membership/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    })
    return this.handleResponse(response)
  }

  async generateFinancialReport(params) {
    const response = await fetch(`${this.baseURL}/reports/generate/financial/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    })
    return this.handleResponse(response)
  }

  async downloadReport(reportId) {
    const response = await fetch(`${this.baseURL}/reports/${reportId}/download/`, {
      headers: this.getHeaders(),
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report_${reportId}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      throw new Error("Failed to download report")
    }
  }

  async getDashboardStats() {
    const response = await fetch(`${this.baseURL}/reports/dashboard-stats/`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse(response)
  }
}

// Create global API instance
const api = new ChurchAPI()

// API wrapper functions for modular use
export async function fetchMembers(params = {}) {
    return api.getMembers(params);
}

export async function fetchMemberStats() {
    return api.getMemberStats();
}

export async function fetchEvents(params = {}) {
    return api.getEvents(params);
}

export async function fetchBlog(params = {}) {
    return api.getBlog(params);
}

export async function fetchDonations(params = {}) {
    return api.getDonations(params);
}

export async function fetchDonationStats() {
    return api.getDonationStats();
}

export async function fetchReports() {
    return api.getReports();
}

export async function createMember(memberData) {
    return api.createMember(memberData);
}

export async function deleteMember(memberId) {
    return api.deleteMember(memberId);
}

export async function createEvent(eventData) {
    return api.createEvent(eventData);
}

export async function deleteEvent(eventId) {
    return api.deleteEvent(eventId);
}

export async function logout() {
    return api.logout();
}

export async function login(email, password, rememberMe = false) {
    return api.login(email, password, rememberMe);
}

export { ChurchAPI };
