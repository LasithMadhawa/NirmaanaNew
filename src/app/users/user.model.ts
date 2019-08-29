import { Artwork } from "../artworks/artwork.model";

export interface User {
  _id: string;
  username: string;
  email: string;
  isDesigner: boolean;
  downloads: Artwork[];
  favourites: Artwork[];
  skills: string;
  description: string;
}
