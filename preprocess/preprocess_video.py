import cv2


def read_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    video_frames = []
    while True:
        ret, frame = cap.read()

        if not ret:
            break

        video_frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    return video_frames

def preprocess_detected_frames(video_frames, detection_info):
    for k in detection_info:
        start = detection_info[k]['first_frame']
        end = detection_info[k]['last_frame']

        if start - 2 > 0:
            start -= 2

        for i in range(start, end):
            video_frames[i] = cv2.normalize(video_frames[i], video_frames[i], -100, 50, cv2.NORM_MINMAX)
            video_frames[i] = cv2.blur(video_frames[i], (19, 19))
    return video_frames

def make_video_from_frames(video_frames, out_path):
    out = cv2.VideoWriter(out_path + '.mp4', cv2.VideoWriter_fourcc('M','P','4','1'), 24.0, (video_frames[0].shape[1], video_frames[0].shape[0]))
    
    for i in range(len(video_frames)):
        out.write(cv2.cvtColor(video_frames[i], cv2.COLOR_RGB2BGR))
    out.release()