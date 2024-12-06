
# Cloud Drive Application

## Description
Cloud Drive Application is a user-friendly cloud storage system built with Django and React. It allows users to upload, manage, and share files efficiently. Key features include folder creation, file uploads with size restrictions, and storage usage tracking.

## Features
- **User Authentication**: Secure login and registration.
- **File Management**: Upload, delete, copy, and move files within folders.
- **Storage Limits**: Max upload size of 40 MB per file and a total account limit of 100 MB.
- **Responsive Design**: Mobile-friendly interface.

## Technologies Used
- Django (Backend)
- React (Frontend)
- PostgreSQL (Database)
- HTML/CSS (Frontend Styling)
- Chart.js (Data Visualization)

## Getting Started

### Prerequisites
1. Install Python 3.x
2. Install Node.js and npm
3. Set up PostgreSQL database

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/NaderDweik/Cloud-Drive-Application.git
   cd Cloud-Drive-Application
   ```

2. **Set up the backend:**
   - Navigate to the backend directory:
     ```bash
     cd driveapp
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
     ```
   - Configure the database:
     - Create a new PostgreSQL database.
     - Update `settings.py` in the `driveapp` directory with your database credentials.
   - Run migrations:
     ```bash
     python manage.py migrate
     ```
   - Start the Django server:
     ```bash
     python manage.py runserver
     ```

3. **Set up the frontend:**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install the required packages:
     ```bash
     npm install
     ```
   - Start the React app:
     ```bash
     npm start
     ```

4. Access the application at `http://localhost:3000` in your browser.

## Usage
- Create an account or log in.
- Upload files and manage folders.
- Monitor your storage usage and restrictions.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
