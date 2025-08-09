// aim to get public id (flashcards/{name image})
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    //https://res.cloudinary.com/dgoyrdkbx/image/upload/v1754730639/flashcards/s2nwumxag4omu9mcj3ev.jpg
    const urlObj = new URL(url);
    const path = urlObj.pathname; // /dgoyrdkbx/image/upload/v1754730639/flashcards/s2nwumxag4omu9mcj3ev.jpg

    const uploadIndex = path.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let publicIdWithExt = path.substring(uploadIndex + "/upload/".length);
    // publicIdWithExt = "v1754730639/flashcards/s2nwumxag4omu9mcj3ev.jpg"

    const parts = publicIdWithExt.split("/");
    // remove v1754730639
    if (parts[0].startsWith("v")) {
      parts.shift();
    }

    // remove extension part
    const lastPart = parts.pop();
    if (!lastPart) return null;

    const publicIdWithoutExt = lastPart.replace(/\.[^/.]+$/, "");
    parts.push(publicIdWithoutExt);

    return parts.join("/"); // flashcards/s2nwumxag4omu9mcj3ev
  } catch {
    return null;
  }
}
