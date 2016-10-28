FROM python:3.5.2-slim
MAINTAINER Daniel Bok <daniel.bok@outlook.com>

ENV INSTALL_PATH /CodeQuizApp
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

copy requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD gunicorn -b 0.0.0.0 --access-logfile - "CodeQuiz.app:create_app()"
