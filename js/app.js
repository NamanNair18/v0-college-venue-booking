// State management
const app = {
    currentUser: null,
    userType: null,
    bookings: [],
    venues: {
        auditoriums: [
            { id: 1, name: 'Main Auditorium', capacity: 500, location: 'Building A' },
            { id: 2, name: 'Conference Hall', capacity: 200, location: 'Building B' },
            { id: 3, name: 'Lecture Theater', capacity: 300, location: 'Building C' }
        ],
        labs: [
            { id: 4, name: 'Computer Lab 1', capacity: 40, location: 'Building D' },
            { id: 5, name: 'Physics Lab', capacity: 30, location: 'Building E' },
            { id: 6, name: 'Biology Lab', capacity: 25, location: 'Building F' }
        ]
    },
    admins: [
        { username: 'admin', password: 'admin123', email: 'admin@college.edu' }
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderLogin();
});

// Auth functions
function renderLogin() {
    document.body.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <div class="auth-header">
                    <h1>College Venue Booking</h1>
                    <p>Professional academic event management</p>
                </div>
                <div class="auth-buttons">
                    <button class="btn btn-primary" onclick="app.handleFacultyLogin()">
                        Faculty Login
                    </button>
                    <button class="btn btn-secondary" onclick="showAdminLogin()">
                        Admin Login
                    </button>
                </div>
            </div>
        </div>
        ${getAdminLoginModal()}
    `;
}

function showAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    modal.classList.add('active');
}

function getAdminLoginModal() {
    return `
        <div id="adminLoginModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span>Admin Login</span>
                    <button class="modal-close" onclick="document.getElementById('adminLoginModal').classList.remove('active')">×</button>
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="adminUsername" placeholder="Enter admin username">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="adminPassword" placeholder="Enter admin password">
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="document.getElementById('adminLoginModal').classList.remove('active')">Cancel</button>
                    <button class="btn btn-primary" onclick="app.handleAdminLogin()">Login</button>
                </div>
            </div>
        </div>
    `;
}

app.handleFacultyLogin = function() {
    // Simulated Google OAuth flow
    this.currentUser = {
        name: 'Dr. John Smith',
        email: 'john.smith@college.edu',
        department: 'Computer Science'
    };
    this.userType = 'faculty';
    renderFacultyDashboard();
};

app.handleAdminLogin = function() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    const admin = this.admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
        this.currentUser = { name: 'Admin', email: admin.email };
        this.userType = 'admin';
        document.getElementById('adminLoginModal').classList.remove('active');
        renderAdminDashboard();
    } else {
        alert('Invalid credentials');
    }
};

// Faculty Dashboard
function renderFacultyDashboard() {
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand">College Venue Booking System</div>
            <ul class="navbar-menu">
                <li><a onclick="renderFacultyDashboard()" class="active">Dashboard</a></li>
                <li><a onclick="renderBookingHistory()">Booking History</a></li>
            </ul>
            <div class="navbar-right">
                <div class="user-info">${app.currentUser.name}</div>
                <button class="logout-btn" onclick="renderLogin()">Logout</button>
            </div>
        </nav>

        <div class="container">
            <div class="dashboard">
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <button class="tab active" onclick="switchTab('auditoriums')">Auditorium Booking</button>
                    <button class="tab" onclick="switchTab('labs')">Lab Booking</button>
                </div>

                <div id="auditoriums" class="tab-content">
                    ${renderVenueBooking(app.venues.auditoriums, 'Auditorium')}
                </div>
                <div id="labs" class="tab-content" style="display: none;">
                    ${renderVenueBooking(app.venues.labs, 'Lab')}
                </div>
            </div>
        </div>
        
        ${getBookingModal()}
    `;
}

function renderVenueBooking(venues, type) {
    return `
        <div class="venues-grid">
            ${venues.map(venue => `
                <div class="venue-card">
                    <div class="venue-card-header">${venue.name}</div>
                    <div class="venue-card-body">
                        <div class="venue-info">
                            <span class="venue-info-label">Capacity:</span>
                            <span class="venue-info-value">${venue.capacity} persons</span>
                        </div>
                        <div class="venue-info">
                            <span class="venue-info-label">Location:</span>
                            <span class="venue-info-value">${venue.location}</span>
                        </div>
                        <div class="venue-actions">
                            <button class="btn btn-primary" onclick="openBookingModal(${venue.id}, '${venue.name}')">Book Now</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getBookingModal() {
    return `
        <div id="bookingModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span>Book Venue</span>
                    <button class="modal-close" onclick="closeBookingModal()">×</button>
                </div>
                <div class="form-group">
                    <label>Venue Name</label>
                    <input type="text" id="bookingVenue" disabled>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="bookingDate" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Time Slot</label>
                        <select id="bookingTime">
                            <option value="">Select time</option>
                            <option value="09:00-11:00">9:00 AM - 11:00 AM</option>
                            <option value="11:00-13:00">11:00 AM - 1:00 PM</option>
                            <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                            <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Number of Students</label>
                        <input type="number" id="bookingStudents" min="1" placeholder="Enter number">
                    </div>
                    <div class="form-group">
                        <label>Equipment Required</label>
                        <input type="text" id="bookingEquipment" placeholder="e.g., Projector, Microphone">
                    </div>
                </div>
                <div class="form-group form-row full">
                    <label>Event Description</label>
                    <textarea id="bookingDescription" placeholder="Describe the event..." style="min-height: 100px;"></textarea>
                </div>
                <div id="suggestionBox" class="suggestions" style="display: none;"></div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="submitBooking()">Submit Booking</button>
                </div>
            </div>
        </div>
    `;
}

function openBookingModal(venueId, venueName) {
    const modal = document.getElementById('bookingModal');
    document.getElementById('bookingVenue').value = venueName;
    modal.classList.add('active');
    
    document.getElementById('bookingStudents').addEventListener('input', (e) => {
        const students = parseInt(e.target.value);
        suggestVenues(students);
    });
}

function suggestVenues(studentCount) {
    const allVenues = [...app.venues.auditoriums, ...app.venues.labs];
    const suitable = allVenues.filter(v => v.capacity >= studentCount);
    
    if (suitable.length > 0) {
        const suggestionBox = document.getElementById('suggestionBox');
        suggestionBox.style.display = 'block';
        suggestionBox.innerHTML = `
            <strong>Venue Suggestions (Capacity: ${studentCount}+)</strong>
            <ul>
                ${suitable.map(v => `<li>${v.name} - Capacity: ${v.capacity}</li>`).join('')}
            </ul>
        `;
    }
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

function submitBooking() {
    const booking = {
        id: Date.now(),
        venue: document.getElementById('bookingVenue').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        students: document.getElementById('bookingStudents').value,
        equipment: document.getElementById('bookingEquipment').value,
        description: document.getElementById('bookingDescription').value,
        status: 'pending',
        faculty: app.currentUser.name
    };
    
    app.bookings.push(booking);
    closeBookingModal();
    alert('Booking submitted successfully! Status: Pending approval');
    renderFacultyDashboard();
}

function renderBookingHistory() {
    const userBookings = app.bookings.filter(b => b.faculty === app.currentUser.name);
    const pending = userBookings.filter(b => b.status === 'pending');
    const approved = userBookings.filter(b => b.status === 'approved');
    const rejected = userBookings.filter(b => b.status === 'rejected');
    
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand">College Venue Booking System</div>
            <ul class="navbar-menu">
                <li><a onclick="renderFacultyDashboard()">Dashboard</a></li>
                <li><a onclick="renderBookingHistory()" class="active">Booking History</a></li>
            </ul>
            <div class="navbar-right">
                <div class="user-info">${app.currentUser.name}</div>
                <button class="logout-btn" onclick="renderLogin()">Logout</button>
            </div>
        </nav>

        <div class="container">
            <h2 style="color: var(--primary); margin-bottom: 30px;">Your Booking History</h2>
            
            <div style="display: grid; gap: 30px;">
                ${createBookingSection('Pending Requests', pending, 'pending')}
                ${createBookingSection('Approved Bookings', approved, 'approved')}
                ${createBookingSection('Rejected Bookings', rejected, 'rejected')}
            </div>
        </div>
    `;
}

function createBookingSection(title, bookings, status) {
    return `
        <div class="card">
            <div class="card-header">${title}</div>
            ${bookings.length === 0 ? '<p style="color: var(--text-secondary);">No bookings found</p>' : `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr>
                                <td>${b.venue}</td>
                                <td>${b.date}</td>
                                <td>${b.time}</td>
                                <td><span class="status-badge status-${status}">${status}</span></td>
                                <td>
                                    ${status === 'approved' ? `<button class="btn btn-primary" onclick="downloadQR(${b.id})" style="padding: 6px 12px; font-size: 12px;">Download QR</button>` : '-'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}
        </div>
    `;
}

// Admin Dashboard
function renderAdminDashboard() {
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand">College Venue Booking System - Admin</div>
            <ul class="navbar-menu">
                <li><a onclick="renderAdminDashboard()" class="active">Dashboard</a></li>
                <li><a onclick="renderCalendarView()">Calendar View</a></li>
            </ul>
            <div class="navbar-right">
                <div class="user-info">${app.currentUser.name}</div>
                <button class="logout-btn" onclick="renderLogin()">Logout</button>
            </div>
        </nav>

        <div class="container">
            <div class="dashboard">
                ${renderFilterSection()}
                
                <div style="display: grid; gap: 30px; grid-template-columns: 1fr 1fr;">
                    ${createAdminBookingCard('Pending Requests', app.bookings.filter(b => b.status === 'pending'), 'pending')}
                    ${createAdminBookingCard('Approved Bookings', app.bookings.filter(b => b.status === 'approved'), 'approved')}
                </div>
            </div>
        </div>
    `;
}

function renderFilterSection() {
    return `
        <div class="filter-section">
            <div class="filter-group">
                <label>Filter by Date</label>
                <input type="date" id="filterDate">
            </div>
            <div class="filter-group">
                <label>Filter by Venue</label>
                <select id="filterVenue">
                    <option value="">All Venues</option>
                    ${[...app.venues.auditoriums, ...app.venues.labs].map(v => `
                        <option value="${v.name}">${v.name}</option>
                    `).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Filter by Status</label>
                <select id="filterStatus">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>
    `;
}

function createAdminBookingCard(title, bookings, status) {
    return `
        <div class="card">
            <div class="card-header">${title}</div>
            ${bookings.length === 0 ? '<p style="color: var(--text-secondary);">No bookings</p>' : `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr>
                                <td>${b.faculty}</td>
                                <td>${b.venue}</td>
                                <td>${b.date}</td>
                                <td style="display: flex; gap: 10px;">
                                    ${status === 'pending' ? `
                                        <button class="btn btn-success" onclick="approveBooking(${b.id})" style="padding: 6px 12px; font-size: 12px;">Approve</button>
                                        <button class="btn btn-danger" onclick="rejectBooking(${b.id})" style="padding: 6px 12px; font-size: 12px;">Reject</button>
                                    ` : `
                                        <button class="btn btn-primary" onclick="downloadQR(${b.id})" style="padding: 6px 12px; font-size: 12px;">Download QR</button>
                                    `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}
        </div>
    `;
}

function approveBooking(bookingId) {
    const booking = app.bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'approved';
        renderAdminDashboard();
    }
}

function rejectBooking(bookingId) {
    const booking = app.bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'rejected';
        renderAdminDashboard();
    }
}

function downloadQR(bookingId) {
    const booking = app.bookings.find(b => b.id === bookingId);
    if (booking) {
        const qrData = `Booking ID: ${booking.id}
Venue: ${booking.venue}
Date: ${booking.date}
Time: ${booking.time}`;
        alert('QR Code Data:\n' + qrData + '\n\n(In production, this would be a downloadable QR image)');
    }
}

function renderCalendarView() {
    const approvedBookings = app.bookings.filter(b => b.status === 'approved');
    
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand">College Venue Booking System - Admin</div>
            <ul class="navbar-menu">
                <li><a onclick="renderAdminDashboard()">Dashboard</a></li>
                <li><a onclick="renderCalendarView()" class="active">Calendar View</a></li>
            </ul>
            <div class="navbar-right">
                <div class="user-info">${app.currentUser.name}</div>
                <button class="logout-btn" onclick="renderLogin()">Logout</button>
            </div>
        </nav>

        <div class="container">
            <h2 style="color: var(--primary); margin-bottom: 20px;">Approved Events Calendar</h2>
            ${generateCalendarHTML(approvedBookings)}
        </div>
    `;
}

function generateCalendarHTML(bookings) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const bookingsByDate = {};
    bookings.forEach(b => {
        bookingsByDate[b.date] = bookingsByDate[b.date] ? bookingsByDate[b.date] + 1 : 1;
    });
    
    let html = `<div class="card"><table class="calendar"><thead><tr>`;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => html += `<th>${d}</th>`);
    html += `</tr></thead><tbody><tr>`;
    
    for (let i = 0; i < firstDay; i++) {
        html += `<td class="other-month">-</td>`;
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = bookingsByDate[dateStr];
        html += `<td class="${hasEvent ? 'event' : ''}">${day}${hasEvent ? `<br><small>${hasEvent} event(s)</small>` : ''}</td>`;
        
        if ((firstDay + day) % 7 === 0 && day < daysInMonth) html += `</tr><tr>`;
    }
    
    html += `</tr></tbody></table></div>`;
    return html;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
}
