// frontend/events.js
// Event-related rendering and logic
import { showToast, safeLocale, fillEventModal, renderCalendar, openModal, closeModal, showDayEventsModal } from './utils.js';

export function renderEvents(app, content, headerActions) {
    headerActions.innerHTML = `
        <button class="btn btn-secondary btn-sm">
            <i class="fas fa-filter"></i> Filters
        </button>
        <button class="btn btn-success btn-sm" id="add-event-btn">
            <i class="fas fa-plus"></i> Add Event
        </button>
    `;

    const { events } = app.data.events;
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const now = new Date();
    let upcomingEvents = sortedEvents.filter(event => new Date(event.date) >= now);
    const recentEvents = sortedEvents.filter(event => new Date(event.date) < now).reverse();
    if (app.showAllUpcomingEvents !== true) {
        upcomingEvents = upcomingEvents.slice(0, 6);
    }
    // Pagination state for upcoming and recent events
    if (typeof app.upcomingEventsPage !== 'number') app.upcomingEventsPage = 1;
    if (typeof app.recentEventsPage !== 'number') app.recentEventsPage = 1;
    const EVENTS_PER_PAGE = 5;
    // Paginate upcoming events
    const totalUpcomingPages = Math.ceil(upcomingEvents.length / EVENTS_PER_PAGE) || 1;
    const pagedUpcomingEvents = upcomingEvents.slice((app.upcomingEventsPage - 1) * EVENTS_PER_PAGE, app.upcomingEventsPage * EVENTS_PER_PAGE);
    // Paginate recent events
    const totalRecentPages = Math.ceil(recentEvents.length / EVENTS_PER_PAGE) || 1;
    const pagedRecentEvents = recentEvents.slice((app.recentEventsPage - 1) * EVENTS_PER_PAGE, app.recentEventsPage * EVENTS_PER_PAGE);
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                        <h2 class="card-title">Upcoming Events</h2>
                        <select style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                            <option>All Ministries</option>
                            <option>Worship</option>
                            <option>Children's Ministry</option>
                            <option>Youth</option>
                        </select>
                    </div>
                </div>
                <div class="card-content">
                    ${pagedUpcomingEvents.length > 0 ? pagedUpcomingEvents.map(event => `
                        <div class="event-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; position: relative;">
                            <div style="display: flex; align-items: start; justify-content: space-between;">
                                <div style="display: flex; align-items: start; gap: 12px;">
                                    <div style="width: 40px; height: 40px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1e40af;">
                                        <i class="fas fa-calendar"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 4px;">${event.title || ''}</h3>
                                        <p style="color: #64748b; margin-bottom: 8px;">${event.description || ''}</p>
                                        <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #64748b;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <i class="fas fa-calendar"></i>
                                                ${event.date ? new Date(event.date).toLocaleDateString() : ''}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <i class="fas fa-clock"></i>
                                                ${event.start_time ? event.start_time.slice(0,5) : ''}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <i class="fas fa-map-marker-alt"></i>
                                                ${event.location || ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span class="badge ${event.status ? event.status.toLowerCase() : ''}">${event.status || ''}</span>
                            </div>
                            <div class="action-buttons" style="margin-top: 12px; display: flex; gap: 8px;">
                                <button class="action-btn view" data-event-id="${event.id}" title="View"><i class="fas fa-eye"></i></button>
                                <button class="action-btn edit" data-event-id="${event.id}" title="Edit"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete" data-event-id="${event.id}" title="Delete"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `).join('') : '<div style="color:#64748b; text-align:center;">No upcoming events.</div>'}
                    <div style="text-align: center; margin-top: 16px;">
                        ${app.upcomingEventsPage > 1 ? `<button class="btn btn-secondary" id="upcoming-prev-btn">View Less</button>` : ''}
                        ${app.upcomingEventsPage < totalUpcomingPages ? `<button class="btn btn-secondary" id="upcoming-next-btn">View More</button>` : ''}
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Calendar</h2>
                </div>
                <div class="card-content" id="calendar-container">
                    ${renderCalendar(events).html}
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Recent Events</h2>
            </div>
            <div class="card-content">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>EVENT</th>
                                <th>DATE</th>
                                <th>TIME</th>
                                <th>LOCATION</th>
                                <th>MINISTRY</th>
                                <th>STATUS</th>
                                <th><!-- ACTIONS removed --></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pagedRecentEvents.length > 0 ? pagedRecentEvents.map(event => `
                                <tr>
                                    <td>${event.title || ''}</td>
                                    <td>${event.date ? new Date(event.date).toLocaleDateString() : ''}</td>
                                    <td>${event.start_time ? event.start_time.slice(0,5) : ''}</td>
                                    <td>${event.location || ''}</td>
                                    <td>${event.ministry || ''}</td>
                                    <td><span class="badge ${event.status ? event.status.toLowerCase() : ''}">${event.status || ''}</span></td>
                                    <td>
                                        <div class="action-buttons" style="display: flex; gap: 8px;">
                                            <button class="action-btn view" data-event-id="${event.id}" title="View"><i class="fas fa-eye"></i></button>
                                            <button class="action-btn edit" data-event-id="${event.id}" title="Edit"><i class="fas fa-edit"></i></button>
                                            <button class="action-btn delete" data-event-id="${event.id}" title="Delete"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="7" style="text-align:center; color:#64748b;">No recent events.</td></tr>'}
                        </tbody>
                    </table>
                    <div style="text-align: center; margin-top: 16px;">
                        ${app.recentEventsPage > 1 ? `<button class="btn btn-secondary" id="recent-prev-btn">View Less</button>` : ''}
                        ${app.recentEventsPage < totalRecentPages ? `<button class="btn btn-secondary" id="recent-next-btn">View More</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                app.openModal('add-event-modal');
            });
        }
        const addEventForm = document.getElementById('add-event-form');
        if (addEventForm) {
            addEventForm.addEventListener('submit', (e) => app.handleAddEvent(e));
        }
        // Calendar rendering and interaction
        let calendarMonth = null;
        let calendarYear = null;
        let calendarEventMap = null;
        function renderAndBindCalendar(month = null, year = null) {
            const { html, month: m, year: y, eventMap } = renderCalendar(events, month, year);
            calendarMonth = m;
            calendarYear = y;
            calendarEventMap = eventMap;
            const calendarContainer = document.getElementById('calendar-container');
            if (calendarContainer) {
                calendarContainer.innerHTML = html;
                // Day click: show modal with events for that day
                calendarContainer.querySelectorAll('.calendar-day.has-event').forEach(dayEl => {
                    dayEl.addEventListener('click', () => {
                        const day = parseInt(dayEl.dataset.day, 10);
                        showDayEventsModal(day, calendarMonth, calendarYear, calendarEventMap[day] || []);
                    });
                });
                // Month navigation
                const prevBtn = calendarContainer.querySelector('.calendar-prev');
                const nextBtn = calendarContainer.querySelector('.calendar-next');
                if (prevBtn) prevBtn.onclick = () => renderAndBindCalendar(calendarMonth - 1 < 0 ? 11 : calendarMonth - 1, calendarMonth - 1 < 0 ? calendarYear - 1 : calendarYear);
                if (nextBtn) nextBtn.onclick = () => renderAndBindCalendar(calendarMonth + 1 > 11 ? 0 : calendarMonth + 1, calendarMonth + 1 > 11 ? calendarYear + 1 : calendarYear);
            }
        }
        renderAndBindCalendar();
        const toggleBtn = document.getElementById('toggle-upcoming-events-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                app.showAllUpcomingEvents = !app.showAllUpcomingEvents;
                app.renderPage('events');
            });
        }
        // Add event action listeners for view/edit/delete (like members tab)
        document.querySelectorAll('.action-btn.view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = btn.getAttribute('data-event-id');
                const event = app.data.events.events.find(ev => (ev.id + '') === eventId);
                if (event) {
                    // Fill both input/textarea fields and fallback spans for the view modal
                    const modal = document.getElementById('view-event-modal');
                    if (modal) {
                        // For each key, set value for input/textarea, and textContent for span fallback
                        Object.keys(event).forEach(key => {
                            const input = modal.querySelector(`.event-${key}`);
                            if (input) {
                                if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                                    input.value = event[key] ?? '';
                                } else {
                                    input.textContent = event[key] ?? '';
                                }
                            }
                        });
                    }
                    app.openModal('view-event-modal');
                }
            });
        });
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = btn.getAttribute('data-event-id');
                const event = app.data.events.events.find(ev => (ev.id + '') === eventId);
                if (event) {
                    fillEventModal('edit-event-modal', event);
                    app.openModal('edit-event-modal');
                }
            });
        });
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = btn.getAttribute('data-event-id');
                const event = app.data.events.events.find(ev => (ev.id + '') === eventId);
                if (event) {
                    // Set event title in delete modal
                    const titleEl = document.querySelector('.delete-event-title');
                    if (titleEl) titleEl.textContent = event.title || '';
                    // Only set attribute if the button exists
                    const confirmBtn = document.getElementById('confirm-delete-event-btn');
                    if (confirmBtn) confirmBtn.setAttribute('data-event-id', eventId);
                    app.openModal('delete-event-modal');
                }
            });
        });
        const confirmDeleteBtn = document.getElementById('confirm-delete-event-btn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.onclick = async function() {
                const eventId = this.getAttribute('data-event-id');
                if (eventId) {
                    try {
                        await app.deleteEvent(eventId);
                        await app.loadData();
                        app.renderPage('events');
                        showToast('Event deleted!', 'success');
                    } catch (err) {
                        showToast('Failed to delete event: ' + (err.message || 'Unknown error'), 'error');
                        console.error('Failed to delete event:', err);
                    }
                }
            };
        }
        // Edit event form
        const editEventForm = document.getElementById('edit-event-form');
        if (editEventForm) {
            editEventForm.addEventListener('submit', (e) => app.handleEditEvent(e));
        }
        // Defensive: ensure modals exist for view, edit, delete event
        if (!document.getElementById('view-event-modal')) {
            const viewModal = document.createElement('div');
            viewModal.id = 'view-event-modal';
            viewModal.className = 'modal';
            viewModal.innerHTML = `
                <div class="modal-content" style="max-width: 420px; border-radius: 14px; box-shadow: 0 4px 32px rgba(0,0,0,0.18); padding: 32px 28px; background: #fff;">
                    <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; margin-bottom: 18px;">
                        <h2 style="font-size: 1.4rem; font-weight: 600; margin: 0;">View Event</h2>
                        <button class="modal-close" onclick="closeModal('view-event-modal')" style="background: none; border: none; font-size: 1.6rem; color: #64748b; cursor: pointer;">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form style='display: flex; flex-direction: column; gap: 16px;'>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Title</label>
                                <input type='text' class='event-title' readonly style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151;'/>
                            </div>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Date</label>
                                <input type='text' class='event-date' readonly style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151;'/>
                            </div>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Time</label>
                                <input type='text' class='event-start_time' readonly style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151;'/>
                            </div>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Location</label>
                                <input type='text' class='event-location' readonly style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151;'/>
                            </div>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Ministry</label>
                                <input type='text' class='event-ministry' readonly style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151;'/>
                            </div>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Status</label>
                                <input type='text' class='event-status' readonly style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151;'/>
                            </div>
                            <div class='form-group'>
                                <label style='font-weight: 500; color: #374151;'>Description</label>
                                <textarea class='event-description' readonly rows='3' style='width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; color: #374151; resize: none;'></textarea>
                            </div>
                        </form>
                    </div>
                </div>`;
            document.body.appendChild(viewModal);
        }
        if (!document.getElementById('edit-event-modal')) {
            const editModal = document.createElement('div');
            editModal.id = 'edit-event-modal';
            editModal.className = 'modal';
            editModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Event</h2>
                        <button class="modal-close" onclick="closeModal('edit-event-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-event-form">
                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" name="title" required />
                            </div>
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" name="date" required />
                            </div>
                            <div class="form-group">
                                <label>Start Time</label>
                                <input type="time" name="start_time" required />
                            </div>
                            <div class="form-group">
                                <label>Location</label>
                                <input type="text" name="location" />
                            </div>
                            <div class="form-group">
                                <label>Ministry</label>
                                <input type="text" name="ministry" />
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <input type="text" name="status" />
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea name="description"></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" onclick="closeModal('edit-event-modal')">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>`;
            document.body.appendChild(editModal);
        }
        if (!document.getElementById('delete-event-modal')) {
            const deleteModal = document.createElement('div');
            deleteModal.id = 'delete-event-modal';
            deleteModal.className = 'modal';
            deleteModal.innerHTML = `
                <div class="modal-content" style="max-width: 400px; border-radius: 14px; box-shadow: 0 4px 32px rgba(0,0,0,0.18); padding: 32px 28px; background: #fff;">
                    <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; margin-bottom: 18px;">
                        <h2 style="font-size: 1.3rem; font-weight: 600; margin: 0; color: #dc2626;">Delete Event</h2>
                        <button class="modal-close" onclick="closeModal('delete-event-modal')" style="background: none; border: none; font-size: 1.6rem; color: #64748b; cursor: pointer;">&times;</button>
                    </div>
                    <div class="modal-body" style="margin-bottom: 18px; color: #374151; font-size: 1.05rem;">
                        <p>Are you sure you want to delete the event <strong class="delete-event-title" style="color: #dc2626;"></strong>?</p>
                    </div>
                    <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px;">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('delete-event-modal')" style="padding: 8px 18px; border-radius: 6px; border: none; background: #e5e7eb; color: #374151; font-weight: 500; cursor: pointer;">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirm-delete-event-btn" style="padding: 8px 18px; border-radius: 6px; border: none; background: #dc2626; color: #fff; font-weight: 500; cursor: pointer;">Delete</button>
                    </div>
                </div>`;
            document.body.appendChild(deleteModal);
        }
    }, 0);
}
