export interface CrudInterface {
   create<T>(obj: any): any;

   getAll<T>(): any;
   getById<T>(id: number): any;

   update<T>(id: number, obj: any): any;

   delete<T>(id: number): any;
}
