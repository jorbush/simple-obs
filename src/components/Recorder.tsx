import { useState, useRef } from "preact/hooks";
import VideoCameraIcon from "../assets/icons/video-camera.svg";
import StopIcon from "../assets/icons/stop.svg";
import SaveIcon from "../assets/icons/save.svg";
import PlayIcon from "../assets/icons/play.svg";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startRecording = async () => {
    const stream =
      await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
      });

    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8,opus",
    });

    // Save the recording when the recording stops
    mediaRecorder.current.ondataavailable = (event) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(event.data);
      link.download = "recording.webm";
      link.click();
    };

    mediaRecorder.current.start();
    setRecording(true);
    setPaused(false);
    setRecordingTime(0);

    // Add event listener to stop recording when the stream ends
    const [videoTrack] = stream.getVideoTracks();
    videoTrack.addEventListener("ended", () => {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setRecording(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    });

    intervalRef.current = window.setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.pause();
      setPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && paused) {
      mediaRecorder.current.resume();
      setPaused(false);
      intervalRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      console.log("Recording stopped");
    }
    setRecording(false);
    setPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {recording && (
        <div className="flex items-center space-x-2">
          <div
            className={`h-4 w-4 rounded-full ${paused ? "bg-red-600" : "animate-blink bg-red-600"}`}
          ></div>
          <span>
            {new Date(recordingTime * 1000)
              .toISOString()
              .substr(11, 8)}
          </span>
        </div>
      )}
      {!recording ? (
        <button
          onClick={startRecording}
          className="mt-10 transform rounded-2xl bg-gray-700 p-4 px-11 text-white transition-transform hover:scale-105"
        >
          <img
            src={VideoCameraIcon}
            alt="Record"
            className="white h-6 w-6"
          />
        </button>
      ) : (
        <div className="flex space-x-1">
          <button
            onClick={
              paused ? resumeRecording : pauseRecording
            }
            className="transform rounded-l-2xl rounded-r-sm bg-gray-700 p-4 text-white transition-transform hover:scale-105"
          >
            <img
              src={paused ? PlayIcon : StopIcon}
              alt={paused ? "Resume" : "Pause"}
              className="h-6 w-6"
            />
          </button>
          <button
            onClick={stopRecording}
            className="transform rounded-l-sm rounded-r-2xl bg-gray-700 p-4 text-white transition-transform hover:scale-105"
          >
            <img
              src={SaveIcon}
              alt="Save"
              className="h-6 w-6"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Recorder;
