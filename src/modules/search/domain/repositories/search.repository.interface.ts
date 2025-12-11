export interface SearchRepository {
  indexDocument(index: string, id: string, data: any): Promise<void>;
  search(index: string, query: any): Promise<any>;
  deleteDocument(index: string, id: string): Promise<void>;
}
