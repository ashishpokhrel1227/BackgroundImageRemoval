from django.db import models

# Create your models here.


class Post(models.Model):
    image = models.ImageField(upload_to='post_images')

class Foreground(models.Model):
    img = models.ImageField(upload_to="foreground_images")


        