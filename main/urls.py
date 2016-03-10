from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [

    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('app.accounts.urls')),
    url(r'^$', include('app.home.urls')),


    url('', include('django.contrib.auth.urls', namespace='auth')),
]
