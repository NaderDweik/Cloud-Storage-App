document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('mode-toggle');
    
    const fileModal = document.getElementById('file-modal');
    const destinationModal = document.getElementById('destination-modal');
    const fileGrid = document.getElementById('file-grid');
    const fileNameSpan = document.getElementById('file-name');
    const fileTypeSpan = document.getElementById('file-type');
    const fileSizeSpan = document.getElementById('file-size');
    const fileDateSpan = document.getElementById('file-date');
    const destFileNameSpan = document.getElementById('dest-file-name');
    const downloadButton = document.getElementById('download-button');
    const deleteButton = document.getElementById('delete-button');
    const copyButton = document.getElementById('copy-button');
    const moveButton = document.getElementById('move-button');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');
    const destinationButtons = document.querySelectorAll('.destination-button');
    let selectedFile = null;
    let activeDestination = null;

    // Theme load and toggle
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        body.classList.add(storedTheme);
        toggleButton.innerHTML = storedTheme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
        body.classList.replace(body.classList[0], newTheme);
        toggleButton.innerHTML = newTheme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', newTheme);
    });

    // Open file modal on click
    fileGrid.addEventListener('click', (event) => {
        const target = event.target.closest('.file-card');
        if (!target) return;

        if (target.dataset.fileType === 'folder') {
            window.location.href = `/folder/${target.dataset.fileName}`;
            return;
        }

        selectedFile = target;
        fileNameSpan.textContent = target.dataset.fileName;
        fileTypeSpan.textContent = target.dataset.fileType || 'file';
        fileSizeSpan.textContent = target.dataset.fileSize || 'N/A';
        fileDateSpan.textContent = target.dataset.fileDate || 'N/A';
        fileModal.style.display = 'block';
    });

    // Close modals
    document.querySelectorAll('.close, .close-destination').forEach(closeBtn => {
        closeBtn.onclick = () => {
            closeBtn.closest('.modal').style.display = 'none';
        };
    });

    // Download and delete functionality
    downloadButton.addEventListener('click', () => {
        alert(`Downloading ${fileNameSpan.textContent}`);
    });

    deleteButton.addEventListener('click', () => {
        alert(`Deleting ${fileNameSpan.textContent}`);
        fileModal.style.display = 'none';
    });

    // Copy and move actions open destination modal
    [copyButton, moveButton].forEach(button => {
        button.addEventListener('click', () => {
            destFileNameSpan.textContent = fileNameSpan.textContent;
            destinationModal.style.display = 'block';
        });
    });

    // Destination button selection and styling
    destinationButtons.forEach(button => {
        button.addEventListener('click', () => {
            destinationButtons.forEach(btn => btn.removeAttribute('data-selected'));
            button.setAttribute('data-selected', 'true');
            activeDestination = button;
        });
    });

    // Confirm Move/Copy action
    confirmButton.addEventListener('click', () => {
        if (activeDestination) {
            const action = moveButton === document.activeElement ? 'moved' : 'copied';
            const destinationId = activeDestination.getAttribute('data-destination');
            
            // Execute move or copy request
            if (action === 'copied') {
                copyFile(destinationId);
            } else {
                moveFile(destinationId);
            }

            resetDestinationSelection();
            destinationModal.style.display = 'none';
        } else {
            alert('Please select a destination folder.');
        }
    });

    // Handle cancel button and reset destination selection
    cancelButton.addEventListener('click', () => {
        resetDestinationSelection();
        destinationModal.style.display = 'none';
    });

    // Helper function to reset destination selection
    function resetDestinationSelection() {
        activeDestination = null;
        destinationButtons.forEach(btn => btn.removeAttribute('data-selected'));
    }

    // Style for destination button selected and hover states
    const style = document.createElement('style');
    style.textContent = `
        .destination-button[data-selected="true"] {
            background-color: #1a103c;
            color: white;
        }
        body.dark-mode .destination-button[data-selected="true"] {
            background-color: white;
            color: #1a103c;
        }
        .destination-button:hover {
            background-color: #007bff;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === fileModal) fileModal.style.display = 'none';
        if (event.target === destinationModal) destinationModal.style.display = 'none';
    });

    // Copy and move file functions
    function copyFile(destinationId) {
        fetch(`/copy/${selectedFile.dataset.fileId}/?destination=${destinationId}`, {
            method: 'POST',
            headers: { 'X-CSRFToken': '{{ csrf_token }}' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File copied successfully.');
                location.reload();
            } else {
                alert('Failed to copy file.');
            }
        });
    }

    function moveFile(destinationId) {
        fetch(`/move/${selectedFile.dataset.fileId}/?destination=${destinationId}`, {
            method: 'POST',
            headers: { 'X-CSRFToken': '{{ csrf_token }}' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File moved successfully.');
                location.reload();
            } else {
                alert('Failed to move file.');
            }
        });
    }
});
