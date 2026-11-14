@echo off
echo Starting AquaScan AI FastAPI + YOLOv8 + PyTorch Backend...
cd backend
python -m pip install -r requirements.txt
python run_server.py
pause
