

$(document).on('pageshow', "#bar", function (event, data) {
    var $j = jQuery.noConflict();
  // alert("hello");
   var x="abc";
   var a=jdata;
   alert(JSON.stringify(jdata.data[1][1]));
       
});

$(document).on('pageshow', "#home", func$(document).on('pageshow', "#home", function (event, data) {
   var $j = jQuery.noConflict();
   
   
   
});


$(document).on('pageshow', "#potholesComplaint", function (event, data) {
	var $j = jQuery.noConflict();
	var canvas = document.getElementById('camImageVisCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 250, 280);
    var imageObj = new Image();
    imageObj.src = "img/uploadImage.png";
	 
	imageObj.onload = function () {
		context.drawImage(imageObj, 0, 0, 250, 200);
    };
	 
	$j(document).off('vclick', '#imageClick').on('vclick', '#imageClick', function () {
		 //alert("clicked");
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
		destinationType: Camera.DestinationType.DATA_URL
	});

	function onSuccess(imageURI) {
	 
    var canvas = document.getElementById('camImageVisCanvas');
		var context = canvas.getContext('2d');
        var imageObj = new Image();
        imageObj.src = "data:image/png;base64," + imageURI;
        imageObj.onload = function () {
			context.drawImage(imageObj, 0, 0, 250, 200);
        };

	}

	function onFail(message) {
		alert('Failed because: ' + message);
	}

	});
	
	
	
	var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);

  db.transaction(function(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS ChicagoComplaints');
    tx.executeSql('CREATE TABLE IF NOT EXISTS ChicagoComplaints (id, Type,address,latitude,longitude,time,imgurl)');
//tx.executeSql("INSERT INTO ChicagoComplaints (id, Type,address,latitude,longitude,time,imgurl) VALUES (?,?)", ["test", 100], function(tx, res) {
    tx.executeSql('INSERT INTO ChicagoComplaints (id, Type,address,latitude,longitude,time,imgurl) VALUES (?,?,?,?,?,?,?)',["'+(Math.random() * 100000000)+'", "1300 Roosevelt","767687","768767687","'+new Date()+'","hghjghgh"], function(tx, results) {
     // alert("insertId: " + results.insertId + " -- probably 1");
      //alert("rowsAffected: " + results.rowsAffected + " -- should be 1");
		
		
		
      tx.executeSql("SELECT * FROM ChicagoComplaints", [], function(tx, results) {
      var len = results.rows.length;
        alert("chicago table: " + len + " rows found.");
        for (var i=0; i<len; i++){
            alert("Row = " + results.rows.item(i).id + " ID = " + results.rows.item(i).address + " Data =  " + results.rows.item(i).time);
        }
      });

    }, function(e) {
      alert("ERROR: " + e.message);
    });
  });
  
   
});


$(document).on('pageshow', "#potholesComplaintList", function (event, data) {
	var $j = jQuery.noConflict();
	$j.mobile.loading('show', {
            text: 'Loading Data',
            textVisible: true,
            //theme:theme,
            html: ""
        });
	var potholesdata;
	//2014-10-13T00:00:00
	//var date_test = new Date("2014-10-13".replace(/T/g,"/"));
	//var date = new Date.parseExact("2014-10-13", "yyyy-mm-dd");
	//alert("date "+date.getDate());
	potholesdata = $j.getJSON( "http://data.cityofchicago.org/resource/7as2-ds3y.json", function(data) {
	debugger;
	//alert("item string "+potholesdata.responseText);
	var obj = JSON.parse(potholesdata.responseText);
	$j.each(obj, function (i, item) {
	//alert(" item" + JSON.stringify(item.street_address));
	//alert("date  "+item.creation_date)
	if(item.status=="Completed")
	{
	list+='<li>'+item.street_address+'<h6><span class="status-complete">'+item.status+'</span></h6></li>';
}
else 
{
	list+='<li>'+item.street_address+'<h6><span class="status-open">'+item.status+'</span></h6></li>';
	}
});
	$j("#listPotholes").append(list).listview("refresh");
	$j.mobile.loading('hide');
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
  
  var list="";
  debugger;
   
  $j.mobile.loading('hide');
	
	});





tion (event, data) {
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
