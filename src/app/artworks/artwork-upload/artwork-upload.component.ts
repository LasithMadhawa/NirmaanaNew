import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ArtworksService } from "../artworks.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Artwork } from "../artwork.model";
import { Router } from "@angular/router";

import { mimeType } from "./mime-type.validator";
import { zipMimeType } from "./zip-mime-type.validator";

@Component({
  selector: "app-artwork-upload",
  templateUrl: "./artwork-upload.component.html",
  styleUrls: ["./artwork-upload.component.css"]
})
export class ArtworkUploadComponent implements OnInit {
  artwork: Artwork;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;
  zipFileName: string;
  // tags = [{ display: "bla", value: "bla" }];
  private mode = "create";
  private artworkId: string;

  constructor(
    public artworksService: ArtworksService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      preview: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      zipFile: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [zipMimeType]
      }),
      tags: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("artworkId")) {
        console.log("entering to edit");
        this.mode = "edit";
        this.artworkId = paramMap.get("artworkId");
        this.isLoading = true;
        this.artworksService
          .getArtwork(this.artworkId)
          .subscribe(artworkData => {
            this.isLoading = false;
            this.artwork = {
              _id: artworkData._id,
              title: artworkData.title,
              preview: artworkData.preview,
              imagePath: artworkData.imagePath,
              zipFilePath: artworkData.zipFilePath,
              tags: artworkData.tags,
              designer: artworkData.designer,
              price: artworkData.price
            };
            this.form.setValue({
              title: this.artwork.title,
              preview: this.artwork.preview,
              image: this.artwork.imagePath,
              zipFile: this.artwork.zipFilePath,
              tags: this.artwork.tags,
              price: this.artwork.price
            });
            this.imagePreview = this.artwork.imagePath;
            this.zipFileName = this.artwork.zipFilePath;
          });
      } else {
        this.mode = "create";
        this.artworkId = null;
        this.form.setValue({
          title: null,
          preview: null,
          image: null,
          tags: null,
          zipFile: null,
          price: null
        });
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ zipFile: file });
    this.form.get("zipFile").updateValueAndValidity();
    this.zipFileName = file.name;
  }

  onSaveArtwork() {
    if (this.form.invalid) {
      return;
    }
    // console.log(this.form.value);
    this.isLoading = true;
    if (this.mode === "create") {
      this.artworksService.addArtwork(
        this.form.value.title,
        this.form.value.preview,
        this.form.value.image,
        this.form.value.zipFile,
        JSON.stringify(this.form.value.tags).toLowerCase(),
        this.form.value.price
      );
    } else {
      this.artworksService.updateArtwork(
        this.artworkId,
        this.form.value.title,
        this.form.value.preview,
        this.form.value.image,
        this.form.value.zipFile,
        JSON.stringify(this.form.value.tags).toLowerCase(),
        this.form.value.price
      );
    }
    this.form.reset();
    this.router.navigate(["/"]);
  }
}
