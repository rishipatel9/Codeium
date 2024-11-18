import axios from "axios";
import prisma from "./prisma";

export const getValidSession = async (
  email: string | null,
  sessionId: string | null
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email || "",
        session: {
          some: {
            id: sessionId || "",
          },          
        },
      },
      select: {
        id: true,
        session: {
          where: {
            id: sessionId || "",
          },
          select: {
            name: true, // Assuming session has a "name" field
          },
        },
      },
    });
    
    const path = `${user?.id}/${sessionId}`;
    const sessionName = user?.session[0]?.name || "No Session Name";
    
    console.log("User fetched:", { path, sessionName });
    return { path, sessionName };
  } catch (error) {
    console.log("Error fetching user:", error);
    return null;
  }
};

export const getUserSessions = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/getsessions");
    console.log("Session fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return null;
  }
};
