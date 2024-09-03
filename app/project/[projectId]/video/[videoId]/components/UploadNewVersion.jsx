import { extractThumbnail } from "@/app/Services/Client/Video/ExtractThumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";

function UploadNewVersion({ video, retriveVideo }) {
  const [videoFile, setVideoFile] = useState(null);
  const videoInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const reUploadVideoToDatabase = async () => {
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("videoId", video._id);
      formData.append("videoPath", video.path);
      formData.append(
        "defaultThumbnail",
        extractThumbnail(videoRef, canvasRef)
      );
      try {
        console.log("Fetching");
        const res = await fetch("/api/video/updateVideo", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        if (data?.status === 201) {
          console.log("Success", data);
          setVideoFile(null);
          if (retriveVideo) await retriveVideo();
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {videoFile && (
        <>
          <video
            width="400"
            height="400"
            className="rounded-lg mb-4"
            ref={videoRef}
            controls
          >
            <source
              src={URL.createObjectURL(videoFile)}
              type={videoFile.type}
            />
            Your browser does not support the video tag.
          </video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </>
      )}
      <Button
        className="w-full bg-black hover:bg-black"
        onClick={() => videoInputRef.current.click()}
      >
        Select video to Re-upload
        <Input
          id="videoFile"
          type="file"
          accept="video/*"
          ref={videoInputRef}
          className="hidden"
          onChange={(e) => {
            setVideoFile(e.target.files[0]);
          }}
        />
      </Button>
      {videoFile && (
        <Button className="w-full mt-4" onClick={reUploadVideoToDatabase}>
          Re-upload
        </Button>
      )}
    </>
  );
}

export default UploadNewVersion;
