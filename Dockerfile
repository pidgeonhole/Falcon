FROM python:3.5.2-slim
MAINTAINER Daniel Bok <daniel.bok@outlook.com>

ENV SECRET_KEY ${printenv | grep -oP "SECRET_KEY=\S+" | cut -d= -f2}
ENV DATABASE ${printenv | grep -oP "DATABASE=\S+" | cut -d= -f2}

RUN apt-get update && apt-get install -y python3-dev libpq-dev build-essential

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "server.py"]
