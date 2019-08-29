import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const zipMimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof control.value === "string") {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = "";
        let isValid = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case "52617221":
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
