from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from app.home.models import Artist


@login_required
@ensure_csrf_cookie
def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/home/profile/{0}'.format(request.user.artist.id))

@login_required
def profile(request,id):
    context={}
    try:
        artist=Artist.objects.get(id=id)
        context['artist']=artist
    except:
        return Http404('Artist not found')
    return render(request,'home/index.html',context)


def project_title_image(request,id):
    if request.method == 'POST':
        image = request.FILES.get('user_image')
        print image
    return HttpResponse('Changed')