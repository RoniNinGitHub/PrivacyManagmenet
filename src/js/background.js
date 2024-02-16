// Liaw Yu Yii TP058278

let isCookieBlockingEnabled = true; 
// Main
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.command) {
        case 'toggleCookieBlocking':
            toggleCookieBlocking();
            sendResponse({ status: isCookieBlockingEnabled ? 'Enabled' : 'Disabled' });
            break;
        case 'clearCookies':
            clearAllCookies(sendResponse);
            break;
        case 'privacyCheck':
            performPrivacyCheck(sendResponse);
            break;
        case 'listTrackingCookies':
            listTrackingCookies(sendResponse);
            return true; 
    
    }
});

// button for third party cookie blocking
function toggleCookieBlocking() {
    isCookieBlockingEnabled = !isCookieBlockingEnabled;
    console.log("Toggled: Cookie Blocking is now", isCookieBlockingEnabled ? "Enabled" : "Disabled"); 
    updateCookieBlockingRules();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === 'toggleCookieBlocking') {
        toggleCookieBlocking();
        sendResponse({ status: isCookieBlockingEnabled ? 'Enabled' : 'Disabled' });
    }
    
});

function updateCookieBlockingRules() {
    const ruleIds = [1];
    if (isCookieBlockingEnabled) {
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [],
            removeRuleIds: []
        });
    } else {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ruleIds
        });
    }
}


// button to clear cookies
function clearAllCookies(sendResponse) {
    chrome.cookies.getAll({}, function(cookies) {
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var url = (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path;
            chrome.cookies.remove({ url: url, name: cookie.name }, function (removedCookie) {
                if (chrome.runtime.lastError) {
                    console.error('Error removing cookie:', chrome.runtime.lastError);
                } else {
                    console.log('Cookie removed:', removedCookie);
                }
            });
        }

        
        sendResponse({ success: true, message: 'Cookies cleared successfully.' });
    });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.command) {
        case 'clearCookies':
            clearAllCookies(sendResponse);
            return true; 
       
    }
});

// check for insecure sites button
function performPrivacyCheck(sendResponse) {
    checkInsecureWebsites(sendResponse);
}

function checkInsecureWebsites(sendResponse) {
    chrome.tabs.query({}, function (tabs) {
        const insecureTabs = tabs.filter(tab => tab.url && tab.url.startsWith('http://'));
        const message = {
            command: 'privacyCheckResult',
            isSecure: insecureTabs.length === 0
        };

        
        if (typeof sendResponse === 'function') {
            sendResponse(message);
        } else {
            console.error('sendResponse is not a function');
        }
    });
}

// list tracking cookies button
function listTrackingCookies(sendResponse) {
    chrome.cookies.getAll({}, function(cookies) {
        const response = { cookies: cookies };

        
        setTimeout(() => {
            
            if (typeof sendResponse === 'function') {
                sendResponse(response);
            } else {
                console.error('sendResponse is not a function');
            }
        }, 0);
    });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "performPrivacyCheck") {
        performPrivacyCheck();
    }
    
    return true; 
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "toggleCookieBlocking") {
        toggleCookieBlocking();
        sendResponse({ status: isCookieBlockingEnabled ? 'Enabled' : 'Disabled' });
        return true; 
    }
});