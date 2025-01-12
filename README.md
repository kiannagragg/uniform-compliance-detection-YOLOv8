# Real-time-Uniform-Compliance-Detection-YOLOv8
This is the source code for the University Uniform Compliance Detection System, as described in the paper ["FitCheck: Real-time University Uniform Compliance Detection using YOLOv8"] by Kianna Alexandra L. Gragg, Aubrey D. Ragandan, and Dianne Y. Taguibao. The software employs the YOLOv8 algorithm to analyze real-time video footage captured by a camera, enabling it to determine whether students at Technological University of the Philippines-Manila (TUP-Manila) are wearing complete or incomplete uniforms.

## Summary
This project is an AI-driven system designed to monitor adherence to policies in wearing the university uniform in Technological University of the Philippines-Manila (TUP-Manila). The project employed the YOLOv8 object detection model. This enabled the model to detect multiple objects in a single frame. It is used for identifying and validating multiple uniform components at one time. For our system, classification is used to determine whether a detected instance is an anomaly or not. This means the system analyzes features of the detected uniform (such as missing items) and assigns it to one of two categories: "anomaly" (non-compliance) or "not anomaly" (compliance).

## How to Run 

1. Create virtual environment:

```bash
python -m venv venv
```

2. Activate virtual environment:

```bash
venv/Scripts/activate
```

### Backend Setup 

1. Navigate to backend directory:

```bash
cd backend
```

2. Install required dependencies:

```bash
pip install -r requirements.txt
```

3. Start the server:

```bash
python app.py
```
### Frontend Setup (ReactJS)

1. Navigate to frontend directory (in new terminal):

```bash
cd frontend
```

2. Install required dependencies:

```bash
npm install
```

3. Start the React frontend:

```bash
npm start
```
