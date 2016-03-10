from django.conf.urls import patterns, url

urlpatterns = patterns(
    'app.home.views',
    url(r'^$', 'index'),
)