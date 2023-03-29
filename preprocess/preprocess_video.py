import cv2


def read_frames(video_path):
    """Reads frames from video

    Parameters
    ----------
    video_path : str
        Path to video

    Returns
    -------
    array
        All frames from video
    int
        Video frame rate
    """

    cap = cv2.VideoCapture(video_path)
    video_frames = []
    video_fps = round(cap.get(cv2.CAP_PROP_FPS))

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        video_frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    return video_frames, video_fps

def preprocess_detected_frames(video_frames, detection_info):
    """Preprocesses frames

    Parameters
    ----------
    video_path : str
        Path to video
    detection_info : dict
        Info about dangerous frames

    Returns
    -------
    array
        Preprocessed video frames
    """

    for k in detection_info:
        start = detection_info[k]['first_frame']
        end = detection_info[k]['last_frame']

        if start - 2 > 0:
            start -= 2

        for i in range(start, end):
            video_frames[i] = cv2.normalize(video_frames[i], video_frames[i], -100, 50, cv2.NORM_MINMAX)
            video_frames[i] = cv2.blur(video_frames[i], (19, 19))
    return video_frames

def make_video_from_frames(video_frames, video_fps, out_path):
    """Makes video from frames and saves it

    Parameters
    ----------
    video_frames : array
        Video frames
    video_path : str
        Path to video
    out_path: str
        Path to video save directory
    """

    out = cv2.VideoWriter(out_path + '.mp4', cv2.VideoWriter_fourcc('M','P','4','1'), video_fps, (video_frames[0].shape[1], video_frames[0].shape[0]))
    
    for i in range(len(video_frames)):
        out.write(cv2.cvtColor(video_frames[i], cv2.COLOR_RGB2BGR))
    out.release()

# video_path = ''
# video_out_path = ''

# video_frames, video_fps = read_frames(video_path)
# # detection_info - то, что придет от ml
# preprocessed_frames = preprocess_detected_frames(video_frames, detection_info)
# make_video_from_frames(preprocessed_frames, video_fps)
