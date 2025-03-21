# Capstone-Design
Dankook University software major Capstone Design with 김민성, 이용민, 위다연

# Run

### Run using docker

Image is publically available on docker hub. (But .env file is needed) Use this command:

```bash
sudo docker run --env-file .env -p 8000:8000 justyolo912/django-docker
```

Example .env file:

```bash
SECRET_KEY=1111
DEBUG=1
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
```

