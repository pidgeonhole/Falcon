FROM python:3.5.2-slim
MAINTAINER Daniel Bok <daniel.bok@outlook.com>

copy requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 80

CMD python server.app
