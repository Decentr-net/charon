export type MimeType = 'image/png' | 'image/gif' | 'image/jpeg' | 'unknown';

export const getRealMimeType = (file: File): Promise<MimeType> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onloadend = (event) => {
      const array = (new Uint8Array(event.target.result as ArrayBuffer)).subarray(0, 4);

      const header = array.reduce((acc, elem) => acc + elem.toString(16), '');

      resolve(getMimeTypeByHeader(header));
    };

    fileReader.readAsArrayBuffer(file);
  });
};

export const getMimeTypeByHeader = (header: string): MimeType => {
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return 'unknown'; // Or you can use the blob.type as fallback
  }
};
