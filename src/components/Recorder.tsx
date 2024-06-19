import { useState, useRef } from "preact/hooks";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    const stream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.current.start();
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
    <div className="flex h-screen flex-col items-center justify-center">
      {!recording ? (
        <button
          onClick={startRecording}
          className="rounded bg-green-500 p-4 text-white"
        >
          Record
        </button>
      ) : (
        <div>
          <button
            onClick={stopRecording}
            className="m-2 rounded bg-red-500 p-4 text-white"
          >
            Stop
          </button>
          <button
            onClick={saveRecording}
            className="m-2 rounded bg-blue-500 p-4 text-white"
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
};

export default Recorder;
