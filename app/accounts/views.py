from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from models import Account


def login(request):
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


def signup(request):
    username=request.POST.get('username', None)
    password=request.POST.get('password', None)
    email=request.POST.get('email', None)
    fname=request.POST.get('fname', None)
    lname=request.POST.get('lname', None)

    record=Account(username=username,fname=fname,lname=lname,email=email,password=password)
    record.save();
    return HttpResponse('Registered')


def login_account(request):
    username=request.POST.get('username', None)
    password=request.POST.get('password', None)
    record=Account.objects.filter(username=username,password=password)
    if record.count()>0:
        return HttpResponse('true')
    else:
        return HttpResponse('false')
