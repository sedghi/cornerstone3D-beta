import $ from './jquery.js';
import getMinMax from './getMinMax';

/**
 * Special decoder for 8 bit jpeg that leverages the browser's built in JPEG decoder for increased performance
 */

function arrayBufferToString (buffer) {
  return binaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
}

function binaryToString (binary) {
  let error;

  try {
    return decodeURIComponent(escape(binary));
  } catch (_error) {
    error = _error;
    if (error instanceof URIError) {
      return binary;
    }
    throw error;

  }
}

function decodeJPEGBaseline8BitColor (imageFrame, pixelData, canvas) {
  const start = new Date().getTime();
  const deferred = $.Deferred();

  const imgBlob = new Blob([pixelData], { type: 'image/jpeg' });

  const r = new FileReader();

  if (r.readAsBinaryString === undefined) {
    r.readAsArrayBuffer(imgBlob);
  } else {
    r.readAsBinaryString(imgBlob); // doesn't work on IE11
  }

  r.onload = function () {
    const img = new Image();

    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      imageFrame.rows = img.height;
      imageFrame.columns = img.width;
      const context = canvas.getContext('2d');

      context.drawImage(this, 0, 0);
      const imageData = context.getImageData(0, 0, img.width, img.height);
      const end = new Date().getTime();

      imageFrame.pixelData = imageData.data;
      imageFrame.imageData = imageData;
      imageFrame.decodeTimeInMS = end - start;

      // calculate smallest and largest PixelValue
      const minMax = getMinMax(imageFrame.pixelData);

      imageFrame.smallestPixelValue = minMax.min;
      imageFrame.largestPixelValue = minMax.max;

      deferred.resolve(imageFrame);
    };
    img.onerror = function (error) {
      deferred.reject(error);
    };
    if (r.readAsBinaryString === undefined) {
      img.src = `data:image/jpeg;base64,${window.btoa(arrayBufferToString(r.result))}`;
    } else {
      img.src = `data:image/jpeg;base64,${window.btoa(r.result)}`; // doesn't work on IE11
    }

  };

  return deferred.promise();
}

export default decodeJPEGBaseline8BitColor;
