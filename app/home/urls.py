from django.conf.urls import patterns, url
from app.home import views

app_name='home'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^profile/(?P<id>[0-9])/$',views.profile,name='profile'),
    url(r'^profile/(?P<id>[0-9])/project_title_image/$',views.project_title_image,name='project_title_image')
]