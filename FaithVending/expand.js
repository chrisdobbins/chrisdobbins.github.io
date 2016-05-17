$(document).ready(function(){
  setTimeout(300,toggleExpansion());
});



var toggleExpansion = function() {
  
  $('.toggle').on('click', function() {
       
      $(this).parent().parent().next().slideToggle('slow');
      
      $(this).toggleClass("rotated");
	
  });
};