from django.conf.urls import patterns, url
from app.accounts import views

app_name='accounts'

urlpatterns = [
    url(r'^$',views.login,name='login'),
    url(r'^check_username/$',views.check_username,name='check_username'),
    url(r'^check_email/$',views.check_email,name='check_email'),
    url(r'^signup/$',views.signup,name='signup'),
    url(r'^login_account/$',views.login_account,name='login_account'),
    url(r'^logout_account/$',views.logout_account, name='logout_account')
]