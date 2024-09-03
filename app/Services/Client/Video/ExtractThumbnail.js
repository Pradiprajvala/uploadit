const extractThumbnail = (videoRef, canvasRef) => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current frame from the video onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // base64 String
  const thumbnail = canvas.toDataURL("image/png");

  return thumbnail;
};

export { extractThumbnail };
