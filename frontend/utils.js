// frontend/utils.js
// Utility functions for the church management frontend

// Show toast notification
export function showToast(message, type = 'error') {
    const oldToast = document.getElementById('toast-message');
    if (oldToast) oldToast.remove();
    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.right = '32px';
    toast.style.background = type === 'error' ? '#dc2626' : '#16a34a';
    toast.style.color = '#fff';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    toast.style.zIndex = 9999;
    toast.style.fontSize = '16px';
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}

// Safely format numbers
export function safeLocale(val) {
    const num = Number(val);
    return Number.isFinite(num) ? num.toLocaleString() : '0';
}

// Helper to fill modals with member data
export function fillMemberModal(modalId, member) {
    const modal = document.getElementById(modalId);
    if (!modal || !member) return;
    Object.keys(member).forEach(key => {
        const input = modal.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                input.value = member[key] ?? '';
            } else if (input.tagName === 'SELECT') {
                input.value = member[key] ?? '';
            }
        }
    });
}

// Helper to fill modals with event data
export function fillEventModal(modalId, event) {
    const modal = document.getElementById(modalId);
    if (!modal || !event) return;
    Object.keys(event).forEach(key => {
        // Fill form fields
        const input = modal.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                input.value = event[key] ?? '';
            } else if (input.tagName === 'SELECT') {
                input.value = event[key] ?? '';
            }
        }
        // Fill view-only spans/divs
        const span = modal.querySelector(`.event-${key}`);
        if (span) {
            span.textContent = event[key] ?? '';
        }
    });
}

// Enhanced renderCalendar: supports month navigation, event dots, and returns current month/year
export function renderCalendar(events = [], month = null, year = null) {
    const today = new Date();
    const currentMonth = month !== null ? month : today.getMonth();
    const currentYear = year !== null ? year : today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const eventMap = {};
    events.forEach(ev => {
        const d = new Date(ev.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            const day = d.getDate();
            if (!eventMap[day]) eventMap[day] = [];
            eventMap[day].push(ev);
        }
    });
    let calendar = `<div class="calendar-header-nav" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <button class="calendar-prev" style="background:none;border:none;font-size:1.2rem;cursor:pointer;">&#8592;</button>
        <span style="font-weight:600;">${today.toLocaleString('default', { month: 'long' })} ${currentYear}</span>
        <button class="calendar-next" style="background:none;border:none;font-size:1.2rem;cursor:pointer;">&#8594;</button>
    </div>`;
    calendar += '<div class="calendar-grid">';
    days.forEach(day => {
        calendar += `<div class="calendar-day header">${day}</div>`;
    });
    for (let i = 0; i < firstDay; i++) {
        calendar += '<div class="calendar-day"></div>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        const hasEvent = !!eventMap[day];
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (hasEvent) classes += ' has-event';
        calendar += `<div class="${classes}" data-day="${day}">${day}${hasEvent ? '<span class="event-dot" style="display:inline-block;width:7px;height:7px;background:#2563eb;border-radius:50%;margin-left:4px;vertical-align:middle;"></span>' : ''}</div>`;
    }
    calendar += '</div>';
    return { html: calendar, month: currentMonth, year: currentYear, eventMap };
}

// Utility: Show a modal listing events for a selected day
export function showDayEventsModal(day, month, year, events) {
    let modal = document.getElementById('day-events-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'day-events-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 420px; border-radius: 14px; box-shadow: 0 4px 32px rgba(0,0,0,0.18); padding: 32px 28px; background: #fff;">
                <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; margin-bottom: 18px;">
                    <h2 style="font-size: 1.2rem; font-weight: 600; margin: 0;">Events on <span class="day-events-date"></span></h2>
                    <button class="modal-close" style="background: none; border: none; font-size: 1.6rem; color: #64748b; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body day-events-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
            </div>`;
        document.body.appendChild(modal);
        // Add close button event
        modal.querySelector('.modal-close').onclick = () => closeModal('day-events-modal');
        // Close modal when clicking outside modal-content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal('day-events-modal');
        });
    }
    // Always re-attach close listeners in case modal is reused
    modal.querySelector('.modal-close').onclick = () => closeModal('day-events-modal');
    modal.onclick = (e) => {
        if (e.target === modal) closeModal('day-events-modal');
    };
    // Fill date
    const dateStr = new Date(year, month, day).toLocaleDateString();
    modal.querySelector('.day-events-date').textContent = dateStr;
    // Fill events
    const list = modal.querySelector('.day-events-list');
    if (list) {
        if (!events || events.length === 0) {
            list.innerHTML = '<div style="color:#64748b;">No events for this day.</div>';
        } else {
            list.innerHTML = events.map(ev => `
                <div style="border:1px solid #e5e7eb; border-radius:8px; padding:10px 14px; background:#f9fafb;">
                    <div style="font-weight:600; color:#2563eb;">${ev.title || ''}</div>
                    <div style="font-size:13px; color:#64748b;">${ev.start_time ? ev.start_time.slice(0,5) : ''} &mdash; ${ev.location || ''}</div>
                    <div style="font-size:13px; color:#64748b;">${ev.ministry || ''}</div>
                    <div style="font-size:13px; color:#64748b;">${ev.status || ''}</div>
                </div>
            `).join('');
        }
    }
    openModal('day-events-modal');
}

// Modal open/close helpers
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}
