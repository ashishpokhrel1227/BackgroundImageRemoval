from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostView.as_view(), name='posts_list'),
    path('foreground/', views.ForegroundView.as_view(), name='foreground_image')
]