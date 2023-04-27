FROM python:3.7

RUN mkdir /TheGameBazar
WORKDIR /TheGameBazar
ADD . /TheGameBazar/
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "/TheGameBazar/backend.py"]
