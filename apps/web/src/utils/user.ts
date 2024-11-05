import { NEXT_AUTH } from "@/lib/auth";
import axios from "axios";
import { AuthOptions, getServerSession } from "next-auth";


export const getUserDetails = async () => {
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    return session;
};

type InitPodProps ={
    session:string
}
export const initPod = async ({ session }: InitPodProps) => {
  let res = null;
  try {
    const userId = session.split('/')[0];
    const replid = session.split('/')[1];
    res = await axios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/create`, { replid, userId });
    console.log(res.data);
    return { message: res.data.message, success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 429) { 
          return { message: data.message || "Too many requests. Please try again later.", success: false };
        }
        return { message: data.message || "An error occurred", success: false };
      } else {
        return { message: "Network error or server is not responding", success: false };
      }
    }
    console.log(error);
    return { message: "An unexpected error occurred", success: false };
  }
}
