from ultralytics import YOLO
import cv2
import matplotlib.colors as colors
import json

class UniformCheck:
    def __init__(self):
        self.model = YOLO('./models/best.pt')  # Load your YOLO model
        self.classes = ["black shoes", "uniformBottom", "id", "logo", "uniformTop"]
        self.colors = ['#57cfff', '#60ff7a', '#f2ff4f', '#25a855', '#1787b4', '#98a500']
        self.expected_classes = set(self.classes)
        self.video = None  # Initialize camera as None
        self.CONFIDENCE_THRESHOLD = 0.7

    def initialize_camera(self):
        """Initialize or reinitialize the camera."""
        if self.video is not None and self.video.isOpened():
            self.release_camera()  # Release any existing camera instance
        self.video = cv2.VideoCapture(0)  # Open the camera
        if not self.video.isOpened():
            raise RuntimeError("Failed to initialize camera.")
        print("Camera initialized successfully.")

    def release_camera(self):
        """Release the camera resource."""
        if self.video is not None and self.video.isOpened():
            self.video.release()
        self.video = None
        print("Camera resource released.")

    def get_video_with_anomaly_detection(self):
        """Process video, perform YOLO detection, and detect anomalies."""
        if self.video is None or not self.video.isOpened():
            return None, json.dumps({"error": "Camera feed is not available"})

        ret, frame = self.video.read()
        if not ret:
            return None, json.dumps({"error": "Failed to read frame from camera"})

        results = self.model(frame)
        detected_classes = set()

        for result in results:
            boxes = result.boxes
            for box in boxes:
                if box.conf < self.CONFIDENCE_THRESHOLD:
                    continue

                class_id = int(box.cls)
                confidence = box.conf.item()

                x1, y1, x2, y2 = map(int, box.xyxy.tolist()[0])
                class_name = self.classes[class_id]
                detected_classes.add(class_name)

                hex_color = self.colors[class_id]
                rgb_color = colors.to_rgb(hex_color)
                color_tuple = tuple([int(255 * c) for c in rgb_color])
                cv2.rectangle(frame, (x1, y1), (x2, y2), color_tuple, 2)
                text = f"{class_name} {confidence * 100:.2f}%"
                cv2.putText(frame, text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_tuple, 1)

        missing_items = list(self.expected_classes - detected_classes)
        detection_data = {
            "total_detected": len(detected_classes),
            "detected": list(detected_classes),
            "missing": missing_items,
            "status": "compliant" if not missing_items else "anomaly",
        }

        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes(), json.dumps(detection_data)