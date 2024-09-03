"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Combobox } from "../../components/AddNewVideoModal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { isUserOwner } from "@/app/lib/uploadPermission";
import UploadNewVersion from "./components/UploadNewVersion";

function Video({ params }) {
  const [video, setVideo] = useState(null);
  const [videoStatus, setVideoStatus] = useState(
    video && video.status ? video.status : "pending"
  );
  const [isOwner, setIsOwner] = useState(false);
  const [reloadKey, setReloadKey] = useState(1); // To force to re render video, when the video file is changed but path and so url is same as previous
  useEffect(() => {
    retriveVideo();
  }, []);
  const videoId = params.videoId;
  const projectId = params.projectId;
  useEffect(() => {
    checkUserIsOwner(projectId);
  }, [projectId]);

  const checkUserIsOwner = async (projectId) => {
    const io = await isUserOwner(projectId);
    setIsOwner(io);
  };

  const retriveVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("videoId", videoId);
      const res = await fetch("/api/video/retrive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 200) {
        setVideo(data.video);
        setVideoStatus(data.video.status);
        setReloadKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateVideoStatus = async (videoStatus) => {
    try {
      const formData = new FormData();
      formData.append("videoId", videoId);
      formData.append("videoStatus", videoStatus);
      const res = await fetch("/api/video/updateStatus", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data && data.status == 200) {
        setVideoStatus(videoStatus);
        return;
      }
      throw new Error("Something went wrong updating status");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccess = async (response) => {
    const { path, title, desc } = video;
    if (!path || path === "") return;
    const { code, expires_in } = response;
    const formData = new FormData();
    formData.append("code", code);
    formData.append("videoPath", path);
    formData.append("description", desc);
    formData.append("title", title);
    formData.append("expires_at", Date.now() + expires_in);
    try {
      const res = await fetch("/api/video/uploadToYoutube", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Sucess");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    video && (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="mb-4 col-span-3">
            <video
              key={reloadKey}
              className="aspect-video rounded-lg w-full"
              controls
            >
              <source src={video?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="col-span-1 px-4">
            <Card className="p-3 mb-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="description" className="text-right">
                  Video Status
                </Label>
                <Combobox
                  videoStatus={videoStatus}
                  setVideoStatus={updateVideoStatus}
                />
              </div>
            </Card>
            <UploadNewVersion video={video} retriveVideo={retriveVideo} />
            {isOwner && (
              <>
                <Separator className="my-4" />
                <GoogleOAuthProvider clientId="192238680972-77n8uc47jf2f810kv5vokk4a2tond0rs.apps.googleusercontent.com">
                  <UploadToYoutubeButton
                    disabled={videoStatus === "readyForUpload" ? false : true}
                    handleSuccess={handleSuccess}
                  />
                </GoogleOAuthProvider>
              </>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <p>{video.desc}</p>
        </div>
      </div>
    )
  );
}

export default Video;

export const UploadToYoutubeButton = ({ handleSuccess, disabled }) => {
  const signInWithGoogle = useGoogleLogin({
    onSuccess: handleSuccess,
    onerror: (error) => console.log(error),
    scope: "https://www.googleapis.com/auth/youtubepartner",
    prompt: "consent",
    accessType: "offline",
    flow: "auth-code",
    redirect_uri: "postmessage",
  });
  return (
    <Button
      disabled={disabled}
      className="w-full mb-4"
      onClick={signInWithGoogle}
    >
      Upload to Youtube
    </Button>
  );
};

const TeamMembers = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">m@example.com</p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Owner{" "}
                <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <Command>
                <CommandInput placeholder="Select new role..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Viewer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view and comment.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Developer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and edit.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Billing</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and manage billing.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Owner</p>
                      <p className="text-sm text-muted-foreground">
                        Admin-level access to all resources.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/02.png" alt="Image" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Jackson Lee</p>
              <p className="text-sm text-muted-foreground">p@example.com</p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Member{" "}
                <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <Command>
                <CommandInput placeholder="Select new role..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup className="p-1.5">
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Viewer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view and comment.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Developer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and edit.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Billing</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and manage billing.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Owner</p>
                      <p className="text-sm text-muted-foreground">
                        Admin-level access to all resources.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/03.png" alt="Image" />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                Isabella Nguyen
              </p>
              <p className="text-sm text-muted-foreground">i@example.com</p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Member{" "}
                <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <Command>
                <CommandInput placeholder="Select new role..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup className="p-1.5">
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Viewer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view and comment.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Developer</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and edit.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Billing</p>
                      <p className="text-sm text-muted-foreground">
                        Can view, comment and manage billing.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Owner</p>
                      <p className="text-sm text-muted-foreground">
                        Admin-level access to all resources.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
