# driveapp/models.py

from django.db import models
from django.contrib.auth.models import User

class Folder(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    parent_folder = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='subfolders')

    def __str__(self):
        return self.name

class File(models.Model):
    FILE_TYPE_ICONS = {
        '.png': 'https://img.icons8.com/?size=100&id=330&format=png&color=000000',
        '.jpg': 'https://img.icons8.com/?size=100&id=334&format=png&color=000000',
        '.jpeg': 'https://img.icons8.com/?size=100&id=11561&format=png&color=000000',
        '.pdf': 'https://img.icons8.com/?size=100&id=299&format=png&color=000000',
        '.mp3': 'https://img.icons8.com/?size=100&id=1555&format=png&color=000000',
        '.mp4': 'https://img.icons8.com/?size=100&id=11589&format=png&color=000000',
        '.doc': 'https://img.icons8.com/?size=100&id=2774&format=png&color=000000',
        '.folder': 'icons8-folder.png',
        '.docx': 'https://img.icons8.com/?size=100&id=2774&format=png&color=000000',
        '.rar': 'https://img.icons8.com/?size=100&id=314&format=png&color=000000',
        '.ppt': 'https://img.icons8.com/?size=100&id=3614&format=png&color=000000',
        '.xlsx': 'https://img.icons8.com/?size=100&id=07ymv7kZWRHr&format=png&color=000000',
    }
    

    name = models.CharField(max_length=100)
    file = models.FileField(upload_to='files/')
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True)
    file_type = models.CharField(max_length=10, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def get_icon(self):
        """Return the appropriate icon path based on file type."""
        return self.FILE_TYPE_ICONS.get(self.file_type, 'icons8-file.png')

    def __str__(self):
        return self.name
