export type Usr= {
  id: string;
  name: string;
  email: string;
  image: string;
}

export type userSession={
  name:string;
  email:string;
  image:string;
}

export type Session={
  id: string;
  name: string;
  desc: string;
  createdAt: Date
  usedId: string;
}

export type FileTree = {
  [key: string]: FileTree | null;
};
