#!/bin/sh
set -e

# 1) Fake the initial migration for your "accounts" app  
python manage.py migrate accounts 0001_initial --fake

python manage.py migrate --noinput
exec gunicorn --bind 0.0.0.0:8000 --workers 3 webserver.wsgi:application
