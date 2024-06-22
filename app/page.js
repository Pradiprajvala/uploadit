"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";
import Projects from "./components/Projects/Projects";

export default function Home() {
  const [selctedFile, setSelectedFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    async function signInIfNot() {
      if (status !== "authenticated") {
        await signIn();
      }
    }
    signInIfNot();
  }, [status]);

  const getProjects = async () => {
    try {
      const res = await fetch("/api/project/retrive");
      const projects = await res.json();
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
    } catch (error) {
      console.log(error);
    }
  };

  if (status === "authenticated")
    return (
      <div className="h-screen">
        <header className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
          <Link
            href="#"
            className="flex items-center justify-center"
            prefetch={false}
          >
            <MountainIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semi-bold">StreamLine</h1>
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button> */}
            <Button variant="outline" onClick={() => signOut()}>
              <LogOutIcon className="h-5 w-5 md:mr-2 sm:mr-0" />
              <div className="hidden sm:inline">Logout</div>
            </Button>
          </div>
        </header>
        <Projects />
      </div>
    );

  // router.push("/auth/signin");
  return <></>;
  // return (
  //   <div className="min-h-screen bg-slate-700 text-white flex flex-col items-center justify-center">
  //     <div className="my-2">Welcome {session?.user?.name}</div>
  //     <input
  //       type="file"
  //       accept="video/*"
  //       onChange={(e) => setSelectedFile(e.target.files[0])}
  //     />
  //     <input
  //       type="text"
  //       value={projectName}
  //       onChange={(e) => setProjectName(e.target.value)}
  //     />
  //     <button
  //       className="bg-black px-2 my-2 py-0.5 rounded-lg"
  //       onClick={addProject}
  //     >
  //       Add Project
  //     </button>
  //     <button
  //       className="bg-black px-2 my-2 py-0.5 rounded-lg"
  //       onClick={getProjects}
  //     >
  //       Get Projects
  //     </button>
  //     <button
  //       className="bg-black px-2 my-2 py-0.5 rounded-lg"
  //       onClick={() => upload("uploadToYoutube")}
  //     >
  //       Upload to Youtube
  //     </button>
  //     <button
  //       className="bg-black px-2 my-2 py-0.5 rounded-lg"
  //       onClick={() => upload("uploadToDB")}
  //     >
  //       Upload To Database
  //     </button>
  //     <button
  //       className="bg-black px-2 my-2 py-0.5 rounded-lg"
  //       onClick={() => signOut()}
  //     >
  //       Sign Out
  //     </button>
  //     <Button>Button</Button>
  //   </div>
  // );
}

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
