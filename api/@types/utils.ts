export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Replace<T, K extends keyof T, NT> = Omit<T, K> & Record<K, NT>;
