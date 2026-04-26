export type EntityBase = {
  id: string;
  user_id: string;
  space_id: string;
  created_at: string;
  updated_at: string;
};

export type AsyncState = 'idle' | 'loading' | 'success' | 'error';

export type ViewState<T> = {
  data: T;
  status: AsyncState;
  error: string | null;
};

export type InsertResult<T> = {
  data: T | null;
  error: string | null;
};
