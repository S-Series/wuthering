FROM python:3.10-slim

WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 모델 저장 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/.paddleocr && \
    chmod -R 777 /app/.paddleocr

# ⭐ 환경 변수 설정 (권한 문제 해결)
ENV HOME=/app
ENV PPOCR_HOME=/app/.paddleocr

EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
