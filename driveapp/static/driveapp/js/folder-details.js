document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('mode-toggle');
    const fileGrid = document.getElementById('file-grid');
    const fileModal = document.getElementById('file-modal');
    const closeFileModal = fileModal.querySelector('.close');
    const fileNameSpan = document.getElementById('file-name');
    const fileTypeSpan = document.getElementById('file-type');
    const fileSizeSpan = document.getElementById('file-size');
    const fileDateSpan = document.getElementById('file-date');
    const downloadButton = document.getElementById('download-button');
    const deleteButton = document.getElementById('delete-button');
    const copyButton = document.getElementById('copy-button');
    const moveButton = document.getElementById('move-button');

    // Toggle dark/light mode
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        body.classList.add(storedTheme);
        toggleButton.innerHTML = storedTheme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light-mode');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // Open file modal on click
    fileGrid.addEventListener('click', (event) => {
        const target = event.target.closest('.file-card');

        // Check if a card is clicked
        if (target) {
            fileNameSpan.textContent = target.dataset.fileName;
            fileTypeSpan.textContent = target.dataset.fileType;
            fileSizeSpan.textContent = target.dataset.fileSize;
            fileDateSpan.textContent = target.dataset.fileDate;

            // Show the file modal
            fileModal.style.display = 'block';
        }
    });

    // Close file modal
    closeFileModal.onclick = () => {
        fileModal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target === fileModal) {
            fileModal.style.display = 'none';
        }
    };

    // Handle Download button
    downloadButton.addEventListener('click', () => {
        alert(`Downloading ${fileNameSpan.textContent}`);
    });

    // Handle Delete button
    deleteButton.addEventListener('click', () => {
        alert(`Deleting ${fileNameSpan.textContent}`);
        fileModal.style.display = 'none'; // Close the modal after deletion
    });

    // Handle Copy button
    copyButton.addEventListener('click', () => {
        alert(`Copying ${fileNameSpan.textContent}`);
    });

    // Handle Move button
    moveButton.addEventListener('click', () => {
        alert(`Moving ${fileNameSpan.textContent}`);
    });
});
