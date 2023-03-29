import cv2
import numpy as np
import matplotlib.pyplot as plt 


def create_positive_negative_images(difference):
    """Creates two arrays, positive and negative pixels of difference

    Parameters
    ----------
    difference : numpy.ndarray
        Difference (pixel by pixel) of 2 video frames

    Returns
    -------
    numpy.ndarray
        Difference positive pixels
    numpy.ndarray
        Difference negative pixels
    """

    positive_image = np.maximum(difference, 0)
    negative_image = np.minimum(difference, 0)
    return positive_image, negative_image

def generate_histogram(image):
    """Generates histogram of image

    Parameters
    ----------
    image : numpy.ndarray
        Frame positive or negative pixels

    Returns
    -------
    numpy.ndarray
        Histogram of image
    """

    histogram = cv2.calcHist([image], [0], None, [513], [-256, 256])
    return histogram

def f(x):
    """Converts image pixels to luminance

    Parameters
    ----------
    x : np.float32
        Frame pixel

    Returns
    -------
    np.float32
        Converted pixel
    """

    return np.round(413.435*pow((0.002745*x + 0.0189623), 2.2))

def scan_histogram(hist, target_sum):
    """Scans histogram for elements and its multiplied sum

    Parameters
    ----------
    hist : numpy.ndarray
        Image
    target_sum : int
        Min pixels

    Returns
    -------
    int
        Computed total elements of histogram
    int
        Multiplied sum of pixels
    """

    total_elements = 0
    element_sum = 0
    index = 512
    
    while total_elements < target_sum and index >= 0:
        elements_in_bin = hist[index][0]
        total_elements += elements_in_bin
        element_sum += elements_in_bin * (index - 256)
        index -= 1
        
    return total_elements, element_sum

def compute_average(total_elements, element_sum):
    """Coumputes average brightness variation of image

    Parameters
    ----------
    total_elements : int
        Elements of histogram
    element_sum : int
        Multiplied sum of pixels

    Returns
    -------
    float
        Average brightness variation of image
    """

    return element_sum / total_elements

def filter_event_list(local_extremes, video_fps, video_frames, video_length):
    """Filters event list for dangerous frames

    Parameters
    ----------
    local_extremes : array
        Candidate frames
    video_fps : int
        Video frame rate
    video_frames : int
        Total count of frames in video
    video_length : float
        Video length in seconds

    Returns
    -------
    dict
        Dangerous frames
    """

    warn_dict = {}
    for i in range(2, len(local_extremes)):
        n_frames = local_extremes[i]['frames'] + local_extremes[i - 1]['frames'] + local_extremes[i - 2]['frames']
        if n_frames / video_fps > 1:
            continue
        temp_array = np.array([abs(local_extremes[i]['acc_brightness']), abs(local_extremes[i - 1]['acc_brightness']), abs(local_extremes[i - 2]['acc_brightness'])])
        if len(temp_array[temp_array > 10]) < 3:
            continue
        # TODO: rewrite
        if local_extremes[i - 2]['frame_number'] not in warn_dict:
            warn_dict[local_extremes[i - 2]['frame_number']] = (local_extremes[i - 2]['frame_number'] / video_frames) * video_length
        if local_extremes[i - 1]['frame_number'] not in warn_dict:
            warn_dict[local_extremes[i - 1]['frame_number']] = (local_extremes[i - 1]['frame_number'] / video_frames) * video_length
        if local_extremes[i]['frame_number'] not in warn_dict:
            warn_dict[local_extremes[i]['frame_number']] = (local_extremes[i]['frame_number'] / video_frames) * video_length
    return warn_dict

def frames_for_preprocessing(event_list, video_fps):
    """Makes intervals of dangerous moments

    Parameters
    ----------
    event_list : dict
        Dictionary of dangerous frames
    video_fps : int
        Video frame rate

    Returns
    -------
    dict
        Intervals of dangerous moments
    """

    result_dict = {}

    event_list_keys = list(event_list.keys())
    start_frame = event_list_keys[0]
    gaps_count = 0
    frame_gap = 0

    for i in range(1, len(event_list_keys)):
        if event_list_keys[i] - event_list_keys[i - 1] > video_fps:
            result_dict[gaps_count] = {'first_frame': start_frame, 'last_frame': event_list_keys[i - 1]}
            gaps_count += 1
            start_frame = event_list_keys[i]
            frame_gap = 0
        else:
            frame_gap += 1

        if i == (len(event_list_keys) - 1):
            if frame_gap != 0:
                result_dict[gaps_count] = {'first_frame': start_frame, 'last_frame': event_list_keys[i]}

    return result_dict


def detect_dangerous_frames(video_path):
    """Analyses video for dangerous flashes

    Parameters
    ----------
    video_path : str
        Path to video

    Returns
    -------
    dict
        Intervals of dangerous moments
    """
    
    cap = cv2.VideoCapture(video_path)

    _, prev_frame = cap.read()
    prev_frame = f(cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY).astype(np.float32))
    current_acc_brightness = 0.0000001

    local_extremes = []
    frame_count = 0
    extreme_frame = 0
    extreme_count = 0
    target_sum = int(prev_frame.shape[0] * prev_frame.shape[1] * 0.9)

    video_fps = round(cap.get(cv2.CAP_PROP_FPS))
    video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) - 1)
    video_length = round(video_frames / video_fps, 1)

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        frame = f(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float32))
        difference = np.subtract(frame, prev_frame)
        positive_image, negative_image = create_positive_negative_images(difference)

        average_values = []

        for image in [positive_image, negative_image]:
            histogram = generate_histogram(image)
            total_elements, element_sum = scan_histogram(histogram, target_sum)
            average_value = compute_average(total_elements, element_sum)
            average_values.append(average_value)
        
        if abs(average_values[0]) > abs(average_values[1]):
            average_brightness = average_values[0]
        elif abs(average_values[0]) < abs(average_values[1]):
            average_brightness = average_values[1]
        else:
            average_brightness = average_values[0]

        if np.sign(average_brightness) == np.sign(current_acc_brightness):
            current_acc_brightness += average_brightness
        elif np.sign(average_brightness) == 0 and np.sign(current_acc_brightness) == 1:
            current_acc_brightness += average_brightness
        else:
            extreme_count += 1
            local_extremes.append({'frames': frame_count - extreme_frame, 'acc_brightness': current_acc_brightness, 'frame_number': frame_count})
            extreme_frame = frame_count
            current_acc_brightness = average_brightness

        prev_frame = frame
        frame_count += 1

    cap.release()

    filtered_event_list = filter_event_list(local_extremes, video_fps, video_frames, video_length)

    return frames_for_preprocessing(filtered_event_list, video_fps)

# detect_dangerous_frames('/content/drive/My Drive/pokkemon1.mp4')