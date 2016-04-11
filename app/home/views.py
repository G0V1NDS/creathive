import os
import shutil

from django.contrib.auth.decorators import login_required
import json
import subprocess
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
        abspath='/static/uploads/profile_{0}/project_{1}'.format(id,proj_id)
        path='{0}{1}'.format(PROJECT_ROOT,abspath)
        os.mkdir(path)
        os.mkdir('{0}/audios'.format(path))
        os.mkdir('{0}/videos'.format(path))
        os.mkdir('{0}/images'.format(path))
        os.mkdir('{0}/articles'.format(path))
        project.created=timezone.now()
    elif request.method =='PUT':
        project=request.user.artist.project_set.get(id=proj_id)
    else:
        return Http404('Can not access')
    image = request.FILES.get('image')
    ext =request.POST.get('ext')
    abspath='/static/uploads/profile_{0}/project_{1}'.format(id,proj_id)
    path='{0}{1}'.format(PROJECT_ROOT,abspath)
    fullname = '{0}/project.{1}'.format(path,ext)
    thumbnail = '{0}/project_thumb.png'.format(path)
    handle_uploaded_file(fullname,image)
    subprocess.call('ffmpeg -i {0} -y -filter scale=w=260:h=213 {1}'.format(fullname,thumbnail),shell=True)
    os.remove(fullname)
    absthumbnail='{0}/project_thumb.png'.format(abspath)
    project.thumbnail=absthumbnail
    project.save()
    return Response({'id': request.user.artist.id, 'proj_id': proj_id, 'url': absthumbnail})


@api_view(['POST','PUT'])
def project_update(request,id,proj_id):
    if request.method == 'POST':
        project=request.user.artist.project_set.create(artist=request.user.artist)
        proj_id=project.id
        abspath='/static/uploads/profile_{0}/project_{1}'.format(id,proj_id)
        path='{0}{1}'.format(PROJECT_ROOT,abspath)
        os.mkdir(path)
        os.mkdir('{0}/audios'.format(path))
        os.mkdir('{0}/videos'.format(path))
        os.mkdir('{0}/images'.format(path))
        os.mkdir('{0}/articles'.format(path))
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
        count=project.media_set.all().count()
        serialized = ProjectSerializer(project)
        data={'serial':serialized.data,'media_count':count}
        return Response({json.dumps(data)}, status=status.HTTP_200_OK)
    else:
        return Http404('Can not access')


def project_delete(request,id,proj_id):
    request.user.artist.project_set.get(id=proj_id).delete()
    abspath='/static/uploads/profile_{0}/project_{1}'.format(id,proj_id)
    path='{0}{1}'.format(PROJECT_ROOT,abspath)
    shutil.rmtree(path)
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
    ext =request.POST.get('ext')
    media_type=request.POST.get('type')
    abspath='/static/uploads/profile_{0}/project_{1}/{2}s'.format(id,proj_id,media_type)
    path='{0}{1}'.format(PROJECT_ROOT,abspath)
    fullname = '{0}/media_{1}.{2}'.format(path,media_id,ext)
    absfullname = '{0}/media_{1}.{2}'.format(abspath,media_id,ext)
    thumbnail = '{0}/media_{1}_thumb.png'.format(path,media_id)
    absthumbnail='{0}/media_{1}_thumb.png'.format(abspath,media_id)
    handle_uploaded_file(fullname,file)

    if(media_type=='video'):
        subprocess.call('ffmpeg -i {0} -ss 00:00:14.435 -filter  scale=w=260:h=213 -vframes 1 {1}'.format(fullname,thumbnail),shell=True)
        media.type=1
    elif(media_type=='audio'):
        value= subprocess.call('ffmpeg -i {0} -filter scale=w=260:h=213 {1}'.format(fullname,thumbnail),shell=True)
        if value==1:
            absthumbnail='/static/uploads/default/audios.png'
        media.type=2
    elif(media_type=='image'):
        subprocess.call('ffmpeg -i {0} -filter scale=w=260:h=213 {1}'.format(fullname,thumbnail),shell=True)
        media.type=3
    elif(media_type=='article'):
        subprocess.call('convert -resize 260x213\! {0}[0] {1}'.format(fullname,thumbnail),shell=True)
        media.type=4

    media.thumbnail=absthumbnail
    if media.title == '':
        media.title='{0}'.format(media_id)
    media.media_url=absfullname
    media.save()
    media=Media.objects.get(id=media.id)
    serialized=MediaSerializer(media)
    return Response(serialized.data)


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
def media_get(request,id,proj_id,type,offset,limit):
    if request.method == 'GET':
        project=Project.objects.get(id=proj_id)
        if type == '0':
            media=project.media_set.all().order_by('-created')[offset:limit]
        else:
            media=project.media_set.filter(type=type).order_by('-created')[offset:limit]
        count=media.count()
    else:
        return Http404('Can not access')
    serialized = MediaSerializer(media,many=True)
    data={'serial':serialized.data,'loaded_media':count}
    return Response({json.dumps(data)}, status=status.HTTP_200_OK)


@api_view(['POST'])
def media_delete(request,id,proj_id):
    rem_mid=request.data.get('rem_mid')
    for media_id in rem_mid:
        media=Media.objects.get(id=media_id)
        os.remove(PROJECT_ROOT+media.thumbnail)
        os.remove(PROJECT_ROOT+media.media_url)
        media.delete()
    return HttpResponse('Deleted')


@api_view(['POST'])
def profile_image(request,id):
    if request.method == 'POST':
        image = request.FILES.get('image')
        ext =request.POST.get('ext')
        abspath='/static/uploads/profile_{0}'.format(id)
        path='{0}{1}'.format(PROJECT_ROOT,abspath)
        fullname = '{0}/profile.{1}'.format(path,ext)
        thumbnail = '{0}/profile_thumb.png'.format(path)
        absfullname='{0}/profile.{1}'.format(abspath,ext)
        absthumbnail = '{0}/profile_thumb.png'.format(abspath)
        handle_uploaded_file(fullname,image)
        a=Artist.objects.get(user=id)
        a.profile_pic=absfullname
        a.profile_pic_thumb=absthumbnail
        subprocess.call('ffmpeg -i {0} -y -filter scale=w=100:h=100 {1}'.format(fullname,thumbnail),shell=True)
        a.save()
        return Response({'id': request.user.artist.id, 'url': a.profile_pic, 'thumb_url': a.profile_pic_thumb})


@api_view(['POST'])
def profile_cover_image(request,id):
    if request.method == 'POST':
        image = request.FILES.get('image')
        ext =request.POST.get('ext')
        abspath='/static/uploads/profile_{0}'.format(id)
        path='{0}{1}'.format(PROJECT_ROOT,abspath)
        fullname = '{0}/cover.{1}'.format(path,ext)
        absfullname='{0}/cover.{1}'.format(abspath,ext)
        handle_uploaded_file(fullname,image)
        artist=Artist.objects.get(user=id)
        artist.cover_pic=absfullname
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