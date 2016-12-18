FROM python:3.5.2-slim
MAINTAINER Daniel Bok <daniel.bok@outlook.com>

ARG SECRET_KEY
ARG DATABASE

RUN apt-get update && apt-get install -y python3-dev libpq-dev build-essential

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "server.py"]
