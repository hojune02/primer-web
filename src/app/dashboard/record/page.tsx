"use client";

import { useRouter } from "next/navigation";
import { VideoRecorder } from "@/components/recorder/VideoRecorder";

export default function RecordPage() {
  const router = useRouter();

  function handleSopReady(sopId: string) {
    setTimeout(() => {
      router.push(`/dashboard/sops/${sopId}`);
    }, 1500);
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Record a procedure</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Walk through the job while narrating. AI generates the SOP automatically.
        </p>
      </div>

      <div className="max-w-xl">
        <VideoRecorder onSopReady={handleSopReady} />
      </div>
    </div>
  );
}
