export class PhotoTaker {
  private _reader: FileReader;
  private _inputElement: HTMLInputElement;
  private _imageElement: HTMLImageElement;

  constructor(inputElement: HTMLInputElement, imageElement: HTMLImageElement) {
    this._inputElement = inputElement;
    this._imageElement = imageElement;
    this._reader = new FileReader();
  }

  public onLoad(func: (data: string) => void): void {
    this._reader.addEventListener("load", () => this.handleLoad(func), false);
  }

  private handleLoad(func: (data: string) => void) {
    this._imageElement.src = this._reader.result as string;
    func(this._reader.result as string);
  }

  public load() {
    const file = this._inputElement?.files?.[0];

    if (!file) return null;

    this._reader.readAsDataURL(file);
  }
}
