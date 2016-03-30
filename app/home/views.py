from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.home.models import Artist, Project, Media
from app.home.serializers import ProjectSerializer, MediaSerializer
from main.settings.development import PROJECT_ROOT


@login_required
# @ensure_csrf_cookie
def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/home/profile/{0}'.format(request.user.artist.id))

@login_required
def profile(request,id):
    context={}
    try:
        artist=Artist.objects.get(id=id)
        try:
            projects=artist.project_set.all().order_by('-created')
        except:
            projects=None
        context['artist']=artist
        context['projects']=projects
    except:
        return Http404('Artist not found')
    return render(request,'home/index.html',context)


@api_view(['POST','PUT'])
def project_title_image(request,id,proj_id):
    if request.method == 'POST':
        project=request.user.artist.project_set.create(artist=request.user.artist)
        proj_id=project.id
        project.created=timezone.now()
    elif request.method =='PUT':
        project=request.user.artist.project_set.get(id=proj_id)
    else:
        return Http404('Can not access')
    image = request.FILES.get('image')
    path=PROJECT_ROOT+'/static/uploads/images/'
    ext =request.POST.get('ext')
    fullname = '{0}{1}_{2}_project_thumb.{3}'.format(path,id,proj_id,ext)
    handle_uploaded_file(fullname,image)
    url='/static/uploads/images/{0}_{1}_project_thumb.{2}'.format(id,proj_id,ext)
    project.thumbnail=url
    project.save()
    return Response({'id': request.user.artist.id, 'proj_id': proj_id, 'url': url})


@api_view(['POST','PUT'])
def project_update(request,id,proj_id):
    if request.method == 'POST':
        project=request.user.artist.project_set.create(artist=request.user.artist)
        proj_id=project.id
        project.created=timezone.now()
    elif request.method =='PUT':
        project=request.user.artist.project_set.get(id=proj_id)
    else:
        return Http404('Can not access')
    title=request.data.get('title',None)
    description=request.data.get('description',None)
    proj_type=request.data.get('type',None)
    project.title=title
    project.description=description
    project.type=proj_type
    project.save()
    return Response({'id': request.user.artist.id, 'proj_id': proj_id, 'title': project.title})


@api_view(['GET'])
def display(request,id,proj_id):
    if request.method =='GET':
        project=request.user.artist.project_set.get(id=proj_id)
        serialized = ProjectSerializer(project)
        return Response(serialized.data, status=status.HTTP_200_OK)
    else:
        return Http404('Can not access')


def project_delete(request,id,proj_id):
    request.user.artist.project_set.get(id=proj_id).delete()
    return HttpResponse('Deleted')


@api_view(['POST'])
def media_upload(request,id,proj_id):
    if request.method == 'POST':
        project=Project.objects.get(id=proj_id)
        media=project.media_set.create(project=project)
        media_id=media.id
    else:
        return Http404('Can not access')
    file = request.FILES.get('media')
    path=PROJECT_ROOT+'/static/uploads/images/'
    ext =request.POST.get('ext')
    media_type=request.POST.get('type')
    fullname = '{0}{1}_{2}_{3}_{4}_media.{5}'.format(path,id,proj_id,media_id,media_type,ext)
    handle_uploaded_file(fullname,file)
    url='/static/uploads/images/{0}_{1}_{2}_{3}_media.{4}'.format(id,proj_id,media_id,media_type,ext)
    if(media_type=='video'):
        media.type=1
    elif(media_type=='audio'):
        media.type=2
    elif(media_type=='image'):
        media.type=3
    elif(media_type=='article'):
        media.type=4
    if media.title == 'NULL':
        media.title='{0}{1}'.format(media.type,media_id)
    else:
        media.title='{0}{1}'.format(media.title,media_id)
    media.thumbnail=url
    media.media_url=url
    media.save()
    return Response({'id': request.user.artist.id, 'proj_title':project.title, 'proj_id': proj_id, 'media_id': media_id, 'media_thumb_url': media.thumbnail, 'media_url': media.media_url, 'media_title':media.title, 'media_desc':media.description, 'media_type':media_type})


@api_view(['PUT'])
def media_update(request,id,proj_id):
    if request.method == 'PUT':
        project=Project.objects.get(id=proj_id)
        media=project.media_set.get(id=request.data.get('media_id'))
    else:
        return Http404('Can not access')
    media.title=request.data.get('title')
    media.description=request.data.get('description')
    media.save()
    return Response({'media_title':media.title, 'media_desc':media.description})

@api_view(['GET'])
def media_get(request,id,proj_id,type):
    if request.method == 'GET':
        project=Project.objects.get(id=proj_id)
        if type == '0':
            media=project.media_set.all().order_by('-created')[:10]
        else:
            media=project.media_set.filter(type=type).order_by('-created')[:10]
    else:
        return Http404('Can not access')
    serialized = MediaSerializer(media,many=True)
    return Response(serialized.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def media_delete(request,id,proj_id):
    rem_mid=request.data.get('rem_mid')
    for id in rem_mid:
        Media.objects.get(id=id).delete()
    return HttpResponse('Deleted')


@api_view(['POST'])
def profile_image(request,id):
    if request.method == 'POST':
        image = request.FILES.get('image')
        path=PROJECT_ROOT+'/static/uploads/images/'
        ext =request.POST.get('ext')
        fullname = path+id+'_profile_pic.'+ext
        handle_uploaded_file(fullname,image)
        a=Artist.objects.get(user=id)
        a.profile_pic='/static/uploads/images/'+id+'_profile_pic.'+ext
        a.save()
        return Response({'id': request.user.artist.id, 'url': a.profile_pic})


@api_view(['POST'])
def profile_cover_image(request,id):
    if request.method == 'POST':
        image = request.FILES.get('image')
        path=PROJECT_ROOT+'/static/uploads/images/'
        ext =request.POST.get('ext')
        fullname = path+id+'_profile_cover_pic.'+ext
        handle_uploaded_file(fullname,image)
        artist=Artist.objects.get(user=id)
        artist.cover_pic='/static/uploads/images/'+id+'_profile_cover_pic.'+ext
        artist.save()
        return Response({'id': request.user.artist.id, 'url': artist.cover_pic})


@api_view(['POST'])
def update_user_info(request,id):
    about_me=request.data.get('about_me',None)
    name=request.data.get('name',None)
    name_list=name.rsplit(" ",1)
    artist=Artist.objects.get(user=id)
    artist.about_me=about_me
    artist.user.first_name=name_list[0]
    artist.user.last_name=name_list[1]
    artist.save()
    artist.user.save()
    return HttpResponse('updated')


def handle_uploaded_file(fullname,f):
    with open(fullname, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)