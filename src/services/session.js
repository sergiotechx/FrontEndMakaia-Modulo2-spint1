export  class Session {

     removeSession() {
          try {
               let uu = localStorage.removeItem("Session");
               return true;
          }
          catch (error) {
               throw error;
          }
     }

     getSession() {
          try {
               let object = localStorage.getItem("Session");
               if (object != undefined) {
                    return (JSON.parse(object));
               }
               else {
                    return false;
               }
          }
          catch (error) {
               throw error;
          }
     }

     createSession(_data) {
          try {
              localStorage.setItem("Session", JSON.stringify(_data));
              return true;
          }
          catch (error) {
               throw error;
          }
     }
}