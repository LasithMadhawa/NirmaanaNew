import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Artwork } from "./artwork.model";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { TagModelClass } from "ngx-chips/core/accessor";
import { User } from "../users/user.model";

@Injectable({ providedIn: "root" })
export class ArtworksService {
  private artworks: Artwork[] = [];
  private artworkUploaded = new Subject<Artwork[]>();

  constructor(private http: HttpClient) {}

  getArtworks() {
    this.http
      .get<{ message: string; artworks: any }>(
        "http://localhost:3000/api/artworks"
      )
      .pipe(
        map(artworkData => {
          return artworkData.artworks.map(artwork => {
            return {
              title: artwork.title,
              preview: artwork.preview,
              _id: artwork._id,
              imagePath: artwork.imagePath,
              zipFilePath: artwork.zipFilePath,
              tags: artwork.tags,
              designer: artwork.designer,
              price: artwork.price
            };
          });
        })
      )
      .subscribe(transformedArtworks => {
        this.artworks = transformedArtworks;
        this.artworkUploaded.next([...this.artworks]);
      });
  }

  getArtworksByDesigner(id: string) {
    return this.http.get<Artwork[]>(
      "http://localhost:3000/api/artworks/searchByDesigner?designer=" + id
    );
  }

  getArtworksByTag(searchTag: string) {
    this.http
      .get<{ message: string; artworks: any }>(
        "http://localhost:3000/api/artworks/searchByTag?searchTag=" + searchTag
      )
      .pipe(
        map(artworkData => {
          return artworkData.artworks.map(artwork => {
            return {
              title: artwork.title,
              preview: artwork.preview,
              _id: artwork._id,
              imagePath: artwork.imagePath,
              zipFilePath: artwork.zipFilePath,
              tags: artwork.tags.value,
              designer: artwork.designer,
              price: artwork.price
            };
          });
        })
      )
      .subscribe(transformedArtworks => {
        this.artworks = transformedArtworks;
        this.artworkUploaded.next([...this.artworks]);
      });
  }

  getArtworkUpdateListener() {
    return this.artworkUploaded.asObservable();
  }

  getArtwork(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      preview: string;
      imagePath: string;
      zipFilePath: string;
      tags: string;
      designer: User[];
      price: number;
    }>("http://localhost:3000/api/artworks/" + id);
  }

  addArtwork(
    title: string,
    preview: string,
    image: File,
    zipFile: File,
    tags: string,
    price: number
  ) {
    const artworkData = new FormData();
    artworkData.append("title", title);
    artworkData.append("preview", preview);
    artworkData.append("image", image);
    artworkData.append("zipFile", zipFile);
    artworkData.append("tags", tags);
    artworkData.append("price", price.toString());
    this.http
      .post<{ message: string; artwork: Artwork }>(
        "http://localhost:3000/api/artworks",
        artworkData
      )
      .subscribe(responseData => {
        const artwork: Artwork = {
          _id: responseData.artwork._id,
          title: title,
          preview: preview,
          imagePath: responseData.artwork.imagePath,
          zipFilePath: responseData.artwork.zipFilePath,
          tags: tags,
          designer: null,
          price: price
        };
        this.artworks.push(artwork);
        this.artworkUploaded.next([...this.artworks]);
      });
  }

  updateArtwork(
    _id: string,
    title: string,
    preview: string,
    image: File | string,
    zipFile: File | string,
    tags: string,
    price: number
  ) {
    let artworkData: Artwork | FormData;
    if (typeof image === "object" || typeof zipFile === "object") {
      artworkData = new FormData();
      artworkData.append("id", _id);
      artworkData.append("title", title);
      artworkData.append("preview", preview);
      artworkData.append("image", image, title);
      artworkData.append("zipFile", zipFile);
      artworkData.append("tags", tags);
      artworkData.append("price", price.toString());
    } else {
      artworkData = {
        _id: _id,
        title: title,
        preview: preview,
        imagePath: image,
        zipFilePath: zipFile,
        tags: tags,
        designer: null,
        price: price
      };
    }
    this.http
      .put("http://localhost:3000/api/artworks/" + _id, artworkData)
      .subscribe(response => {
        const updatedArtworks = [...this.artworks];
        const oldArtworkIndex = updatedArtworks.findIndex(p => p._id === _id);
        const artwork: Artwork = {
          _id: _id,
          title: title,
          preview: preview,
          imagePath: "",
          zipFilePath: "",
          tags: tags,
          designer: null,
          price: price
        };

        updatedArtworks[oldArtworkIndex] = artwork;
        this.artworks = updatedArtworks;
        this.artworkUploaded.next([...this.artworks]);
      });
  }

  deleteArtwork(artworkId: string) {
    this.http
      .delete("http://localhost:3000/api/artworks/" + artworkId)
      .subscribe(() => {
        const updatedArtworks = this.artworks.filter(
          artwork => artwork._id !== artworkId
        );
        this.artworks = updatedArtworks;
        this.artworkUploaded.next([...this.artworks]);
      });
  }
}
