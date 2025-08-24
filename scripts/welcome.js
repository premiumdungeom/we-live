document.addEventListener('DOMContentLoaded', function() {
    // Set session flag to indicate we've seen the welcome page
    sessionStorage.setItem('hasSeenWelcome', 'true');
    
    // After animation completes, redirect to main page
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 4000); // 4 seconds total (1.5s drop + 2.5s text display)
});
