export default function isImage(file) {
  const fileName = file.name || file.path;
  const suffix = fileName.split('.').pop(-1).toLowerCase();
  if (suffix === 'jpg' || suffix === 'jpeg' || suffix === 'bmp' || suffix === 'png') {
    return true;
  }
}
