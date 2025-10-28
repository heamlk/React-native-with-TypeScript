export function capitalize({ value }: { value: string }) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getRandomNumber({ min, max }: { min: number; max: number }) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function scaleToFit({ width, height, targetWidth, targetHeight }: { width: number; height: number; targetWidth: number; targetHeight: number }) {
  const aspectRatio = width / height

  let newWidth = targetWidth
  let newHeight = newWidth / aspectRatio

  if (newHeight > targetHeight) {
    newHeight = targetHeight
    newWidth = newHeight * aspectRatio
  }

  return { width: newWidth, height: newHeight }
}

export function resizeToFitScreen({ imgWidth, imgHeight, screenWidth, screenHeight }: { imgWidth: number; imgHeight: number; screenWidth: number; screenHeight: number }) {
  // First, scale width to match screen
  let newWidth = screenWidth
  let newHeight = imgHeight * (screenWidth / imgWidth)

  // If height exceeds screen, scale based on height instead
  if (newHeight > screenHeight) {
    newHeight = screenHeight
    newWidth = imgWidth * (screenHeight / imgHeight)
  }

  return { width: newWidth, height: newHeight }
}

export default function blank() {}
