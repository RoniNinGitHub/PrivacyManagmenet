document.addEventListener('DOMContentLoaded', function() {
    const toggleCookieBlockingBtn = document.getElementById('toggleCookieBlocking');
    const clearCookiesBtn = document.getElementById('clearCookies');
    const privacyCheckBtn = document.getElementById('privacyCheck');
    const listCookiesBtn = document.getElementById('listCookiesBtn');

    if (toggleCookieBlockingBtn) {
        toggleCookieBlockingBtn.addEventListener('click', function() {
            chrome.runtime.sendMessage({ command: 'toggleCookieBlocking' }, function(response) {
                displayMessage(`Cookie Blocking is now ${response.status}`);
            });
        });
    } else {
        console.error('Toggle Cookie Blocking Button not found');
    }

    if (clearCookiesBtn) {
        clearCookiesBtn.addEventListener('click', function() {
            chrome.runtime.sendMessage({ command: 'clearCookies' }, function(response) {
                displayMessage(response && response.success ? 'Cookies cleared successfully.' : 'Failed to clear cookies.');
            });
        });
    } else {
        console.error('Clear Cookies Button not found');
    }

    if (privacyCheckBtn) {
        privacyCheckBtn.addEventListener('click', function() {
            chrome.runtime.sendMessage({ command: 'privacyCheck' }, function(response) {
                displayMessage(response && response.isSecure ? 'No insecure websites detected.' : 'Insecure websites detected. Please be cautious!');
            });
        });
    } else {
        console.error('Privacy Check Button not found');
    }

    if (listCookiesBtn) {
        listCookiesBtn.addEventListener('click', function() {
            requestAndDisplayCookies();
        });
    } else {
        console.error('List Cookies Button not found');
    }

    function displayMessage(message) {
        const messageDiv = document.getElementById('message'); 
        if (messageDiv) {
            messageDiv.textContent = message;
        } else {
            console.error('Message Div not found');
        }
    }

    function requestAndDisplayCookies() {
        chrome.runtime.sendMessage({ command: 'listTrackingCookies' }, function(response) {
            if (response && response.cookies) {
                displayCookies(response.cookies);
            }
        });
    }

    function displayCookies(cookies) {
        const cookieListDiv = document.getElementById('cookieList');
        if (cookieListDiv) {
            cookieListDiv.innerHTML = ''; 
            cookies.forEach(cookie => {
                const cookieDiv = document.createElement('div');
                cookieDiv.textContent = `Name: ${cookie.name}, Value: ${cookie.value}`;
                cookieListDiv.appendChild(cookieDiv);
            });
        } else {
            console.error('Cookie List Div not found');
        }
    }
});

