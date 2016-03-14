from django.conf.urls import patterns, url
from app.home import views

app_name='home'
urlpatterns = [
    url(r'^$', views.index, name='index'),
]