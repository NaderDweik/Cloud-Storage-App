document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('mode-toggle');

    // Check and apply the stored theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        body.classList.add(storedTheme);
        toggleButton.innerHTML = storedTheme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Toggle theme on button click
    toggleButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        if (body.classList.contains('dark-mode')) {
            body.classList.replace('dark-mode', 'light-mode');
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light-mode'); // Save to localStorage
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark-mode'); // Save to localStorage
        }
    });

    // Fetch space distribution data from the server
    fetch('/api/space_distribution/')
        .then(response => {
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Render charts with fetched data
            renderFileDistributionChart(data.fileDistribution);
            renderStorageOverTimeChart(data.storageOverTime);
        })
        .catch(error => {
            console.error('Error fetching space distribution data:', error);
            alert('An error occurred while fetching data. Please try again later.'); // User-friendly error message
        });

    // Render File Format Space Distribution Chart
    function renderFileDistributionChart(fileDistribution) {
        const ctx1 = document.getElementById('fileDistributionChart').getContext('2d');
        new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: Object.keys(fileDistribution),
                datasets: [{
                    label: 'Space Distribution (in MB)',
                    data: Object.values(fileDistribution),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'left',
                    }
                }
            }
        });
    }

    // Render Data Storage Over Time Chart
    function renderStorageOverTimeChart(storageOverTime) {
        const ctx2 = document.getElementById('storageOverTimeChart').getContext('2d');
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: Object.keys(storageOverTime).map(month => {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return monthNames[parseInt(month) - 1];  // Convert month number to name
                }),
                datasets: [{
                    label: 'Storage (in MB)',
                    data: Object.values(storageOverTime),
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Months'  // X-axis title
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Storage (MB)'  // Y-axis title
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Custom Cursor Implementation
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    });
});
