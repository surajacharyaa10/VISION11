<div align="center">
  <h1>VISION11: Soccer AI Analytics</h1>
</div>

## 👋 hello

Welcome to the **VISION11** soccer analytics pipeline! In sports, every centimeter and every second matter. This repository utilizes state-of-the-art computer vision models (YOLO, ByteTrack, Supervision) to extract powerful insights from soccer match footage. Our pipeline supports a variety of advanced features including detecting players, tracking the ball, classifying teams based on jersey colors, and rendering a top-down radar minimap view of the pitch.

## 🥵 challenges

Tracking dynamic elements in a fast-paced sports match presents numerous challenges that this repository tackles:

- **Ball tracking:** Tracking the ball is extremely difficult due to its small size and rapid movements. We use a buffered centroid tracker (`BallTracker`) to interpolate and stabilize detections.
- **Camera calibration:** Accurately calibrating camera views is crucial for extracting advanced statistics. We map the camera perspective to a 2D top-down view (Radar) by detecting pitch keypoints and computing a homography matrix (`ViewTransformer`).
- **Player tracking & Team classification:** Maintaining consistent player identification throughout a game is a challenge. We track players persistently across frames (`ByteTrack`) and use UMAP/KMeans on cropped player images to classify teams dynamically based on jersey colors (`TeamClassifier`).

## 📁 project structure

```text
sports_football/
├── data/                  # Contains YOLO .pt model weights
├── requirements.txt       # Python dependencies
├── soccer/
│   └── main.py            # The main pipeline execution script
└── sports/                # Core library modules
    ├── annotators/
    │   └── soccer.py      # Drawing utilities for the pitch, Voronoi diagrams, etc.
    ├── common/
    │   ├── ball.py        # Ball tracking and annotation logic
    │   ├── team.py        # Feature extraction and clustering for team classification
    │   └── view.py        # Perspective transformations (Homography)
    └── configs/
        └── soccer.py      # Standard soccer pitch dimensions and keypoint configurations
```

## 🚀 pipeline modes

The main entry point for video analysis is `soccer/main.py`. You can run it with different `--mode` arguments depending on the level of analysis required:

- **`PITCH_DETECTION`**: Detects keypoints on the soccer field (like the penalty box, center circle) and annotates them.
- **`PLAYER_DETECTION`**: Detects players, referees, and goalkeepers using YOLO, drawing bounding boxes.
- **`BALL_DETECTION`**: Tracks the soccer ball across frames with interpolation to handle motion blur and occlusions.
- **`PLAYER_TRACKING`**: Adds `ByteTrack` to player detection to assign consistent IDs to players over time.
- **`TEAM_CLASSIFICATION`**: Groups tracked players into two teams using deep feature extraction and highlights them with different colors.
- **`RADAR`**: The ultimate mode. It combines pitch detection, player tracking, and team classification to render a live 2D top-down minimap of the game overlaid on the video.

## 💻 install & usage

Ensure you are in a **Python >= 3.8** environment.

1. **Install dependencies:**

```bash
cd sports_football
pip install -r requirements.txt
```

*(Note: If you are running on a Mac, ensure you have an up-to-date PyTorch installation to use MPS acceleration)*

2. **Run the pipeline:**

Execute the `main.py` script, specifying your input video, output path, device (`cpu`, `cuda`, or `mps`), and the desired mode.

```bash
cd soccer
python3 main.py \
  --source_video_path ../data/your_video.mp4 \
  --target_video_path ../data/output.mp4 \
  --device mps \
  --mode RADAR
```

## 🧠 core modules breakdown

- **`TeamClassifier`** (`sports/common/team.py`): Uses `SiglipVisionModel` to extract visual features from player crops, reduces dimensionality with `UMAP`, and clusters them into two distinct teams using `KMeans`.
- **`ViewTransformer`** (`sports/common/view.py`): Uses OpenCV's `findHomography` to map points from the dynamic camera's perspective onto a standard 2D soccer pitch layout defined in `sports/configs/soccer.py`.
- **`BallTracker`** (`sports/common/ball.py`): Maintains a rolling deque buffer of ball detections to smooth out trajectories and predict missing frames using spatial proximity calculations.