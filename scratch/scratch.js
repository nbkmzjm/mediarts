$(document).ready(function() {
   $('#my_button').click(function() {
      check(something, function (valid) {
         if (valid) { // do something }
      });
   });

   check = function(param, callback) {
     $.ajax({
        // ajax params
        success: function(data) { 
            if (data){
               return callback(true);
            }
            else {
               return callback(false);
            }
        }
    });
});

}
}