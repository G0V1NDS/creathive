from django.conf.urls import patterns, url

urlpatterns = patterns(
    'app.accounts.views',
    url(r'^login/$','login'),
)