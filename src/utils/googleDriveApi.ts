import 'server-only';

const GOOGLE_DRIVE_REVALIDATE_SECONDS = 300;

const getGoogleDriveUrl = () => {
  const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!fileId || !apiKey) {
    throw new Error(
      'Missing required env vars: GOOGLE_DRIVE_FILE_ID and GOOGLE_DRIVE_API_KEY',
    );
  }

  const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`);
  url.searchParams.set('alt', 'media');
  url.searchParams.set('key', apiKey);
  return url.toString();
};

export const fetchGoogleDriveData = async () => {
  const response = await fetch(getGoogleDriveUrl(), {
    next: { revalidate: GOOGLE_DRIVE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Google Drive API error: ${response.status}`);
  }

  return response.json();
};
