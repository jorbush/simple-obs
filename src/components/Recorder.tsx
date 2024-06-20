import { useState, useRef } from "preact/hooks";
import VideoCameraIcon from "../assets/icons/video-camera.svg";
import StopIcon from "../assets/icons/stop.svg";
import SaveIcon from "../assets/icons/save.svg";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    // const stream =
    //   await navigator.mediaDevices.getDisplayMedia({
    //     video: true,
    //     audio: true,
    //   });

    // mediaRecorder.current = new MediaRecorder(stream);
    // mediaRecorder.current.ondataavailable = (event) => {
    //   if (event.data.size > 0) {
    //     setChunks((prev) => [...prev, event.data]);
    //   }
    // };

    // mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  const saveRecording = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
    setChunks([]);
  };

  return (
    <div className="
        flex
        h-screen
        flex-col
        items-center
        justify-center
        space-y-4
    ">
      {!recording ? (
        <button
          onClick={startRecording}
          className="
            transform
            rounded-2xl
            bg-gray-700
            p-4
            px-11
            text-white
            transition-transform
            hover:scale-105
        ">
          <img
            src={VideoCameraIcon}
            alt="Record"
            className="white h-6 w-6"
          />
        </button>
      ) : (
        <div className="flex space-x-1">
          <button
            onClick={stopRecording}
            className="
                transform
                rounded-r-sm
                rounded-l-2xl
                bg-gray-700
                p-4
                text-white
                transition-transform
                hover:scale-105
            ">
            <img
              src={StopIcon}
              alt="Stop"
              className="h-6 w-6"
            />
          </button>
          <button
            onClick={saveRecording}
            className="
            transform
            rounded-l-sm
            rounded-r-2xl
            bg-gray-700
            p-4
            text-white
            transition-transform
            hover:scale-105
          ">
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
