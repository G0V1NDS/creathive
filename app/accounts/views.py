from django.contrib.auth import authenticate,login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from app.accounts.serializers import SignupSerializer, LoginSerializer
from app.home.models import Artist
from models import Account


def login(request):
    if request.user.is_authenticated():
        print request.user
        return HttpResponseRedirect('/home/')
    else:
        return render(request, 'accounts/index.html')


def check_username(request):
    records= Account.objects.filter(username= request.POST.get('username', None))
    if records.count() != 0:
        return HttpResponse('false')
    else:
        return HttpResponse('true')


def check_email(request):
    records= Account.objects.filter(email= request.POST.get('email', None))
    if records.count() != 0:
        return HttpResponse('false')
    else:
        return HttpResponse('true')


@api_view(['GET', 'POST', ])
@permission_classes((AllowAny,))
def signup(request):
    """
    Creates user after the successful validation
    and returns serialized object of user.
    :param request:
    :return:
    """
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        serializer = SignupSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors,\
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            user = serializer.save()
            artist = Artist.objects.create(user=user)
            return Response({
                    'status': 'Created',
                    'message': 'User created'
                }, status=status.HTTP_201_CREATED)



@api_view(['POST'])
@permission_classes((AllowAny,))
def login_account(request):
    """
    Login the current user, after authenticating the credentials.
    :param request:
    :return:
    """
    if request.method == 'POST':
        data = JSONParser().parse(request)
        username = data.get('username', None)
        password = data.get('password', None)

        account = authenticate(username=username, password=password)
        if account is not None:

            if not account.is_email_verified:
                return Response({
                    'status': 'Unverified',
                    'message': 'This account is not verified.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            if not account.is_active:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            auth_login(request, account)
            serialized = LoginSerializer(account)
            return Response(serialized.data, status=status.HTTP_200_OK)

        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

@login_required
def logout_account(request):
    auth_logout(request)
    return HttpResponse('Successfully Logout')
