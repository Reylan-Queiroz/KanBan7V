export class Tag {
   constructor() { }

   public tagId: number;
   public tagName: string;
   public tagChecked: boolean;

   public setItem(_tagId: number, _tagName: string, _tagChecked: boolean) {
      this.tagId = _tagId;
      this.tagName = _tagName;
      this.tagChecked = _tagChecked;

      return this;
   }
}
