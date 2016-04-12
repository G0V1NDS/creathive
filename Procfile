web:  export DJANGO_SETTINGS_MODULE=main.settings.development
web: gunicorn --timeout=7200 --bind 127.0.0.1:8000 main.wsgi:application --reload --log-file -;
