// frontend/dashboard.js
import { renderCalendar } from './utils.js';

// Dashboard rendering logic
export function renderDashboard(app, content, headerActions) {
    // ...moved logic from app.js, replacing 'this' with 'app'...
    headerActions.innerHTML = `
        <button class="btn btn-success btn-sm">
            <i class="fas fa-plus"></i> Add Event
        </button>
    `;
    const stats = app.data.members.stats || {};
    const recentEvents = (app.data.events.events || []).slice(0, 3);
    const donationStats = app.data.donations.stats || {};
    content.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Members</h3>
                    <div class="stat-value">${(stats.totalMembers ?? 0).toLocaleString()}</div>
                    <div class="stat-change positive">↑ 12% from last month</div>
                </div>
                <div class="stat-icon blue">
                    <i class="fas fa-users"></i>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Active Members</h3>
                    <div class="stat-value">${(stats.activeMembers ?? 0).toLocaleString()}</div>
                    <div class="stat-change positive">↑ 8% from last month</div>
                </div>
                <div class="stat-icon green">
                    <i class="fas fa-user-check"></i>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>New This Month</h3>
                    <div class="stat-value">${stats.newThisMonth ?? 0}</div>
                    <div class="stat-change negative">↓ 3% from last month</div>
                </div>
                <div class="stat-icon purple">
                    <i class="fas fa-user-plus"></i>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Inactive Members</h3>
                    <div class="stat-value">${stats.inactiveMembers ?? 0}</div>
                    <div class="stat-change negative">↑ 5% from last month</div>
                </div>
                <div class="stat-icon orange">
                    <i class="fas fa-user-times"></i>
                </div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Recent Events</h2>
                    <button class="btn btn-secondary btn-sm">View All</button>
                </div>
                <div class="card-content">
                    ${recentEvents.length > 0 ? recentEvents.map(event => `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1e40af;">
                                    <i class="fas fa-calendar"></i>
                                </div>
                                <div>
                                    <h3 style="font-weight: 600; margin-bottom: 4px;">${event.title ?? ''}</h3>
                                    <p style="color: #64748b; font-size: 14px; margin-bottom: 4px;">${event.date ?? ''} • ${event.time ?? ''}</p>
                                    <p style="color: #9ca3af; font-size: 12px;">${event.location ?? ''}</p>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-weight: 500; margin-bottom: 4px;">${event.attendance ?? 0} attendees</p>
                                <span class="badge ${(event.status ?? '').toLowerCase()}">${event.status ?? ''}</span>
                            </div>
                        </div>
                    `).join('') : '<div style="color:#64748b; text-align:center;">No recent events.</div>'}
                </div>
            </div>
            <div>
                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-dollar-sign"></i> Donations This Month
                        </h2>
                    </div>
                    <div class="card-content">
                        <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                            ₦${(donationStats.totalThisMonth ?? 0).toLocaleString()}
                        </div>
                        <p style="color: #10b981; font-size: 14px; margin-bottom: 16px;">
                            <i class="fas fa-trending-up"></i> +3.8% from last month
                        </p>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 14px;">Average Donation</span>
                            <span style="font-size: 14px;">₦${donationStats.averageDonation ?? 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 14px;">Total Donors</span>
                            <span style="font-size: 14px;">${donationStats.totalDonors ?? 0}</span>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Upcoming Events</h2>
                    </div>
                    <div class="card-content">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
                            <div>
                                <p style="font-weight: 500; font-size: 14px;">Sunday Service</p>
                                <p style="color: #64748b; font-size: 12px;">Tomorrow, 9:00 AM</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%;"></div>
                            <div>
                                <p style="font-weight: 500; font-size: 14px;">Youth Group</p>
                                <p style="color: #64748b; font-size: 12px;">Friday, 7:00 PM</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                            <div>
                                <p style="font-weight: 500; font-size: 14px;">Bible Study</p>
                                <p style="color: #64748b; font-size: 12px;">Wednesday, 7:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
