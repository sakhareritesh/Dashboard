import type { ContentItem } from "../features/content/contentSlice";

// This is a mock API service that simulates fetching social media posts.
const mockSocialPosts: ContentItem[] = [
    {
      id: 'social-1',
      type: 'social',
      title: 'Post from @reactjs',
      description: 'Exploring the new `use` hook in React. How are you using it in your projects? Share your thoughts! #react #hooks',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'react logo',
      source: 'X (formerly Twitter)',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-2',
      type: 'social',
      title: 'Post from @tailwindcss',
      description: 'Just released Tailwind CSS v4.0 with a lightning fast new engine, unified toolchain, and CSS for JS. #css #webdev',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'code editor',
      source: 'X (formerly Twitter)',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-3',
      type: 'social',
      title: 'Photo by @nasa',
      description: 'A stunning new image of the Pillars of Creation from the James Webb Space Telescope. #space #astronomy #jwst',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'galaxy stars',
      source: 'Instagram',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-4',
      type: 'social',
      title: 'Post from @spotify',
      description: 'Check out the new "Lo-fi Beats" playlist, perfect for focusing or just chilling out. #lofi #focus #music',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'headphones music',
      source: 'Community',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-5',
      type: 'social',
      title: 'Photo by @natgeotravel',
      description: 'Sunrise over the ancient temples of Bagan, Myanmar. A truly magical experience. #travel #myanmar #sunrise',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'temples sunrise',
      source: 'Instagram',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-6',
      type: 'social',
      title: 'Post from @nextjs',
      description: 'The Next.js App Router is now stable! Learn about Server Components, Layouts, and more. #nextjs #webdevelopment',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'nextjs logo',
      source: 'X (formerly Twitter)',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-7',
      type: 'social',
      title: 'Design tip by @figma',
      description: 'Use auto-layout to create responsive components that adapt to their content. It will save you hours! #designtips #figma #uiux',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'design abstract',
      source: 'Community',
      url: '#',
      isFavorite: false,
    },
    {
      id: 'social-8',
      type: 'social',
      title: 'Post from @github',
      description: 'GitHub Copilot now has chat functionality directly in your editor. Ask questions, get code suggestions, and more. #ai #coding #github',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'code robot',
      source: 'X (formerly Twitter)',
      url: '#',
      isFavorite: false,
    }
];

export function fetchSocialPosts(page = 1, pageSize = 5): Promise<ContentItem[]> {
    console.log(`Fetching mock social media posts for page ${page}...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        resolve(mockSocialPosts.slice(start, end));
      }, 300); // Simulate network delay
    });
}

export function searchSocialPosts(query: string): Promise<ContentItem[]> {
  console.log(`Searching mock social media posts for "${query}"...`);
  const lowerCaseQuery = query.toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockSocialPosts.filter(
        post => post.title.toLowerCase().includes(lowerCaseQuery) || 
                post.description.toLowerCase().includes(lowerCaseQuery)
      );
      resolve(results);
    }, 200);
  });
}
