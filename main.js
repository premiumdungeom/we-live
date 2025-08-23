 // Live Flow Platform - Main JavaScript File

// ===== PLATFORM INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializePlatform();
});

function initializePlatform() {
    // Check if we're on the index page with welcome animation
    if (document.querySelector('.welcome-container')) {
        initializeWelcomeAnimation();
    }
    
    // Initialize video cards if on a page that has them
    if (document.querySelectorAll('.video-card').length > 0) {
        initializeVideoCards();
    }
    
    // Initialize verification inputs if on verification page
    if (document.querySelectorAll('.verification-input').length > 0) {
        initializeVerificationInputs();
    }
    
    // Initialize admin functionality if on admin page
    if (document.getElementById('update-title')) {
        initializeAdminFunctionality();
    }
    
    // Load any saved updates if on updates page
    if (document.querySelector('.update-card') || document.querySelector('.update-item')) {
        loadUpdates();
    }
    
    // Initialize profile picture upload if on profile setup page
    if (document.getElementById('avatarInput')) {
        initializeAvatarUpload();
    }
    
    // Check authentication status
    checkAuthStatus();
    
    // Load user profile if on profile page
    if (document.getElementById('profileAvatar')) {
        loadUserProfile();
    }
    
    // Initialize profile page if on profile page
    if (document.querySelector('.profile-container')) {
        initializeProfilePage();
    }
}

// ===== WELCOME ANIMATION =====
function initializeWelcomeAnimation() {
    const welcomeContainer = document.getElementById('welcomeAnimation');
    
    if (!welcomeContainer) return;
    
    // After 4 seconds, hide the welcome animation with a fade effect
    setTimeout(function() {
        welcomeContainer.classList.add('hidden');
        
        // Remove from DOM after animation completes
        setTimeout(function() {
            welcomeContainer.style.display = 'none';
        }, 500); // Match the transition duration
    }, 4000); // 4 seconds total (1.5s drop + 2.5s text display)
}

// ===== VIDEO CARDS =====
function initializeVideoCards() {
    // Add click event to video cards
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get streamer name from the card
            const streamerName = this.querySelector('.creator-name').textContent;
            alert(`You would be taken to ${streamerName}'s stream page!`);
        });
    });
}

// ===== VERIFICATION INPUTS =====
function initializeVerificationInputs() {
    // Focus on the first input
    const firstInput = document.querySelector('.verification-input');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
        }, 100);
    }
}

// Function to move to next verification input
function moveToNext(current, nextIndex) {
    if (current.value.length === 1) {
        if (nextIndex <= 6) {
            const inputs = document.querySelectorAll('.verification-input');
            if (inputs[nextIndex]) {
                inputs[nextIndex].focus();
            }
        } else {
            // If it's the last input, attempt auto-verification
            attemptAutoVerification();
        }
    }
}

function attemptAutoVerification() {
    // Check if all inputs are filled
    const inputs = document.querySelectorAll('.verification-input');
    let allFilled = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            allFilled = false;
        }
    });
    
    if (allFilled) {
        // In a real app, this would verify the code with the server
        // For demo, we'll just proceed after a short delay
        setTimeout(() => {
            window.location.href = 'profile-setup.html';
        }, 500);
    }
}

// ===== AUTHENTICATION FUNCTIONS =====
function checkAuthStatus() {
    // Check if user is logged in (in a real app, this would check with server)
    const isLoggedIn = localStorage.getItem('liveFlowUserLoggedIn') === 'true';
    
    // Update UI based on auth status
    const userActions = document.getElementById('userActions');
    const userProfile = document.getElementById('userProfile');
    
    if (userActions && userProfile) {
        if (isLoggedIn) {
            userActions.classList.add('hidden');
            userProfile.classList.remove('hidden');
            
            // Load saved avatar if exists
            const savedAvatar = localStorage.getItem('userAvatar');
            const profileImg = userProfile.querySelector('.user-avatar');
            if (savedAvatar && profileImg) {
                profileImg.src = savedAvatar;
            }
        } else {
            userActions.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }
}

// Function to handle login
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    
    // In a real app, this would validate credentials with the server
    // For demo purposes, we'll simulate a successful login
    localStorage.setItem('liveFlowUserLoggedIn', 'true');
    localStorage.setItem('liveFlowUserEmail', email);
    
    // Redirect to main page
    window.location.href = 'main.html';
}

// Function to handle logout
function logout() {
    localStorage.removeItem('liveFlowUserLoggedIn');
    localStorage.removeItem('liveFlowUserEmail');
    window.location.href = 'index.html';
}

// Function to complete signup and go to main page
function completeSignup() {
    // Get profile data
    const displayName = document.getElementById('displayName').value;
    const bio = document.getElementById('bio').value;
    const avatar = localStorage.getItem('userAvatar') || 'https://placehold.co/120x120/9147ff/ffffff?text=U';
    
    // Validate required fields
    if (!displayName) {
        alert('Please enter a display name.');
        return;
    }
    
    // Save user data
    const userData = {
        displayName,
        bio,
        avatar,
        joinDate: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('liveFlowUserLoggedIn', 'true');
    
    // Redirect to main page
    window.location.href = 'main.html';
}

// ===== PROFILE PAGE FUNCTIONALITY =====
function initializeProfilePage() {
    // Load user data
    loadUserProfile();
    
    // Initialize tab navigation
    initializeProfileTabs();
    
    // Initialize avatar upload
    if (document.getElementById('avatarInput')) {
        initializeAvatarUpload();
    }
}

function initializeProfileTabs() {
    const tabItems = document.querySelectorAll('.profile-nav-item');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabItems.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show active content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

function loadUserProfile() {
    // Load saved user data
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const userEmail = localStorage.getItem('liveFlowUserEmail') || 'user@example.com';
    
    // Set profile values
    if (userData.displayName) {
        document.getElementById('profileDisplayName').textContent = userData.displayName;
        if (document.getElementById('editDisplayName')) {
            document.getElementById('editDisplayName').value = userData.displayName;
        }
    }
    
    if (userData.bio) {
        document.getElementById('profileBio').textContent = userData.bio;
        document.getElementById('aboutBio').textContent = userData.bio;
        if (document.getElementById('editBio')) {
            document.getElementById('editBio').value = userData.bio;
        }
    }
    
    // Set username from email
    const username = userEmail.split('@')[0];
    document.getElementById('profileUsername').textContent = `@${username}`;
    if (document.getElementById('editUsername')) {
        document.getElementById('editUsername').value = username;
    }
    
    // Load saved avatar if exists
    const savedAvatar = localStorage.getItem('userAvatar');
    const profileAvatar = document.getElementById('profileAvatar');
    const headerAvatar = document.getElementById('headerAvatar');
    
    if (savedAvatar && profileAvatar) {
        profileAvatar.src = savedAvatar;
    }
    
    if (savedAvatar && headerAvatar) {
        headerAvatar.src = savedAvatar;
    }
    
    // Set join date
    const joinDate = userData.joinDate ? new Date(userData.joinDate) : new Date();
    const joinDateStr = joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const joinDateElement = document.querySelector('.profile-join-date');
    if (joinDateElement) {
        joinDateElement.innerHTML = `<i class="fas fa-calendar-plus"></i> Joined ${joinDateStr}`;
    }
}

function editProfile() {
    // Load current values into form
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (userData.displayName) {
        document.getElementById('editDisplayName').value = userData.displayName;
    }
    
    if (userData.bio) {
        document.getElementById('editBio').value = userData.bio;
    }
    
    // Show modal
    document.getElementById('editProfileModal').classList.add('show');
}

function closeModal() {
    document.getElementById('editProfileModal').classList.remove('show');
}

function saveProfile() {
    // Get form values
    const displayName = document.getElementById('editDisplayName').value;
    const username = document.getElementById('editUsername').value;
    const bio = document.getElementById('editBio').value;
    
    // Validate
    if (!displayName || !username) {
        alert('Please enter both display name and username.');
        return;
    }
    
    // Save user data
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    userData.displayName = displayName;
    userData.bio = bio;
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update UI
    document.getElementById('profileDisplayName').textContent = displayName;
    document.getElementById('profileUsername').textContent = `@${username}`;
    document.getElementById('profileBio').textContent = bio;
    document.getElementById('aboutBio').textContent = bio;
    
    // Close modal
    closeModal();
    
    // Show success message
    alert('Profile updated successfully!');
}

// ===== PROFILE PICTURE UPLOAD =====
function initializeAvatarUpload() {
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const uploadError = document.getElementById('uploadError');
    
    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (!file) return;
            
            // Check if file is an image
            if (!file.type.match('image.*')) {
                showUploadError('Please select an image file (JPEG, PNG, etc.)');
                return;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showUploadError('Image must be less than 5MB');
                return;
            }
            
            // Clear any previous errors
            clearUploadError();
            
            // Preview the image
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
                
                // Save to localStorage for demo purposes
                // In a real app, this would upload to a server
                localStorage.setItem('userAvatar', e.target.result);
                
                // Update header avatar if exists
                const headerAvatar = document.querySelector('.user-avatar');
                if (headerAvatar) {
                    headerAvatar.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        });
    }
    
    function showUploadError(message) {
        if (uploadError) {
            uploadError.textContent = message;
            uploadError.style.display = 'block';
        }
    }
    
    function clearUploadError() {
        if (uploadError) {
            uploadError.textContent = '';
            uploadError.style.display = 'none';
        }
    }
}

// ===== ADMIN FUNCTIONALITY =====
function initializeAdminFunctionality() {
    // Load existing updates from localStorage
    loadUpdatesForAdmin();
    
    // Set up form submission handler
    const form = document.querySelector('.auth-card');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createUpdate();
        });
    }
}

// Function to create a new update
function createUpdate() {
    const title = document.getElementById('update-title').value;
    const content = document.getElementById('update-content').value;
    const type = document.getElementById('update-type').value;
    const importance = document.getElementById('update-importance').value;
    const pinned = document.getElementById('update-pinned').checked;
    
    if (!title || !content) {
        alert('Please fill in both title and content fields.');
        return;
    }
    
    // Create update object
    const newUpdate = {
        id: Date.now(), // Unique ID based on timestamp
        title,
        content,
        type,
        importance,
        pinned,
        date: new Date().toISOString(),
        views: 0
    };
    
    // Save to localStorage (in a real app, this would go to a database)
    saveUpdate(newUpdate);
    
    // Show confirmation
    alert(`Update published successfully!\n\nTitle: ${title}\nType: ${type}\nImportance: ${importance}\nPinned: ${pinned ? 'Yes' : 'No'}`);
    
    // Clear the form
    document.getElementById('update-title').value = '';
    document.getElementById('update-content').value = '';
    document.getElementById('update-type').value = 'news';
    document.getElementById('update-importance').value = 'normal';
    document.getElementById('update-pinned').checked = false;
    
    // Reload updates
    loadUpdatesForAdmin();
}

// Function to save update to localStorage
function saveUpdate(update) {
    let updates = JSON.parse(localStorage.getItem('liveFlowUpdates')) || [];
    
    // If pinned, unpin any previously pinned updates
    if (update.pinned) {
        updates = updates.map(u => {
            u.pinned = false;
            return u;
        });
    }
    
    // Add new update to the beginning of the array
    updates.unshift(update);
    
    // Save back to localStorage
    localStorage.setItem('liveFlowUpdates', JSON.stringify(updates));
}

// Function to load updates for admin page
function loadUpdatesForAdmin() {
    const updates = JSON.parse(localStorage.getItem('liveFlowUpdates')) || [];
    const updatesList = document.querySelector('.admin-updates-list');
    
    if (!updatesList) return;
    
    // Clear existing updates (except the first one which is the template)
    const existingUpdates = updatesList.querySelectorAll('.update-item');
    for (let i = 1; i < existingUpdates.length; i++) {
        existingUpdates[i].remove();
    }
    
    // Get the template
    const template = document.querySelector('.update-item');
    
    // Add each update to the list
    updates.forEach(update => {
        const updateElement = template.cloneNode(true);
        
        // Update content
        updateElement.querySelector('h4').textContent = update.title;
        updateElement.querySelector('.update-content p').textContent = update.content;
        
        // Update badges
        const badges = updateElement.querySelectorAll('.update-badge');
        badges.forEach(badge => badge.remove());
        
        // Add type badge
        const typeBadge = document.createElement('span');
        typeBadge.className = `update-badge update-badge-${update.type}`;
        typeBadge.textContent = getTypeDisplayName(update.type);
        updateElement.querySelector('.update-header').appendChild(typeBadge);
        
        // Add importance badge
        const importanceBadge = document.createElement('span');
        importanceBadge.className = `update-badge update-badge-${update.importance}`;
        importanceBadge.textContent = getImportanceDisplayName(update.importance);
        updateElement.querySelector('.update-header').appendChild(importanceBadge);
        
        // Add pinned badge if needed
        if (update.pinned) {
            const pinnedBadge = document.createElement('span');
            pinnedBadge.className = 'update-badge update-badge-pinned';
            pinnedBadge.textContent = 'Pinned';
            updateElement.querySelector('.update-header').appendChild(pinnedBadge);
        }
        
        // Update metadata
        const date = new Date(update.date);
        const dateStr = date.toLocaleDateString();
        const views = update.views || 0;
        
        updateElement.querySelector('.update-meta span:first-child').innerHTML = `<i class="fas fa-calendar"></i> Posted on ${dateStr}`;
        updateElement.querySelector('.update-meta span:nth-child(2)').innerHTML = `<i class="fas fa-eye"></i> ${views} views`;
        
        // Update button actions
        const editBtn = updateElement.querySelector('.update-actions .btn:nth-child(1)');
        const deleteBtn = updateElement.querySelector('.update-actions .btn:nth-child(2)');
        const pinBtn = updateElement.querySelector('.update-actions .btn:nth-child(3)');
        
        editBtn.onclick = () => editUpdate(update.id);
        deleteBtn.onclick = () => deleteUpdate(update.id);
        
        if (update.pinned) {
            pinBtn.innerHTML = '<i class="fas fa-times"></i> Unpin';
            pinBtn.onclick = () => togglePinUpdate(update.id, true);
        } else {
            pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i> Pin';
            pinBtn.onclick = () => togglePinUpdate(update.id, false);
        }
        
        // Add to list (after the template)
        updatesList.appendChild(updateElement);
    });
}

// Function to load updates for user page
function loadUpdates() {
    const updates = JSON.parse(localStorage.getItem('liveFlowUpdates')) || [];
    const updatesContainer = document.querySelector('.container');
    
    if (!updatesContainer || updates.length === 0) return;
    
    // Clear existing updates (keep only the first one as template if it exists)
    const existingUpdates = document.querySelectorAll('.update-card, .update-item');
    for (let i = 1; i < existingUpdates.length; i++) {
        existingUpdates[i].remove();
    }
    
    // Get template (if exists)
    let template = document.querySelector('.update-card');
    const isAdminPage = document.querySelector('.admin-updates-list');
    
    if (isAdminPage) {
        // We're on admin page, handled by loadUpdatesForAdmin
        return;
    }
    
    // Add each update to the page
    updates.forEach(update => {
        // Skip if no template (shouldn't happen)
        if (!template) return;
        
        const updateElement = template.cloneNode(true);
        
        // Remove pinned class if not pinned
        if (!update.pinned) {
            updateElement.classList.remove('pinned');
        }
        
        // Update content
        updateElement.querySelector('h3').textContent = update.title;
        
        // Remove the pin icon if not pinned
        if (!update.pinned) {
            const pinIcon = updateElement.querySelector('h3 i');
            if (pinIcon) {
                pinIcon.remove();
            }
        }
        
        // Clear existing badges
        const existingBadges = updateElement.querySelectorAll('.update-badge');
        existingBadges.forEach(badge => badge.remove());
        
        // Add type badge
        const typeBadge = document.createElement('span');
        typeBadge.className = `update-badge update-badge-${update.type}`;
        typeBadge.textContent = getTypeDisplayName(update.type);
        updateElement.querySelector('.update-header').appendChild(typeBadge);
        
        // Add importance badge if not normal
        if (update.importance !== 'normal') {
            const importanceBadge = document.createElement('span');
            importanceBadge.className = `update-badge update-badge-${update.importance}`;
            importanceBadge.textContent = getImportanceDisplayName(update.importance);
            updateElement.querySelector('.update-header').appendChild(importanceBadge);
        }
        
        // Update content
        const contentElement = updateElement.querySelector('.update-content');
        contentElement.innerHTML = formatUpdateContent(update.content);
        
        // Update metadata
        const date = new Date(update.date);
        const dateStr = formatDate(date);
        const views = update.views || 0;
        
        updateElement.querySelector('.update-meta').innerHTML = `
            <span><i class="fas fa-calendar"></i> ${dateStr}</span>
            <span><i class="fas fa-eye"></i> ${views} views</span>
        `;
        
        // Increment view count (simulated)
        update.views = (update.views || 0) + 1;
        
        // Add to page (before the template if it exists)
        template.parentNode.insertBefore(updateElement, template);
    });
    
    // Remove the template (it was just for cloning)
    if (template) {
        template.remove();
    }
    
    // Save updated view counts
    localStorage.setItem('liveFlowUpdates', JSON.stringify(updates));
}

// Helper function to format update content
function formatUpdateContent(content) {
    // Simple formatting - convert line breaks to paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

// Helper function to format date
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Helper function to get display name for update type
function getTypeDisplayName(type) {
    const typeMap = {
        'news': 'News',
        'announcement': 'Announcement',
        'maintenance': 'Maintenance',
        'feature': 'Feature'
    };
    
    return typeMap[type] || type;
}

// Helper function to get display name for importance
function getImportanceDisplayName(importance) {
    const importanceMap = {
        'low': 'Low Importance',
        'normal': 'Normal',
        'high': 'High Importance',
        'critical': 'Critical'
    };
    
    return importanceMap[importance] || importance;
}

// Function to edit an update
function editUpdate(id) {
    const updates = JSON.parse(localStorage.getItem('liveFlowUpdates')) || [];
    const update = updates.find(u => u.id === id);
    
    if (!update) {
        alert('Update not found.');
        return;
    }
    
    // Populate the form with update data
    document.getElementById('update-title').value = update.title;
    document.getElementById('update-content').value = update.content;
    document.getElementById('update-type').value = update.type;
    document.getElementById('update-importance').value = update.importance;
    document.getElementById('update-pinned').checked = update.pinned;
    
    // Scroll to form
    document.querySelector('.auth-card').scrollIntoView({ behavior: 'smooth' });
    
    // In a real app, you would change the form to edit mode
    alert('Form populated with update data. In a real app, you would now be in edit mode.');
}

// Function to delete an update
function deleteUpdate(id) {
    if (confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
        let updates = JSON.parse(localStorage.getItem('liveFlowUpdates')) || [];
        updates = updates.filter(u => u.id !== id);
        localStorage.setItem('liveFlowUpdates', JSON.stringify(updates));
        
        // Reload updates
        if (document.querySelector('.admin-updates-list')) {
            loadUpdatesForAdmin();
        } else {
            loadUpdates();
        }
        
        alert('Update deleted successfully.');
    }
}

// Function to pin/unpin an update
function togglePinUpdate(id, currentlyPinned) {
    let updates = JSON.parse(localStorage.getItem('liveFlowUpdates')) || [];
    const updateIndex = updates.findIndex(u => u.id === id);
    
    if (updateIndex === -1) {
        alert('Update not found.');
        return;
    }
    
    if (currentlyPinned) {
        // Unpin the update
        updates[updateIndex].pinned = false;
    } else {
        // Unpin any currently pinned updates
        updates = updates.map(u => {
            u.pinned = false;
            return u;
        });
        
        // Pin this update
        updates[updateIndex].pinned = true;
    }
    
    localStorage.setItem('liveFlowUpdates', JSON.stringify(updates));
    
    // Reload updates
    if (document.querySelector('.admin-updates-list')) {
        loadUpdatesForAdmin();
        } else {
        loadUpdates();
    }
    
    alert(`Update ${currentlyPinned ? 'unpinned' : 'pinned'} successfully.`);
}

// ===== UTILITY FUNCTIONS =====
// Function to show a notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s, transform 0.3s;
            }
            .notification-info { background-color: var(--primary); }
            .notification-success { background-color: var(--success); }
            .notification-warning { background-color: var(--warning); color: black; }
            .notification-error { background-color: var(--danger); }
            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to debounce other functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize with some sample updates if none exist
function initializeSampleUpdates() {
    const updates = JSON.parse(localStorage.getItem('liveFlowUpdates'));
    if (!updates || updates.length === 0) {
        const sampleUpdates = [
            {
                id: 1,
                title: "New Monetization Features",
                content: "We've launched new ways for creators to earn money on Live Flow:\n\n- Premium subscriptions with exclusive content\n- Virtual gifts that viewers can purchase and send\n- Ad revenue sharing program\n- Brand partnership marketplace",
                type: "feature",
                importance: "high",
                pinned: true,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                views: 1245
            },
            {
                id: 2,
                title: "Live Flow Mobile App Update",
                content: "Our latest app update includes:\n\n- Improved streaming quality\n- Enhanced chat moderation tools\n- Dark mode scheduling\n- Better notification system",
                type: "news",
                importance: "normal",
                pinned: false,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                views: 892
            },
            {
                id: 3,
                title: "Scheduled Maintenance Notice",
                content: "We'll be performing system maintenance on August 30th from 2:00 AM to 4:00 AM EST. During this time, Live Flow will be unavailable.\n\nWe apologize for any inconvenience and appreciate your understanding as we work to improve the platform.",
                type: "maintenance",
                importance: "critical",
                pinned: false,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                views: 1897
            }
        ];
        
        localStorage.setItem('liveFlowUpdates', JSON.stringify(sampleUpdates));
    }
}

// Discover Page Functionality

// Sample content data
const contentData = [
    {
        id: 1,
        title: "VALORANT Gameplay - Ranked Match",
        streamer: "ProGamer99",
        category: "gaming",
        viewers: 3200,
        live: true,
        thumbnail: "https://placehold.co/600x340/9147ff/ffffff?text=VALORANT+Gameplay",
        avatar: "https://placehold.co/40x40/9147ff/ffffff?text=P"
    },
    {
        id: 2,
        title: "Photoshop Editing Masterclass",
        streamer: "DesignMaster",
        category: "tutorials",
        viewers: 1500,
        live: true,
        thumbnail: "https://placehold.co/600x340/009d84/ffffff?text=Photoshop+Tutorial",
        avatar: "https://placehold.co/40x40/009d84/ffffff?text=D"
    },
    {
        id: 3,
        title: "Digital Painting Live Session",
        streamer: "ArtWithAmy",
        category: "creative",
        viewers: 890,
        live: true,
        thumbnail: "https://placehold.co/600x340/9147ff/ffffff?text=Digital+Painting",
        avatar: "https://placehold.co/40x40/9147ff/ffffff?text=A"
    },
    {
        id: 4,
        title: "Learn JavaScript Basics",
        streamer: "CodeTeacher",
        category: "education",
        viewers: 0,
        live: false,
        thumbnail: "https://placehold.co/600x340/eab300/000000?text=JavaScript+Tutorial",
        avatar: "https://placehold.co/40x40/eab300/000000?text=C"
    },
    {
        id: 5,
        title: "Chill Lofi Music Stream",
        streamer: "MelodyMaker",
        category: "music",
        viewers: 4200,
        live: true,
        thumbnail: "https://placehold.co/600x340/eb0400/ffffff?text=Lofi+Music",
        avatar: "https://placehold.co/40x40/eb0400/ffffff?text=M"
    },
    {
        id: 6,
        title: "Tech News & Discussion",
        streamer: "TechTalk",
        category: "talk",
        viewers: 2100,
        live: true,
        thumbnail: "https://placehold.co/600x340/9147ff/ffffff?text=Tech+Talk",
        avatar: "https://placehold.co/40x40/9147ff/ffffff?text=T"
    },
    {
        id: 7,
        title: "Fortnite Tournament Finals",
        streamer: "GameMaster",
        category: "gaming",
        viewers: 5800,
        live: true,
        thumbnail: "https://placehold.co/600x340/009d84/ffffff?text=Fortnite+Tournament",
        avatar: "https://placehold.co/40x40/009d84/ffffff?text=G"
    },
    {
        id: 8,
        title: "Video Editing Techniques",
        streamer: "EditPro",
        category: "tutorials",
        viewers: 0,
        live: false,
        thumbnail: "https://placehold.co/600x340/9147ff/ffffff?text=Video+Editing",
        avatar: "https://placehold.co/40x40/9147ff/ffffff?text=E"
    },
    {
        id: 9,
        title: "Digital Art for Beginners",
        streamer: "CreativeMind",
        category: "creative",
        viewers: 950,
        live: true,
        thumbnail: "https://placehold.co/600x340/eab300/000000?text=Digital+Art",
        avatar: "https://placehold.co/40x40/eab300/000000?text=C"
    },
    {
        id: 10,
        title: "Piano Cover Session",
        streamer: "MusicLover",
        category: "music",
        viewers: 1300,
        live: true,
        thumbnail: "https://placehold.co/600x340/eb0400/ffffff?text=Piano+Covers",
        avatar: "https://placehold.co/40x40/eb0400/ffffff?text=M"
    },
    {
        id: 11,
        title: "Science Explained Simply",
        streamer: "ScienceGeek",
        category: "education",
        viewers: 0,
        live: false,
        thumbnail: "https://placehold.co/600x340/9147ff/ffffff?text=Science+Education",
        avatar: "https://placehold.co/40x40/9147ff/ffffff?text=S"
    },
    {
        id: 12,
        title: "Current Events Discussion",
        streamer: "NewsAnalyst",
        category: "talk",
        viewers: 1800,
        live: true,
        thumbnail: "https://placehold.co/600x340/009d84/ffffff?text=Current+Events",
        avatar: "https://placehold.co/40x40/009d84/ffffff?text=N"
    }
];

// Initialize discover page
function initializeDiscoverPage() {
    loadContent();
    setupEventListeners();
}

// Load content based on category and search
function loadContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const searchQuery = urlParams.get('search') || '';
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Set search input value
    if (searchQuery) {
        document.getElementById('searchInput').value = searchQuery;
    }
    
    // Filter content based on category and search
    let filteredContent = contentData;
    
    if (category !== 'all') {
        filteredContent = filteredContent.filter(item => item.category === category);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredContent = filteredContent.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.streamer.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }
    
    // Separate live and recorded content
    const liveContent = filteredContent.filter(item => item.live);
    const recordedContent = filteredContent.filter(item => !item.live);
    
    // Display content
    displayContent('liveStreams', liveContent.slice(0, 4));
    displayContent('popularContent', getPopularContent(filteredContent));
    displayContent('recommendedContent', getRecommendedContent(filteredContent));
}

// Display content in a grid
function displayContent(containerId, content) {
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (content.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No content found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = content.map(item => `
        <div class="stream-card" data-id="${item.id}">
            <div class="stream-thumbnail">
                <img src="${item.thumbnail}" alt="${item.title}">
                ${item.live ? `
                    <div class="live-badge"><i class="fas fa-circle"></i> LIVE</div>
                    <div class="viewer-count"><i class="fas fa-eye"></i> ${formatNumber(item.viewers)}</div>
                ` : ''}
                <div class="category-tag">${getCategoryName(item.category)}</div>
            </div>
            <div class="stream-info">
                <h3 class="stream-title">${item.title}</h3>
                <div class="streamer-info">
                    <img src="${item.avatar}" alt="${item.streamer}" class="streamer-avatar">
                    <a href="#" class="streamer-name">${item.streamer}</a>
                </div>
                <div class="stream-game">${getCategoryName(item.category)}</div>
            </div>
        </div>
    `).join('');
    
    // Add click event to stream cards
    container.querySelectorAll('.stream-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            const stream = content.find(item => item.id == id);
            if (stream) {
                alert(`You would be taken to ${stream.streamer}'s ${stream.live ? 'live stream' : 'video'}!`);
            }
        });
    });
}

// Get popular content (most viewers)
function getPopularContent(content) {
    return [...content]
        .sort((a, b) => b.viewers - a.viewers)
        .slice(0, 4);
}

// Get recommended content (based on user preferences)
function getRecommendedContent(content) {
    // In a real app, this would be based on user viewing history and preferences
    // For demo, we'll just return a random selection
    return [...content]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'gaming': 'Gaming',
        'tutorials': 'Tutorial',
        'creative': 'Creative',
        'music': 'Music',
        'talk': 'Talk Show',
        'education': 'Education'
    };
    
    return categories[category] || category;
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Perform search
function performSearch() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    const currentCategory = document.querySelector('.category-btn.active').dataset.category;
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (currentCategory !== 'all') {
        params.set('category', currentCategory);
    }
    if (searchQuery) {
        params.set('search', searchQuery);
    }
    
    // Reload page with new parameters
    window.location.search = params.toString();
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            const searchQuery = document.getElementById('searchInput').value.trim();
            
            // Update URL with category parameter
            const params = new URLSearchParams();
            if (category !== 'all') {
                params.set('category', category);
            }
            if (searchQuery) {
                params.set('search', searchQuery);
            }
            
            // Reload page with new parameters
            window.location.search = params.toString();
        });
    });
    
    // Search input - allow Enter key to search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Initialize discover page when loaded
if (document.querySelector('.discover-header')) {
    document.addEventListener('DOMContentLoaded', function() {
        initializeDiscoverPage();
    });
}

// Call this function to initialize sample data
initializeSampleUpdates();

