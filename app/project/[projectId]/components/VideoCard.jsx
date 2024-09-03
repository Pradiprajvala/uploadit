import React from "react";
import Link from "next/link";
import Image from "next/image";

function VideoCard({ video }) {
  const pathname = window.location.pathname;
  return (
    <Link
      className="flex justify-center cursor-pointer"
      href={`${pathname}/video/${video._id}`}
    >
      <div className="grid grid-cols-4 gap-4 md:w-[80%] sm:w-[90%] ">
        <Image
          src={video.defaultThumbnail}
          alt=""
          className="col-span-1 rounded-lg"
          width={500}
          height={500}
        />
        <div className="flex flex-col col-span-3">
          <div className="text-xl font-semi-bold">{video?.title}</div>
          <div className="text-md text-muted-foreground truncate ">
            {video?.desc}
          </div>
          <div className="text-md text-muted-foreground">
            Status:{" "}
            {video.status === "pending" && (
              <span className="text-yellow-500">{video.status}</span>
            )}
            {video.status === "readyForReview" && (
              <span className="text-orange-500">{video.status}</span>
            )}
            {video.status === "reviewed" && (
              <span className="text-blue-500">{video.status}</span>
            )}
            {video.status === "readyForUpload" && (
              <span className="text-green-300">{video.status}</span>
            )}
            {video.status === "uploaded" ||
              (video.status === "scheduled" && (
                <span className="text-green-500">{video.status}</span>
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
