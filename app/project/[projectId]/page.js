"use client";
import Spinner from "@/app/components/Spinner";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import AddNewVideoModal from "./components/AddNewVideoModal";
import VideoCard from "./components/VideoCard";

function Project({ params }) {
  const [project, setProject] = useState(null);
  const [projectIsLoading, setProjectIsLoading] = useState(true);
  const [addNewVideoModalIsOpen, setAddNewVideoModalIsOpen] = useState(false);
  const projectId = params.projectId;

  console.log(project);

  useEffect(() => {
    if (project === null) {
      loadProjects();
    }
  }, []);

  async function loadProjects() {
    const formData = new FormData();
    formData.append("projectId", projectId);
    try {
      setProjectIsLoading(true);
      const res = await fetch("/api/project/retrive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 200) {
        setProject(data.project);
      }
      setProjectIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  function handleCreateSuccess(video) {
    let newProject = project;
    newProject.videos.push(video);
    setProject(newProject);
    setAddNewVideoModalIsOpen(false);
  }

  if (projectIsLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const { name, owner, description } = project;
  return (
    <div className="grow">
      <header className="sticky top-0 flex items-center justify-between bg-background px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold md:text-3xl">{name}</h1>
          <div className="text-lg text-muted-foreground">
            {`Owner: ${owner.name}`}
          </div>
          <div className="text-lg text-muted-foreground">
            {`Members: Pradip Vala, Dhiraj Shah, Samay Raina`}
          </div>
        </div>
        <Button type="submit" onClick={() => setAddNewVideoModalIsOpen(true)}>
          Add New
        </Button>
      </header>
      <main>
        {project?.videos.map((video, key) => (
          <div key={key} className="flex flex-col items-stretch my-4">
            <VideoCard video={video} />
          </div>
        ))}
      </main>
      {addNewVideoModalIsOpen && (
        <AddNewVideoModal
          isModalOpen={addNewVideoModalIsOpen}
          setIsModalOpen={setAddNewVideoModalIsOpen}
          handleCreateSuccess={handleCreateSuccess}
          projectId={projectId}
        />
      )}
      {/* <div className="grid grid-cols-4">
        <div>
          <div className="grid items-center grid-cols-5 gap-4">
            <Label
              htmlFor="name"
              className="col-span-2 text-right text-muted-foreground text-md"
            >
              Description:
            </Label>
            <div className="text-lg col-span-3 font-semi-bold">
              {description}
            </div>
          </div>
          <div className="grid items-center grid-cols-5 gap-4">
            <Label
              htmlFor="name"
              className="col-span-2 text-right text-muted-foreground text-md"
            >
              Owner:
            </Label>
            <div className="text-lg col-span-3 font-semi-bold">
              {owner.name}
            </div>
          </div>
        </div>
      </div> */}
      {/* {isProjectsLoading ? (
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
                  <ProjectCard
                    key={key}
                    projectTitle={project.name}
                    projectOwnerName={
                      project.ownerId === user._id ? "You" : project.owner.name
                    }
                    videosCount={project.videos.length}
                    projectId={project._id}
                  />
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
        )} */}
    </div>
  );
}

export default Project;
