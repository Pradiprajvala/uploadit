import { useEffect, useRef, useState } from "react";
const { Button } = require("@/components/ui/button");
const {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} = require("@/components/ui/dialog");
const { Input } = require("@/components/ui/input");
const { Label } = require("@/components/ui/label");
const { Textarea } = require("@/components/ui/textarea");
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function AddNewVideoModal({
  handleCreateSuccess,
  isModalOpen,
  setIsModalOpen,
  projectId,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoStatus, setVideoStatus] = useState("pending");

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const isCredentialsValid = (title, desc) => {
    return videoFile != null;
  };
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const uploadVideoToDatabase = async () => {
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("projectId", projectId);
      formData.append("status", videoStatus);
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("defaultThumbnail", extractThumbnail());
      try {
        const res = await fetch("/api/video/uploadToDB", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        if (data?.status === 201) handleCreateSuccess(data.video);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const extractThumbnail = () => {
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

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Fill in the details for your new video.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            {videoFile && (
              <div className="col-span-4">
                <video
                  width="400"
                  height="400"
                  className="rounded-lg"
                  ref={videoRef}
                  controls
                >
                  <source
                    src={URL.createObjectURL(videoFile)}
                    type={videoFile.type}
                  />
                  Your browser does not support the video tag.
                </video>
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              </div>
            )}
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="videoFile" className="text-right">
              Video File
            </Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/*"
              className="col-span-3"
              onChange={(e) => {
                handleVideoFileChange(e);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Video Title"
              className="col-span-3"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description of Video"
              className="col-span-3"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="description" className="text-right">
              Video Status
            </Label>
            <Combobox
              videoStatus={videoStatus}
              setVideoStatus={setVideoStatus}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={!isCredentialsValid(title, desc)}
            onClick={() => uploadVideoToDatabase()}
          >
            Upload Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewVideoModal;

export function Combobox({ videoStatus, setVideoStatus }) {
  const [open, setOpen] = useState(false);

  let videoStatuses = [
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "readyForReview",
      label: "Ready for review",
    },
    {
      value: "reviewed",
      label: "Reviewed",
    },
    {
      value: "readyForUpload",
      label: "Ready for upload",
    },
    {
      value: "uploaded",
      label: "Uploaded",
    },
    {
      value: "scheduled",
      label: "Scheduled",
    },
  ];

  videoStatuses = videoStatuses.filter(
    (status) => status.value !== "uploaded" && status.value !== "scheduled"
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {videoStatuses.find((status) => status.value === videoStatus)?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Status..." />
          <CommandList>
            <CommandEmpty>No Video Status found.</CommandEmpty>
            <CommandGroup>
              {videoStatuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(currentValue) => {
                    setVideoStatus(
                      currentValue === videoStatus ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      videoStatus === status.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
