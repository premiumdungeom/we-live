// Admin Panel Functionality

// Initialize admin panel
function initializeAdminPanel() {
    setupEventListeners();
    loadContentList();
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show active content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Show/hide schedule date based on status
    document.getElementById('contentStatus').addEventListener('change', function() {
        const scheduleGroup = document.getElementById('scheduleDateGroup');
        scheduleGroup.style.display = this.value === 'scheduled' ? 'block' : 'none';
    });
    
    // Thumbnail preview
    document.getElementById('contentThumbnail').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.querySelector('.thumbnail-preview');
        
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Thumbnail preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Filter content list
    document.getElementById('filterCategory').addEventListener('change', loadContentList);
    document.getElementById('filterStatus').addEventListener('change', loadContentList);
}

// Save content
function saveContent() {
    const title = document.getElementById('contentTitle').value;
    const category = document.getElementById('contentCategory').value;
    const description = document.getElementById('contentDescription').value;
    const type = document.getElementById('contentType').value;
    const status = document.getElementById('contentStatus').value;
    const scheduleDate = document.getElementById('contentScheduleDate').value;
    
    // Validate required fields
    if (!title || !category) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Create content object
    const content = {
        id: Date.now(),
        title,
        category,
        description,
        type,
        status,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0
    };
    
    // Add schedule date if scheduled
    if (status === 'scheduled' && scheduleDate) {
        content.scheduleDate = scheduleDate;
    }
    
    // Handle thumbnail if selected
    const thumbnailFile = document.getElementById('contentThumbnail').files[0];
    if (thumbnailFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            content.thumbnail = e.target.result;
            finishSavingContent(content);
        };
        reader.readAsDataURL(thumbnailFile);
    } else {
        // Use default thumbnail based on category
        content.thumbnail = getDefaultThumbnail(category);
        finishSavingContent(content);
    }
}

// Finish saving content after thumbnail processing
function finishSavingContent(content) {
    // Save to localStorage (in a real app, this would go to a server)
    let contents = JSON.parse(localStorage.getItem('liveFlowContent')) || [];
    contents.unshift(content);
    localStorage.setItem('liveFlowContent', JSON.stringify(contents));
    
    // Show success message
    alert(`Content "${content.title}" saved successfully!`);
    
    // Reset form
    document.getElementById('contentTitle').value = '';
    document.getElementById('contentCategory').value = '';
    document.getElementById('contentDescription').value = '';
    document.getElementById('contentType').value = 'stream';
    document.getElementById('contentStatus').value = 'draft';
    document.getElementById('contentScheduleDate').value = '';
    document.getElementById('contentThumbnail').value = '';
    document.querySelector('.thumbnail-preview').innerHTML = '<span>Thumbnail preview will appear here</span>';
    
    // Reload content list if on manage tab
    if (document.getElementById('manageTab').classList.contains('active')) {
        loadContentList();
    }
}

// Get default thumbnail based on category
function getDefaultThumbnail(category) {
    const thumbnails = {
        'gaming': 'https://placehold.co/600x340/9147ff/ffffff?text=Gaming',
        'tutorials': 'https://placehold.co/600x340/009d84/ffffff?text=Tutorial',
        'creative': 'https://placehold.co/600x340/9147ff/ffffff?text=Creative',
        'music': 'https://placehold.co/600x340/eb0400/ffffff?text=Music',
        'talk': 'https://placehold.co/600x340/eab300/000000?text=Talk+Show',
        'education': 'https://placehold.co/600x340/9147ff/ffffff?text=Education'
    };
    
    return thumbnails[category] || 'https://placehold.co/600x340/333333/ffffff?text=Live+Flow';
}

// Load content list
function loadContentList() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    let contents = JSON.parse(localStorage.getItem('liveFlowContent')) || [];
    
    // Apply filters
    if (categoryFilter) {
        contents = contents.filter(content => content.category === categoryFilter);
    }
    
    if (statusFilter) {
        contents = contents.filter(content => content.status === statusFilter);
    }
    
    // Display content
    const contentList = document.getElementById('contentList');
    
    if (contents.length === 0) {
        contentList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-inbox"></i>
                <p>No content found</p>
            </div>
        `;
        return;
    }
    
    contentList.innerHTML = contents.map(content => `
        <div class="content-item" data-id="${content.id}">
            <div class="content-item-header">
                <h4>${content.title}</h4>
                <span class="content-status status-${content.status}">${content.status}</span>
            </div>
            <p>${getCategoryName(content.category)} • ${formatDate(content.createdAt)}</p>
            <p>${content.views} views • ${content.likes} likes • ${content.comments} comments</p>
            <div class="content-actions">
                <button class="btn btn-sm btn-primary" onclick="editContent(${content.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline" onclick="deleteContent(${content.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ${content.status === 'draft' ? `
                    <button class="btn btn-sm btn-outline" onclick="publishContent(${content.id})">
                        <i class="fas fa-paper-plane"></i> Publish
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Edit content
function editContent(id) {
    const contents = JSON.parse(localStorage.getItem('liveFlowContent')) || [];
    const content = contents.find(item => item.id === id);
    
    if (!content) {
        alert('Content not found.');
        return;
    }
    
    // Switch to create tab
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="create"]').classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById('createTab').classList.add('active');
    
    // Populate form
    document.getElementById('contentTitle').value = content.title;
    document.getElementById('contentCategory').value = content.category;
    document.getElementById('contentDescription').value = content.description || '';
    document.getElementById('contentType').value = content.type || 'stream';
    document.getElementById('contentStatus').value = content.status;
    
    if (content.scheduleDate) {
        document.getElementById('contentScheduleDate').value = content.scheduleDate;
        document.getElementById('scheduleDateGroup').style.display = 'block';
    }
    
    // Show thumbnail if exists
    if (content.thumbnail) {
        document.querySelector('.thumbnail-preview').innerHTML = `<img src="${content.thumbnail}" alt="Thumbnail preview">`;
    }
    
    // TODO: In a real app, you would set up the form for editing instead of creating new
    alert('Edit mode activated. In a real application, this would load the content into the form for editing.');
}

// Delete content
function deleteContent(id) {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
        let contents = JSON.parse(localStorage.getItem('liveFlowContent')) || [];
        contents = contents.filter(content => content.id !== id);
        localStorage.setItem('liveFlowContent', JSON.stringify(contents));
        
        // Reload content list
        loadContentList();
        
        alert('Content deleted successfully.');
    }
}

// Publish content
function publishContent(id) {
    let contents = JSON.parse(localStorage.getItem('liveFlowContent')) || [];
    const contentIndex = contents.findIndex(item => item.id === id);
    
    if (contentIndex !== -1) {
        contents[contentIndex].status = 'published';
        contents[contentIndex].publishedAt = new Date().toISOString();
        localStorage.setItem('liveFlowContent', JSON.stringify(contents));
        
        // Reload content list
        loadContentList();
        
        alert('Content published successfully.');
    }
}

// Initialize admin panel when loaded
if (document.querySelector('.admin-panel')) {
    document.addEventListener('DOMContentLoaded', function() {
        initializeAdminPanel();
    });
}