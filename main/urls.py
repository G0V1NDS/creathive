from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [

    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('app.accounts.urls',namespace='accounts')),
    url(r'^home/', include('app.home.urls',namespace='home')),


    url('', include('django.contrib.auth.urls', namespace='auth')),
]
