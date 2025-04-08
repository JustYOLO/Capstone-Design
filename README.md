# Capstone-Design
Dankook University software major Capstone Design with 김민성, 이용민, 위다연

# Run

### Run using docker

Django image is publically available on docker hub. (But .env file is needed) Use this command:

```bash

docker network create your_network_name

sudo docker run --name django_container --env-file .env --network your_network_name justyolo912/django-docker
```

If you need to connect directly to Django container, use port forwarding (-p8011:8000)

Example .env file:

```bash
SECRET_KEY=1111
DEBUG=1
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
```

### MySQL container (UserDB)

MySQL conatiner holds user data.

```bash
sudo docker run --name user_db --network your_network_name -v /path/to/db:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=yourpw -d mysql:latest
```


### Nginx container

We're using Nginx container as HTTPS endpoint. You can run the container by using this command:

```bash
docker build -f Dockerfile.nginx -t my_nginx .

docker run -d --name nginx_container --network your_network_name -p 80:80 -p 443:443 my_nginx
```