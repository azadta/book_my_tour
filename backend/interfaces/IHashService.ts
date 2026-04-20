export interface IHashService {
  hash(data: string): string;
  compare(data: string, encrypted: string): boolean;
}
