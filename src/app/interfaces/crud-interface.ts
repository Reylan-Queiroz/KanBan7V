export interface CrudInterface {
   create(obj: any): any;
   getAll(): any;
   getById(id: number): any;
   update(id: number, obj: any): any;
   delete(id: number): any;
}
