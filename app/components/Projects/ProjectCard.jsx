import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const ProjectCard = ({ projectTitle, projectOwnerName, videosCount }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {projectTitle || "Project Name"}{" "}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <VideoIcon className="w-4 h-4" />
            <span>{videosCount}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {`Owner: ${projectOwnerName}`}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

export function VideoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}
