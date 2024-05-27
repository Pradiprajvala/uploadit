"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [selctedFile, setSelectedFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const { data: session } = useSession();

  const getProjects = async () => {
    try {
      const res = await fetch("/api/project/retrive");
      const projects = await res.json();
      console.log(projects);
    } catch (error) {
      console.log(error);
    }
  };

  const addProject = async () => {
    const formData = new FormData();
    formData.append("projectName", projectName);
    try {
      const res = await fetch("/api/project/add", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  const upload = async (where) => {
    if (!selctedFile) alert("Select Video First");
    const formData = new FormData();
    formData.append("video", selctedFile);
    try {
      const res = await fetch("/api/video/" + where, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!session || session.error)
    return (
      <div>
        <button onClick={() => signIn("google")}>Sign In With Google</button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-700 text-white flex flex-col items-center justify-center">
      <div className="my-2">Welcome {session?.user?.name}</div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <button
        className="bg-black px-2 my-2 py-0.5 rounded-lg"
        onClick={addProject}
      >
        Add Project
      </button>
      <button
        className="bg-black px-2 my-2 py-0.5 rounded-lg"
        onClick={getProjects}
      >
        Get Projects
      </button>
      <button
        className="bg-black px-2 my-2 py-0.5 rounded-lg"
        onClick={() => upload("uploadToYoutube")}
      >
        Upload to Youtube
      </button>
      <button
        className="bg-black px-2 my-2 py-0.5 rounded-lg"
        onClick={() => upload("uploadToDB")}
      >
        Upload To Database
      </button>
      <button
        className="bg-black px-2 my-2 py-0.5 rounded-lg"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}
