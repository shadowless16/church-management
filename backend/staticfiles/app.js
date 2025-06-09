import {
    fetchMembers,
    fetchMemberStats,
    fetchEvents,
    fetchDonations,
    fetchDonationStats,
    fetchReports,
    createMember,
    deleteMember,
    createEvent,
    deleteEvent,
    logout as apiLogout
} from './api.js';
import { showToast as showToastUtil, safeLocale as safeLocaleUtil } from './utils.js';
import { renderMembers } from './members.js';
import { renderEvents } from './events.js';
import { renderDashboard } from './dashboard.js';

// Church Management System JavaScript

class ChurchManagementSystem {
    constructor() {
        // Use window.mockData if it exists, otherwise use empty objects
        this.data = typeof window.mockData !== 'undefined' ? window.mockData : {
            members: { members: [], stats: {} },
            events: { events: [] },
            donations: { donations: [], stats: {} },
            reports: { reports: [] }
        };
        this.currentPage = 'dashboard';
        this.init();
    }

    async loadData() {
        try {
            const [members, memberStats, events, donations, donationStats, reports] = await Promise.all([
                fetchMembers(),
                fetchMemberStats(),
                fetchEvents(),
                fetchDonations(),
                fetchDonationStats(),
                fetchReports(),
            ]);
            this.data = {
                members: { members: members.results || members || [], stats: memberStats || {} },
                events: { events: events.results || events || [] },
                donations: { donations: donations.results || donations || [], stats: donationStats || {} },
                reports: { reports: reports.results || reports || [] }
            };
            console.log('Loaded events:', events);
        } catch (e) {
            console.error('Failed to load data from API:', e);
        }
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.loadPage('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-link').dataset.page;
                this.loadPage(page);
            });
        });

        // Mobile menu
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });

        // User dropdown
        document.querySelector('.dropdown-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = document.querySelector('.dropdown-menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            document.querySelector('.dropdown-menu').style.display = 'none';
        });

        // Add member form
        document.getElementById('add-member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddMember(e);
        });

        // Edit member form
        const editForm = document.getElementById('edit-member-form');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(editForm);
                // Try to get memberId from the currently filled modal
                let memberId = null;
                const idInput = editForm.querySelector('[name="id"]');
                if (idInput && idInput.value) {
                    memberId = idInput.value;
                } else {
                    // Fallback: try to find by email
                    const email = formData.get('email');
                    const member = this.data.members.members.find(m => m.email === email);
                    if (member) memberId = member.id;
                }
                if (!memberId) {
                    this.showToast('Could not determine which member to update.', 'error');
                    return;
                }
                // Build address object
                const address = {
                    street: formData.get('street') || '',
                    city: formData.get('city') || '',
                    state: formData.get('state') || '',
                    zip: formData.get('zip') || ''
                };
                // Ministries as array (comma separated or single input)
                let ministry = [];
                if (formData.get('ministry')) {
                    ministry = formData.get('ministry').split(',').map(s => s.trim()).filter(Boolean);
                }
                // Build memberData
                const memberData = {
                    first_name: formData.get('first_name') || '',
                    last_name: formData.get('last_name') || '',
                    email: formData.get('email') || '',
                    phone: formData.get('phone') || '',
                    date_of_birth: formData.get('date_of_birth') || null,
                    gender: formData.get('gender') || '',
                    address: address,
                    status: formData.get('status') || 'new',
                    join_date: formData.get('join_date') || null,
                    ministry: ministry,
                    notes: formData.get('notes') || ''
                };
                const api = new ChurchAPI();
                try {
                    await api.updateMember(memberId, memberData);
                    this.closeModal('edit-member-modal');
                    await this.loadData();
                    this.renderPage('members');
                    this.showToast('Member updated successfully!', 'success');
                } catch (err) {
                    this.showToast('Failed to update member: ' + (err.message || 'Unknown error'), 'error');
                    console.error('Failed to update member:', err);
                }
            });
        }

        // Modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Logout button
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await apiLogout();
                window.location.href = '/login';
            });
        });
    }

    loadPage(page = 'dashboard') {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            members: 'Members Management',
            events: 'Events',
            donations: 'Donations',
            reports: 'Reports',
            settings: 'Settings'
        };
        document.getElementById('page-title').textContent = titles[page];

        // Load page content
        this.currentPage = page;
        this.renderPage(page);
    }

    renderPage(page) {
        const content = document.getElementById('page-content');
        const headerActions = document.getElementById('header-actions');

        switch (page) {
            case 'dashboard':
                renderDashboard(this, content, headerActions);
                break;
            case 'members':
                renderMembers(this, content, headerActions);
                break;
            case 'events':
                renderEvents(this, content, headerActions);
                break;
            case 'donations':
                renderDonations(this, content, headerActions);
                break;
            case 'reports':
                renderReports(this, content, headerActions);
                break;
            case 'settings':
                renderSettings(this, content, headerActions);
                break;
        }
    }

    // Remove the original renderDashboard, renderDonations, renderReports, renderSettings methods from this file.

    // Helper to show toast notifications
    showToast(message, type = 'error') {
        showToastUtil(message, type);
    }

    // Helper to safely format numbers (handles string, null, undefined, NaN)
    safeLocale(val) {
        return safeLocaleUtil(val);
    }

    async handleAddMember(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const address = {
            street: formData.get('street') || '',
            city: formData.get('city') || '',
            state: formData.get('state') || '',
            zip: formData.get('zip') || ''
        };
        const ministry = Array.from(form.querySelectorAll('input[name="ministries"]:checked')).map(cb => cb.value);
        const memberData = {
            first_name: formData.get('first_name') || '',
            last_name: formData.get('last_name') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            date_of_birth: formData.get('date_of_birth') || null,
            gender: formData.get('gender') || '',
            address: address,
            status: formData.get('status') || 'new',
            join_date: formData.get('join_date') || null,
            ministry: ministry,
            notes: formData.get('notes') || ''
        };
        try {
            await createMember(memberData);
            this.closeModal('add-member-modal');
            await this.loadData();
            this.renderPage('members');
            this.showToast('Member added successfully!', 'success');
        } catch (err) {
            this.showToast('Failed to add member: ' + (err.message || 'Unknown error'), 'error');
            console.error('Failed to add member:', err);
        }
    }

    async handleAddEvent(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const eventData = {
            title: formData.get('title') || '',
            date: formData.get('date') || '',
            start_time: formData.get('start_time') || '',
            location: formData.get('location') || '',
            ministry: formData.get('ministry') || '',
            status: formData.get('status') || '',
            description: formData.get('description') || ''
        };
        try {
            await createEvent(eventData);
            this.closeModal('add-event-modal');
            await this.loadData();
            this.renderPage('events');
            this.showToast('Event added successfully!', 'success');
        } catch (err) {
            this.showToast('Failed to add event: ' + (err.message || 'Unknown error'), 'error');
            console.error('Failed to add event:', err);
        }
    }

    async handleEditEvent(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        let eventId = null;
        const idInput = form.querySelector('[name="id"]');
        if (idInput && idInput.value) {
            eventId = idInput.value;
        } else {
            // fallback: try to find by title and date
            const title = formData.get('title');
            const date = formData.get('date');
            const event = this.data.events.events.find(ev => ev.title === title && ev.date === date);
            if (event) eventId = event.id;
        }
        if (!eventId) {
            this.showToast('Could not determine which event to update.', 'error');
            return;
        }
        const eventData = {
            title: formData.get('title') || '',
            date: formData.get('date') || '',
            start_time: formData.get('start_time') || '',
            location: formData.get('location') || '',
            ministry: formData.get('ministry') || '',
            status: formData.get('status') || '',
            description: formData.get('description') || ''
        };
        const api = new ChurchAPI();
        try {
            await api.updateEvent(eventId, eventData);
            this.closeModal('edit-event-modal');
            await this.loadData();
            this.renderPage('events');
            this.showToast('Event updated successfully!', 'success');
        } catch (err) {
            this.showToast('Failed to update event: ' + (err.message || 'Unknown error'), 'error');
            console.error('Failed to update event:', err);
        }
    }

    async deleteEvent(eventId) {
        const api = new ChurchAPI();
        await api.deleteEvent(eventId);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// Add CSS for settings tabs and switches
const additionalCSS = `
.settings-tab {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    text-align: left;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
}

.settings-tab:hover {
    background: #f1f5f9;
}

.settings-tab.active {
    background: #4f46e5;
    color: white;
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #4f46e5;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

/* Center all modals on screen */
.modal {
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background: rgba(0,0,0,0.25);
    justify-content: center;
    align-items: center;
}
.modal.show, .modal[style*="display: block"] {
    display: flex !important;
}
.modal .modal-content {
    margin: auto;
    background: #fff;
    border-radius: 12px;
    padding: 32px 24px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    max-width: 480px;
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    transform: none;
}
`;

// Add the additional CSS to the page
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the application
const app = new ChurchManagementSystem();

// Make app globally available for modal functions
window.app = app;
window.openModal = (modalId) => app.openModal(modalId);
window.closeModal = (modalId) => app.closeModal(modalId);
console.log('window.app:', window.app, 'openModal:', typeof window.app.openModal);