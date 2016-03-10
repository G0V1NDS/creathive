from django.shortcuts import render


def index(request):
    context = {}
    context['request'] = request

    return render(request, 'home/index.html', {'context': context})