import prisma from "./prisma";

export const getValidSession = async (email: string | null, sessionId: string | null) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email || "",
                session: {
                    some: {
                        id: sessionId || ""
                    }
                }
            },
        });
        const path=`${user?.id}/${sessionId}`
        console.log("User fetched:", path);
        return path;
    } catch (error) {
        console.log("Error fetching user:", error);
        return null;
    }
};

