FROM python:3.5.2-slim
MAINTAINER Daniel Bok <daniel.bok@outlook.com>

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "server.py"]
