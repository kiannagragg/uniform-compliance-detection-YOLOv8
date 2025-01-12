from flask import Flask, Response, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from uniform_check import UniformCheck
import time

# Flask and SocketIO setup
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
uniform_check = UniformCheck()

camera_active = False  # Global variable to track camera state

@app.route("/")
def index():
    """Test endpoint to ensure backend is running."""
    return jsonify({"message": "Backend is running"})

@app.route("/start_camera", methods=["POST"])
def start_camera():
    """Start the camera."""
    global camera_active
    camera_active = True
    uniform_check.initialize_camera()  # Reinitialize the camera
    return jsonify({"message": "Camera started"})

@app.route("/stop_camera", methods=["POST"])
def stop_camera():
    """Stop the camera."""
    global camera_active
    camera_active = False
    uniform_check.release_camera()  # Release the camera resource
    return jsonify({"message": "Camera stopped"})

def generate_frames():
    """Generate video frames and emit detection data."""
    global camera_active
    while camera_active:
        frame_bytes, detection_data = uniform_check.get_video_with_anomaly_detection()
        if not frame_bytes:
            break  # Exit loop if no frames are available (camera stopped)
        socketio.emit("detection_data", detection_data)  # Send detection data
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n\r\n")
        time.sleep(0.03)  # Prevent overloading the system

@app.route("/video_feed")
def video_feed():
    """Video streaming route."""
    if not camera_active:
        return Response(b"", mimetype="multipart/x-mixed-replace; boundary=frame")  # Empty feed
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    socketio.run(app, debug=True)

