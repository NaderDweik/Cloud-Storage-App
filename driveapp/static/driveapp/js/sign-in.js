// Toggle between light and dark mode
function toggleMode() {
    const body = document.body;
    const button = document.querySelector('.logout button');

    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        button.innerText = 'Switch to Light Mode';
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        button.innerText = 'Switch to Dark Mode';
    }
}

// Create a custom cursor element
const customCursor = document.createElement('div');
customCursor.classList.add('cursor');
document.body.appendChild(customCursor);

// Update the custom cursor position based on mouse movements
document.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
});
