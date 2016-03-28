from django.conf.urls import patterns, url
from app.home import views

app_name='home'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^profile/(?P<id>[0-9]+)/$',views.profile,name='profile'),
    url(r'^profile/(?P<id>[0-9]+)/(?P<proj_id>[0-9]+)/project_title_image/$',views.project_title_image,name='project_title_image'),
    url(r'^profile/(?P<id>[0-9]+)/(?P<proj_id>[0-9]+)/project_update/$',views.project_update,name='project_update'),
    url(r'^profile/(?P<id>[0-9]+)/(?P<proj_id>[0-9]+)/project_delete/$',views.project_delete,name='project_delete'),
    url(r'^profile/(?P<id>[0-9]+)/(?P<proj_id>[0-9]+)/display/$',views.display,name='display'),
    url(r'^profile/(?P<id>[0-9]+)/profile_image/$',views.profile_image,name='profile_image'),
    url(r'^profile/(?P<id>[0-9]+)/profile_cover_image/$',views.profile_cover_image,name='profile_cover_image'),
    url(r'^profile/(?P<id>[0-9]+)/update_user_info/$',views.update_user_info,name='update_user_info'),
    url(r'^profile/(?P<id>[0-9]+)/(?P<proj_id>[0-9]+)/media_upload/$',views.media_upload,name='media_upload'),
    url(r'^profile/(?P<id>[0-9]+)/(?P<proj_id>[0-9]+)/(?P<type>[0-9]+)/media_get/$',views.media_get,name='media_get'),
]