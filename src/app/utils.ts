export function getImageBase64(
  imageFile: File,
  callback: (image: string) => void
) {
  const fileReader = new FileReader();
  fileReader.addEventListener('load', (evt) => {
    if (!evt.target?.result) return;
    if (typeof evt.target.result !== 'string') return;

    const image = evt.target.result;
    callback(image);
  });

  fileReader.readAsDataURL(imageFile);
}
