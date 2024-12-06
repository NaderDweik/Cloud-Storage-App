from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Folder, File
import os
import shutil
from collections import defaultdict
from django.utils import timezone

# Constants for file size limits
MAX_FILE_SIZE = 40 * 1024 * 1024  # 40 MB
MAX_STORAGE_SIZE = 100 * 1024 * 1024  # 100 MB

def index(request):
    """Render the main index page with files and folders."""
    if not request.user.is_authenticated:
        return redirect('signin')

    folders = Folder.objects.filter(user=request.user, parent_folder=None)  # Root folders
    files = File.objects.filter(user=request.user, folder=None)  # Files in root directory
    return render(request, 'driveapp/index.html', {'folders': folders, 'files': files})

def folder_contents(request, folder_id):
    """Display the contents of a specific folder and allow file management within it."""
    if not request.user.is_authenticated:
        return redirect('signin')
    
    folder = get_object_or_404(Folder, id=folder_id, user=request.user)
    subfolders = Folder.objects.filter(user=request.user, parent_folder=folder)  # Subfolders
    files = File.objects.filter(user=request.user, folder=folder)  # Files within the folder

    return render(request, 'driveapp/folder_contents.html', {'folder': folder, 'folders': subfolders, 'files': files})

def delete_file(request, file_id):
    """Delete a file from the database and filesystem."""
    file = get_object_or_404(File, id=file_id, user=request.user)
    file_path = file.file.path
    if os.path.exists(file_path):
        os.remove(file_path)
    file.delete()
    return JsonResponse({'success': True})

def copy_file(request, file_id):
    """Copy a file to a specified destination folder."""
    file = get_object_or_404(File, id=file_id, user=request.user)
    destination_folder_id = request.GET.get('destination')
    if destination_folder_id:
        destination_folder = Folder.objects.filter(id=destination_folder_id, user=request.user).first()
        if destination_folder:
            # Define new file path for copied file
            new_file_path = os.path.join('files', destination_folder.name, file.name)
            os.makedirs(os.path.dirname(new_file_path), exist_ok=True)  # Create folder path if needed
            shutil.copy(file.file.path, new_file_path)
            
            # Create a new file record in the destination folder
            File.objects.create(
                name=file.name,
                file=new_file_path,
                file_type=file.file_type,
                user=request.user,
                folder=destination_folder
            )
            return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Destination folder not specified'})

def move_file(request, file_id):
    """Move a file to a specified destination folder."""
    file = get_object_or_404(File, id=file_id, user=request.user)
    destination_folder_id = request.GET.get('destination')
    if destination_folder_id:
        destination_folder = Folder.objects.filter(id=destination_folder_id, user=request.user).first()
        if destination_folder:
            # Define new file path for moved file
            new_file_path = os.path.join('files', destination_folder.name, file.name)
            os.makedirs(os.path.dirname(new_file_path), exist_ok=True)  # Create folder path if needed
            shutil.move(file.file.path, new_file_path)
            
            # Update file path and folder in the database
            file.file.name = new_file_path
            file.folder = destination_folder
            file.save()
            return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Destination folder not specified'})

def download_file(request, file_id):
    """Download a file."""
    file = get_object_or_404(File, id=file_id, user=request.user)
    file_path = file.file.path
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type="application/octet-stream")
        response['Content-Disposition'] = f'attachment; filename={os.path.basename(file_path)}'
        return response

def signin(request):
    """User login view."""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Invalid credentials')
    return render(request, 'driveapp/sign-in.html')

def signup(request):
    """User registration view."""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, email=email, password=password)
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Username already exists')
    return render(request, 'driveapp/sign-up.html')

def space_distribution(request):
    """Render the space distribution view for visualizing storage usage."""
    if not request.user.is_authenticated:
        return redirect('signin')

    return render(request, 'driveapp/space-distribution.html')

def api_space_distribution(request):
    """API endpoint to get space distribution data."""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not authenticated'}, status=401)

    # Calculate space distribution
    file_distribution = defaultdict(int)
    files_per_category = defaultdict(int)
    used_storage = 0
    available_storage = MAX_STORAGE_SIZE  # Total storage in bytes

    files = File.objects.filter(user=request.user)
    for file in files:
        file_extension = file.file.name.split('.')[-1].lower()  # Get file extension
        file_size = os.path.getsize(file.file.path)  # Size in bytes
        file_distribution[file_extension] += file_size / (1024 * 1024)  # Convert to MB
        files_per_category[file_extension] += 1  # Count files per category
        used_storage += file_size

    # Calculate storage usage
    total_storage_used = used_storage / (1024 * 1024)  # Convert to MB
    available_storage -= total_storage_used

    # Calculate storage over time (monthly)
    storage_over_time = {}
    current_month = timezone.now().month
    current_year = timezone.now().year

    # Create a monthly report for the last 12 months
    for month_offset in range(12):
        month = (current_month - month_offset - 1) % 12 + 1
        year = current_year - (1 if month_offset >= current_month else 0)
        month_start = timezone.datetime(year, month, 1)
        if month == 12:
            month_end = timezone.datetime(year + 1, 1, 1)
        else:
            month_end = timezone.datetime(year, month + 1, 1)

        monthly_usage = sum(
            os.path.getsize(file.file.path) / (1024 * 1024)  # Size in MB
            for file in File.objects.filter(user=request.user, uploaded_at__gte=month_start, uploaded_at__lt=month_end)
        )
        storage_over_time[f"{month:02d}"] = monthly_usage  # Store usage for the month

    return JsonResponse({
        'fileDistribution': dict(file_distribution),
        'storageOverTime': storage_over_time,
        'filesPerCategory': dict(files_per_category),
        'storageUsage': {
            'used': total_storage_used,
            'available': available_storage
        }
    })

def create_folder(request):
    """Create a new folder for the logged-in user."""
    if not request.user.is_authenticated:
        return redirect('signin')

    if request.method == "POST":
        folder_name = request.POST.get('folder_name')
        parent_folder_id = request.POST.get('parent_folder_id')
        parent_folder = get_object_or_404(Folder, id=parent_folder_id, user=request.user) if parent_folder_id else None
        if folder_name:
            Folder.objects.create(name=folder_name, user=request.user, parent_folder=parent_folder)
            messages.success(request, 'Folder created successfully!')
            if parent_folder:
                return redirect('folder_contents', folder_id=parent_folder.id)
            return redirect('index')
        else:
            messages.error(request, 'Folder name is required')
            return redirect('index')
    return HttpResponse("Invalid request method.", status=405)

def upload_file(request):
    """Handle file uploads, allowing files to be uploaded into specific folders."""
    if not request.user.is_authenticated:
        return redirect('signin')

    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        file_size = uploaded_file.size
        
        # Check file size limit
        if file_size > MAX_FILE_SIZE:
            messages.error(request, 'File exceeds the maximum upload size of 40 MB.')
            folder_id = request.POST.get('folder_id', None)
            return render(request, 'driveapp/upload-file.html', {'folders': Folder.objects.filter(user=request.user), 'folder_id': folder_id})

        # Calculate total storage used by the user
        total_storage_used = sum(os.path.getsize(file.file.path) for file in File.objects.filter(user=request.user))
        
        # Check storage limit
        if total_storage_used + file_size > MAX_STORAGE_SIZE:
            messages.error(request, 'You have exceeded your total storage limit of 100 MB. Please delete files to upload more.')
            folder_id = request.POST.get('folder_id', None)
            return render(request, 'driveapp/upload-file.html', {'folders': Folder.objects.filter(user=request.user), 'folder_id': folder_id})

        file_extension = os.path.splitext(uploaded_file.name)[1].lower()
        folder_id = request.POST.get('folder_id')
        folder = get_object_or_404(Folder, id=folder_id, user=request.user) if folder_id else None

        new_file = File.objects.create(
            name=uploaded_file.name,
            file=uploaded_file,
            file_type=file_extension,
            user=request.user,
            folder=folder
        )
        messages.success(request, f"File '{new_file.name}' uploaded successfully.")
        if folder:
            return redirect('folder_contents', folder_id=folder.id)
        return redirect('index')

    folders = Folder.objects.filter(user=request.user)
    return render(request, 'driveapp/upload-file.html', {'folders': folders})

def signout(request):
    """User logout view."""
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('signin')
