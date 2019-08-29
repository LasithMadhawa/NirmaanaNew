import { User } from "../users/user.model";

export interface Artwork {
  _id: string;
  price: number;
  title: string;
  preview: string;
  imagePath: string;
  zipFilePath: string;
  tags: string;
  designer: User[];
}
