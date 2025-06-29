import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  type: 'news' | 'recommendation' | 'social';
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  source: string;
  url: string;
  isFavorite: boolean;
}

interface ContentState {
  items: ContentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'loadingMore';
  error: string | null;
  page: number;
  hasMore: boolean;
  searchQuery: string | null;
  searchFilter: string | null;
}

const initialState: ContentState = {
  items: [],
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
  searchQuery: null,
  searchFilter: null,
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent', 
  async ({ page, query = null, filter = 'all' }: { page: number, query?: string | null, filter?: string | null }, { rejectWithValue }) => {
    try {
      let url = `/api/content?page=${page}`;
      if (query) {
        url += `&search=${encodeURIComponent(query)}`;
      }
      if (filter && filter !== 'all') {
        url += `&filter=${filter}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch content');
      }
      const data = await response.json();
      return { data, page, query, filter };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return rejectWithValue(message);
    }
});


const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemInFeed = state.items.find(item => item.id === action.payload);
      if (itemInFeed) {
        itemInFeed.isFavorite = !itemInFeed.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state, action) => {
        const { query = null, filter = 'all', page } = action.meta.arg;
        if (state.searchQuery !== query || state.searchFilter !== filter || page === 1) {
            state.status = 'loading';
            state.searchQuery = query;
            state.searchFilter = filter;
            state.items = [];
            state.page = 1;
        } else {
            state.status = 'loadingMore';
        }
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        // Hydrate isFavorite status from localStorage
        const favsJSON = typeof window !== 'undefined' ? localStorage.getItem('favoriteItems') : '[]';
        const favoriteItems: ContentItem[] = favsJSON ? JSON.parse(favsJSON) : [];
        const favoriteIds = new Set(favoriteItems.map(fav => fav.id));

        const processedData = action.payload.data.map((item: ContentItem) => ({
            ...item,
            isFavorite: favoriteIds.has(item.id),
        }));

        state.status = 'succeeded';
        if (action.payload.page === 1) {
            state.items = processedData;
        } else {
             const newItems = processedData.filter(
                (newItem: ContentItem) => !state.items.some(existingItem => existingItem.id === newItem.id)
            );
            state.items.push(...newItems);
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.data.length > 0;
        state.error = null;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Something went wrong';
      });
  }
});

export const { toggleFavorite } = contentSlice.actions;
export default contentSlice.reducer;
