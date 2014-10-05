

$(document).on('pageshow', "#bar", function (event, data) {
    var $j = jQuery.noConflict();
  // alert("hello");
   var x="abc";
   var a=jdata;
   alert(JSON.stringify(jdata.data[1][1]));
       
});

$(document).on('pageshow', "#home", function (event, data) {
    var $j = jQuery.noConflict();
  // alert("hello");
   var x="abc";
   var a=jdata;
   //alert(JSON.stringify(jdata.data.length));
   var  list="";
   
   var jqxhr = $j.getJSON( "https://data.ct.gov/resource/hma6-9xbg.json?category=Fruit&item=Peaches", function(data) {
  //alert( "success" );
  //alert(JSON.stringify(data));
})
  .done(function() {
    //alert( "second success" );
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
    //alert( "complete" );
  });
 
   
   
   for(var i=0;i<jdata.data.length;i++)
   {
	   //alert(jdata.data[i][9]);
	   list+='<li><a href="#bar">'+jdata.data[i][9]+'</a></li>';
	  
	   }
      $j("#listPolice").append(list).listview("refresh");; 
      // $j("#listPolice").trigger("create");
});
