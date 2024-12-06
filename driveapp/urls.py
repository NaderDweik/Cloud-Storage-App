# driveapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('space-distribution/', views.space_distribution, name='space_distribution'),
    path('api/space_distribution/', views.api_space_distribution, name='space_distribution_data'),  # Updated API endpoint
    path('api/space_distribution/', views.api_space_distribution, name='space_distribution_data'),

    path('create-folder/', views.create_folder, name='create_folder'),
    path('upload-file/', views.upload_file, name='upload_file'),
    
    path('folder/<int:folder_id>/', views.folder_contents, name='folder_contents'),
    path('delete/<int:file_id>/', views.delete_file, name='delete_file'),
    path('copy/<int:file_id>/', views.copy_file, name='copy_file'),
    path('move/<int:file_id>/', views.move_file, name='move_file'),
    path('download/<int:file_id>/', views.download_file, name='download_file'),
]
