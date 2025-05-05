FROM python:3.10

# Install OS packages for OpenCV
RUN apt-get update && apt-get install -y libgl1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
COPY ../weights/ /app/weights/

CMD ["python", "-u", "app.py"]