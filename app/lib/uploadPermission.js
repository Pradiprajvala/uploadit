const { getSession } = require("next-auth/react");

export const isUserOwner = async (projectId) => {
  const formData = new FormData();
  formData.append("projectId", projectId);
  try {
    const session = await getSession();
    console.log("Session", session);
    const res = await fetch("/api/project/retrive", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.status === 200) {
      console.log("Project", data.project);
      return data.project?.ownerId === session.user._id;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
