"use client";

import { useRef, useState, useCallback } from "react";
import { api } from "@/lib/api";

type RecorderState =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "preview"
  | "uploading"
  | "processing"
  | "done"
  | "error";

interface Props {
  onSopReady: (sopId: string) => void;
}

const MAX_DURATION_SEC = 600; // 10 minutes

export function VideoRecorder({ onSopReady }: Props) {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [uploadPct, setUploadPct] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [recordingId, setRecordingId] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    setState("requesting");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setState("ready");
    } catch {
      setError("Camera access denied. Please allow camera access and try again.");
      setState("error");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/mp4";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      blobRef.current = blob;
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob);
      }
      setState("preview");
    };

    recorder.start(1000); // collect chunks every 1s
    setState("recording");
    setElapsed(0);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= MAX_DURATION_SEC - 1) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const discardAndRetry = useCallback(() => {
    blobRef.current = null;
    setState("idle");
    setElapsed(0);
    setUploadPct(0);
  }, []);

  const upload = useCallback(async () => {
    if (!blobRef.current) return;
    setState("uploading");

    const ext = blobRef.current.type.includes("mp4") ? "mp4" : "webm";
    const file = new File([blobRef.current], `recording.${ext}`, { type: blobRef.current.type });

    try {
      const { recordingId: rid, sopId } = await api.recordings.upload(file, setUploadPct);
      setRecordingId(rid);
      setState("processing");

      // Poll until done
      const poll = setInterval(async () => {
        const status = await api.recordings.status(rid);
        const LABELS: Record<string, string> = {
          UPLOADING: "Uploading...",
          TRANSCRIBING: "Transcribing your video...",
          GENERATING: "Generating SOP steps...",
          COMPLETED: "Done!",
          FAILED: status.error ?? "Processing failed",
        };
        setProcessingStatus(LABELS[status.status] ?? status.status);

        if (status.status === "COMPLETED" && status.sopId) {
          clearInterval(poll);
          setState("done");
          onSopReady(status.sopId);
        } else if (status.status === "FAILED") {
          clearInterval(poll);
          setError(status.error ?? "AI processing failed. Please try again.");
          setState("error");
        }
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setState("error");
    }
  }, [onSopReady]);

  function formatTime(sec: number) {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────

  if (state === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="text-6xl">🎥</div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Record a procedure</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Walk through any job while narrating what you&apos;re doing.
            Primer will generate a full SOP from your video.
          </p>
        </div>
        <button
          onClick={startCamera}
          className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ backgroundColor: "#7F77DD" }}
        >
          Start camera
        </button>
        <p className="text-xs text-gray-400">Max 10 minutes · Works on phone camera</p>
      </div>
    );
  }

  if (state === "requesting") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }}
        />
        <p className="text-sm text-gray-500">Requesting camera access...</p>
      </div>
    );
  }

  if (state === "ready" || state === "recording") {
    return (
      <div className="flex flex-col gap-4">
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
          <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
          {state === "recording" && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-mono">{formatTime(elapsed)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {state === "ready" && (
            <button
              onClick={startRecording}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ backgroundColor: "#7F77DD" }}
            >
              Start recording
            </button>
          )}
          {state === "recording" && (
            <button
              onClick={stopRecording}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm"
            >
              Stop recording
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center">
          Narrate clearly as you go — &ldquo;First I&apos;m checking the filter...&rdquo;
        </p>
      </div>
    );
  }

  if (state === "preview") {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-black rounded-2xl overflow-hidden aspect-video">
          <video ref={previewRef} controls className="w-full h-full" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={discardAndRetry}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200"
          >
            Retake
          </button>
          <button
            onClick={upload}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ backgroundColor: "#7F77DD" }}
          >
            Generate SOP
          </button>
        </div>
      </div>
    );
  }

  if (state === "uploading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading video...</span>
            <span>{uploadPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${uploadPct}%`, backgroundColor: "#7F77DD" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }}
        />
        <div>
          <p className="font-semibold text-gray-900">{processingStatus || "Processing..."}</p>
          <p className="text-sm text-gray-500 mt-1">
            Primer is reading your video and writing your SOP. Usually takes 1–2 minutes.
          </p>
        </div>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-900">SOP generated!</h2>
        <p className="text-sm text-gray-500">Redirecting you to review and publish...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="text-5xl">❌</div>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={discardAndRetry}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#7F77DD" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return null;
}
