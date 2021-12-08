
export class Utils {

   public static clearForm(form: any) {
      form.reset();
   }

   public static autoFocus(inputId: string) {
      setTimeout(function () {
         document.getElementById(inputId).focus();
      }, 250);
   }

   public static clickButton(inputId: string) {
      setTimeout(function () {
         document.getElementById(inputId).click();
      }, 250);
   }
}
