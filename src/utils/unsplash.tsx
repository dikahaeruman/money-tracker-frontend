import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey:
    process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ??
    't7AFvU0aaKTHS7WGDjjCib-Yh5PA4djb82T85sHFn5A',
});

export const fetchRandomImage = async (query: string = 'nature'): Promise<string> => {
  try {
    const result = await unsplash.photos.getRandom({ query });
    
    if ('response' in result && result.response && 'urls' in result.response) {
      return result.response.urls.regular;
    } else {
      console.error('Unexpected response structure from Unsplash API:', result);
      return 'Unexpected response structure from Unsplash API';
    }
  } catch (error) {
    console.error('Error fetching random image:', error);
    return 'Error fetching random image';
  }
};

export default unsplash;