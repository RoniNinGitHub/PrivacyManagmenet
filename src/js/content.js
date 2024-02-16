// browser 5 sec notification
function showSafeBrowsingNotification() {
    const notification = document.createElement('div');
    notification.textContent = 'Safe Browsing is ON';
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.zIndex = '1000';
    notification.style.padding = '10px';
    notification.style.backgroundColor = 'green';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.2)';
    notification.style.fontSize = '14px';

    document.body.appendChild(notification);


    setTimeout(() => {
        notification.remove();
    }, 5000); 
}


showSafeBrowsingNotification();