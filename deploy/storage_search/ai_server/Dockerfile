FROM python:3.9-slim

RUN mkdir -p /server /data

WORKDIR /server
COPY requirements.txt .
COPY server.py .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade "volcengine-python-sdk[ark]"
EXPOSE 3003

CMD ["python", "server.py"]
