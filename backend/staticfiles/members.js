// frontend/members.js
// Member-related rendering and logic
import { showToast, safeLocale, fillMemberModal } from './utils.js';
import { deleteMember } from './api.js';

export function renderMembers(app, content, headerActions, page = 1, pageSize = 15) {
    headerActions.innerHTML = `
        <button class="btn btn-secondary btn-sm">
            <i class="fas fa-filter"></i> Filters
        </button>
        <button class="btn btn-success btn-sm" onclick="app.openModal('add-member-modal')">
            <i class="fas fa-plus"></i> Add Member
        </button>
    `;

    const members = (app.data.members.members || []);
    const stats = app.data.members.stats || {};
    const totalMembers = stats.total_members ?? stats.totalMembers ?? members.length;
    const totalPages = Math.ceil(members.length / pageSize);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, members.length);
    const pagedMembers = members.slice(startIdx, endIdx);

    content.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Members</h3>
                    <div class="stat-value">${safeLocale(stats.total_members ?? stats.totalMembers ?? members.length)}</div>
                    <div class="stat-change positive">↑ 12% from last month</div>
                </div>
                <div class="stat-icon blue">
                    <i class="fas fa-users"></i>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Active Members</h3>
                    <div class="stat-value">${safeLocale(stats.active_members ?? stats.activeMembers ?? 0)}</div>
                    <div class="stat-change positive">↑ 8% from last month</div>
                </div>
                <div class="stat-icon green">
                    <i class="fas fa-user-check"></i>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>New This Month</h3>
                    <div class="stat-value">${safeLocale(stats.new_this_month ?? stats.newThisMonth ?? 0)}</div>
                    <div class="stat-change negative">↓ 3% from last month</div>
                </div>
                <div class="stat-icon purple">
                    <i class="fas fa-user-plus"></i>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Inactive Members</h3>
                    <div class="stat-value">${safeLocale(stats.inactive_members ?? stats.inactiveMembers ?? 0)}</div>
                    <div class="stat-change negative">↑ 5% from last month</div>
                </div>
                <div class="stat-icon orange">
                    <i class="fas fa-user-times"></i>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <h2 class="card-title">All Members</h2>
                    <div style="display: flex; gap: 8px;">
                        <select style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>New</option>
                        </select>
                        <button class="btn btn-secondary btn-sm">
                            <i class="fas fa-download"></i> Export
                        </button>
                        <button class="btn btn-secondary btn-sm">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Search members...">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>MEMBER</th>
                                <th>CONTACT</th>
                                <th>STATUS</th>
                                <th>MINISTRY</th>
                                <th>JOIN DATE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pagedMembers.length > 0 ? pagedMembers.map(member => `
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <div class="member-avatar">
                                                ${(member.first_name?.charAt(0) ?? member.firstName?.charAt(0) ?? '')}${(member.last_name?.charAt(0) ?? member.lastName?.charAt(0) ?? '')}
                                            </div>
                                            <div>
                                                <p style="font-weight: 500;">Member ID: ${member.member_id ?? ''}</p>
                                                <p style="font-weight: 500;">${member.first_name ?? member.firstName ?? ''} ${member.last_name ?? member.lastName ?? ''}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <p style="font-size: 14px;">${member.email ?? ''}</p>
                                            <p style="color: #64748b; font-size: 12px;">${member.phone ?? ''}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge ${(member.status ?? '').toLowerCase()}">${member.status ?? ''}</span>
                                    </td>
                                    <td>
                                        <div>
                                            ${(Array.isArray(member.ministry) && member.ministry.length > 0)
                                                ? member.ministry.map(m => `<div style="font-size: 12px;">${m}</div>`).join('')
                                                : '<span style="color: #64748b; font-size: 12px;">Not Assigned</span>'
                                            }
                                        </div>
                                    </td>
                                    <td>${member.join_date ? new Date(member.join_date).toLocaleDateString() : (member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '')}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" style="text-align:center; color:#64748b;">No members found.</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <div class="pagination-info">
                        Showing ${pagedMembers.length === 0 ? 0 : startIdx + 1} to ${endIdx} of ${safeLocale(totalMembers)} members
                    </div>
                    <div class="pagination-controls">
                        <button class="pagination-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                        ${Array.from({length: totalPages}, (_, i) => `
                            <button class="pagination-btn${currentPage === i + 1 ? ' active' : ''}" data-page="${i + 1}">${i + 1}</button>
                        `).join('')}
                        <button class="pagination-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Pagination event listeners
    const controls = content.querySelector('.pagination-controls');
    if (controls) {
        controls.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = btn.getAttribute('data-page');
                let newPage = currentPage;
                if (val === 'prev') newPage = Math.max(1, currentPage - 1);
                else if (val === 'next') newPage = Math.min(totalPages, currentPage + 1);
                else newPage = parseInt(val);
                if (newPage !== currentPage) {
                    renderMembers(app, content, headerActions, newPage, pageSize);
                }
            });
        });
    }

    attachMemberActionListeners(app);
}

export function attachMemberActionListeners(app) {
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const idText = row ? row.querySelector('p')?.textContent : null;
            let member = null;
            if (idText && idText.startsWith('Member ID:')) {
                const memberId = idText.replace('Member ID:', '').trim();
                member = app.data.members.members.find(m => (m.id + '') === memberId);
            }
            if (!member) {
                const nameText = row ? row.querySelectorAll('p')[1]?.textContent : null;
                if (nameText) {
                    const [first, ...rest] = nameText.trim().split(' ');
                    const last = rest.join(' ');
                    member = app.data.members.members.find(m =>
                        (m.first_name === first && m.last_name === last) ||
                        (m.firstName === first && m.lastName === last)
                    );
                }
            }
            if (member) {
                fillMemberModal('view-member-modal', member);
                app.openModal('view-member-modal');
            }
        });
    });
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const idText = row ? row.querySelector('p')?.textContent : null;
            let member = null;
            if (idText && idText.startsWith('Member ID:')) {
                const memberId = idText.replace('Member ID:', '').trim();
                member = app.data.members.members.find(m => (m.id + '') === memberId);
            }
            if (!member) {
                const nameText = row ? row.querySelectorAll('p')[1]?.textContent : null;
                if (nameText) {
                    const [first, ...rest] = nameText.trim().split(' ');
                    const last = rest.join(' ');
                    member = app.data.members.members.find(m =>
                        (m.first_name === first && m.last_name === last) ||
                        (m.firstName === first && m.lastName === last)
                    );
                }
            }
            if (member) {
                fillMemberModal('edit-member-modal', member);
                app.openModal('edit-member-modal');
            }
        });
    });
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const row = e.target.closest('tr');
            const idText = row ? row.querySelector('p')?.textContent : null;
            let member = null;
            if (idText && idText.startsWith('Member ID:')) {
                const memberId = idText.replace('Member ID:', '').trim();
                member = app.data.members.members.find(m => (m.id + '') === memberId);
            }
            if (!member) {
                const nameText = row ? row.querySelectorAll('p')[1]?.textContent : null;
                if (nameText) {
                    const [first, ...rest] = nameText.trim().split(' ');
                    const last = rest.join(' ');
                    member = app.data.members.members.find(m =>
                        (m.first_name === first && m.last_name === last) ||
                        (m.firstName === first && m.lastName === last)
                    );
                }
            }
            if (member && member.id) {
                try {
                    await deleteMember(member.id);
                    await app.loadData();
                    app.renderPage('members');
                    showToast('Member deleted!', 'success');
                } catch (err) {
                    showToast('Failed to delete member: ' + (err.message || 'Unknown error'), 'error');
                    console.error('Failed to delete member:', err);
                }
            }
        });
    });
}
