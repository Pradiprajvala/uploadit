"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import ProjectCard from "./ProjectCard";
import Cross from "../Cross";
import Check from "../Check";
import Spinner from "../Spinner";
import Link from "next/link";

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectsData, setProjectsData] = useState([]);
  const [toggleFetch, setToggleFetch] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const loadingSkeletonData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const {
    data: { user },
  } = useSession();

  useEffect(() => {
    if (user._id) fetchProjects(user._id);
  }, [toggleFetch]);

  useEffect(() => {
    if (user._id && projectsData.length === 0) fetchProjects(user._id);
  }, [user]);

  const fetchProjects = async (_id) => {
    const formData = new FormData();
    formData.append("ownerId", _id);
    try {
      const res = await fetch("/api/project/retrive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 200) {
        setProjectsData(data.projects);
      }
      setIsProjectsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewProject = async (projectName, projectDesc, members) => {
    const formData = new FormData();
    formData.append("name", projectName);
    formData.append("description", projectDesc);
    formData.append("ownerId", user._id);
    let memberIdArray = members.map((member) => member._id);
    formData.append("members", memberIdArray);
    if (!user._id) return;
    try {
      const res = await fetch("/api/project/add", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 201) {
        setIsModalOpen(false);
        setToggleFetch(!toggleFetch);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
        <h1 className="text-2xl font-bold md:text-3xl">Your Projects</h1>
        <Button type="submit" onClick={() => setIsModalOpen(true)}>
          Add New
        </Button>
      </header>
      {isProjectsLoading ? (
        <main className="flex flex-col gap-8 p-4 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loadingSkeletonData.map((_, key) => {
              return <ProjectCard key={key} loading={true} />;
            })}
          </div>
        </main>
      ) : (
        <main className="flex flex-col gap-8 p-4 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projectsData.map((project, key) => {
              return (
                <Link key={key} href={`/project/${project._id}`}>
                  <ProjectCard
                    projectTitle={project.name}
                    projectOwnerName={
                      project.ownerId === user._id ? "You" : project.owner.name
                    }
                    videosCount={project.videos.length}
                  />
                </Link>
              );
            })}
            {isModalOpen && (
              <AddNewProjectModal
                isModalOpen={true}
                setIsModalOpen={setIsModalOpen}
                createNewProject={createNewProject}
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}

function AddNewProjectModal({ createNewProject, isModalOpen, setIsModalOpen }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState([{ username: "" }]);

  const onMemberUpdate = ({ index, value, isValid, _id }) => {
    let member = members[index];
    member.username = value;
    member.isValid = isValid;
    member._id = _id;
    const newMembers = [...members];
    newMembers[index] = member;
    setMembers(newMembers);
  };

  const isCredentialsValid = (members, name, desc) => {
    return (
      !members.filter((member) => !member.isValid).length &&
      name !== "" &&
      desc != ""
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Project Name"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description of project"
              className="col-span-3"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          {members.map((member, index) => {
            return (
              <MemberFeild
                key={index}
                index={index}
                onMemberUpdate={onMemberUpdate}
                member={member}
              />
            );
          })}
          <div className="grid items-center grid-cols-4 gap-4 gap-y-0 cursor-pointer font-bold m-2">
            <span
              onClick={() =>
                setMembers([
                  ...members,
                  {
                    username: "",
                    isValid: false,
                  },
                ])
              }
              className="col-span-4 text-right"
            >
              Add Member
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={!isCredentialsValid(members, name, desc)}
            onClick={() => createNewProject(name, desc, members)}
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MemberFeild = ({ onMemberUpdate, member, index }) => {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const handleUpdate = async (value) => {
    try {
      setIsCheckingUsername(true);
      setIsUsernameAvailable(false);
      const formData = new FormData();
      formData.append("username", value);
      const data = await fetch("/api/users/validateUsername", {
        method: "POST",
        body: formData,
      });
      const res = await data.json();
      onMemberUpdate({
        index,
        value,
        isValid: !res.isUsernameAvailable,
        _id: res._id,
      });
      setIsUsernameAvailable(!res.isUsernameAvailable);
      setIsCheckingUsername(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="grid items-center grid-cols-4 gap-4 gap-y-0">
      <Label htmlFor="username" className="text-right">
        Member {index + 1}
      </Label>
      <div className="relative col-span-3">
        <Input
          id="username"
          placeholder="Enter a username"
          onChange={async (e) => {
            onMemberUpdate({ index: index, value: e.target.value });
            handleUpdate(e.target.value);
          }}
        />
        {isCheckingUsername && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Spinner />
          </div>
        )}
        {isUsernameAvailable && !isCheckingUsername && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Check />
          </div>
        )}
        {!isUsernameAvailable &&
          !isCheckingUsername &&
          member.username !== "" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Cross />
            </div>
          )}
      </div>
      <div
        className={`w-full flex ${
          (isUsernameAvailable ||
            isCheckingUsername ||
            member.username === "") &&
          "invisible"
        }
        } text-red-500 font-medium justify-end text-sm col-span-4`}
      >
        Username does not exist.
      </div>
    </div>
  );
};
