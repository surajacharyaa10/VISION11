# Soccer Video Analytics Core (`soccer/`)

This directory contains the core logic and pipeline for the Soccer Video Analytics project. It handles the structural representation of the match, players, and events, working downstream from the Object Detection and Classification models.

## 🏃 Pipeline Overview

The complete video processing pipeline consists of five major steps:

1. **Object Detection (YOLOv5):** 
   - Uses YOLOv5 (with COCO pre-trained weights) to detect all players on the field.
   - Uses a custom-trained YOLOv5 model (e.g., `models/ball.pt`) to detect the soccer ball.
2. **Object Tracking (Norfair):** 
   - Applies the `norfair` tracking library with camera motion estimation to assign stable unique IDs to players and track the ball's trajectory consistently frame-by-frame.
3. **Team Classification (HSV & Inertia):** 
   - Crops each player's bounding box and applies an `HSVClassifier` to determine their team based on shirt color (e.g., Team A vs Team B).
   - An `InertiaClassifier` ensures temporal stability, preventing players from flickering between teams due to lighting changes.
4. **Match State & Event Processing (`soccer/match.py` & `pass_event.py`):**
   - Continuously calculates the distance from each player to the ball to identify the "closest player".
   - Updates the global match possession timer based on the team of the player possessing the ball.
   - Detects pass events by tracking when the ball is released by one player and received by another player on the same team.
5. **Rendering (`soccer/draw.py`):**
   - Renders bounding boxes, team colors, IDs, ball paths, and graphical UI boards (possession and pass counters) over the video frames.

---

## 📁 Core Modules

### `match.py`
The orchestrator of the game logic. It manages:
- **Teams:** Keeps track of the Home and Away teams.
- **Possession:** Calculates which player and team currently have the ball based on distance thresholds and consecutive frame tracking.
- **Game Time:** Tracks the duration of the match and updates possession statistics.
- **UI Drawing Logic:** Calls the drawing routines for the possession bars and pass counters.

### `pass_event.py`
Handles the complex logic of identifying passes.
- It tracks the `init_player_with_ball` and the `last_player_with_ball`.
- A pass is validated if the ball transitions between two distinct players who belong to the **same team**.
- Generates `Pass` objects containing absolute coordinates, which are later drawn as arrows on the field.

### `player.py` & `ball.py`
Data classes representing the active entities on the field.
- **Player:** Stores the bounding box, associated team, tracking ID, and calculates the specific feet location (to draw lines to the ball).
- **Ball:** Stores the ball's location and handles rendering its marker.

### `team.py`
A simple structural class defining a team's name, abbreviation, UI colors, possession percentage, and total passes completed.

### `draw.py`
A robust drawing utility using `Pillow` (PIL) to generate aesthetic overlays. It provides functions for:
- Drawing bounding boxes with rounded corners.
- Drawing graphical UI boards with alpha transparency.
- Drawing arrows for passes and dynamic possession bars.

---

## 🚀 How to Run the Pipeline Properly

The pipeline is executed via the `run.py` script located in the root directory.

### Prerequisites
Make sure your environment is activated and the correct packages are installed (specifically `Pillow==9.4.0` to avoid rendering bugs with bounding boxes).

```bash
# Activate your environment
source .venv/bin/activate
```

### Basic Command
To run the analytics pipeline with all features enabled (Possession tracking + Pass detection):

```bash
python3 run.py --video input_videos/100001.mp4 --possession --passes

python3 run.py --video input_videos/100001.mp4 --possession 

python3 run.py --video input_videos/100001.mp4 --passes
```

### Available Arguments:
- `--video`: Path to the input video you want to process (default: `input_videos/100001.mp4`).
- `--model`: Path to the custom YOLOv5 ball weights (default: `models/ball.pt`).
- `--possession`: Flag to enable possession tracking and render the possession UI board.
- `--passes`: Flag to enable pass detection logic and render pass arrows / the pass counter UI board.

*(Note: The output video will be saved automatically by the script using the Norfair `Video` class, usually named `{video_name}_out.mp4` in the root directory).*

---

## 🗂️ Project Folder Structure

Below is an overview of the main directories and files in this project:

```text
soccer-video-analytics/
│
├── fonts/               # Font files used by Pillow to draw UI text (e.g., counters)
├── images/              # Static image assets used for UI backgrounds (e.g., possession boards)
├── inference/           # Machine learning wrappers and logic
│   ├── yolov5.py        # Object detection wrapper for players and the ball
│   └── *_classifier.py  # Various classifiers (HSV, Inertia, NN) used for team color classification
│
├── input_videos/        # Directory to place your raw .mp4 soccer clips for processing
├── models/              # Saved custom model weights (e.g., ball.pt)
│
├── soccer/              # 🧠 Core Analytics Engine
│   ├── ball.py          # Ball data class
│   ├── draw.py          # Pillow rendering utilities
│   ├── match.py         # Global match state, possession counters, and time tracking
│   ├── pass_event.py    # Logic for detecting and validating passes
│   ├── player.py        # Player data class
│   └── team.py          # Team data class
│
├── run.py               # 🚀 Main entrypoint script to execute the pipeline
├── run_utils.py         # Helper functions for the main loop (motion estimation, fetching detections)
├── pyproject.toml       # Poetry dependency management file
└── poetry.lock          # Poetry lock file for reproducible environments
```
