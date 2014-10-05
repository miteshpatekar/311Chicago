var store;
var qwayId;
var TotalEarnedPoints = 0;
var TotalEvaluatedPoints = 0;
var quesobj;

var surveyId;

var hisStoreVisitId;
var actionVisit; // to track visit btn clciked

var responseQwayId; // current survey response inDraft for qway
var surveyVisitInDraftId;  // current survey response inDraft Store Visit 

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. From http://pastebin.com/23PLrQ1Q via 
// http://www.modelmetrics.com/tomgersic/using-xmlhttprequest2-in-ios-5-to-download-binary-files-using-html5phonegap/
function base64ArrayBuffer(arrayBuffer) {
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63;               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
}

//pagebeforeshow event called before the pageby id- #storedetails loads
$(document).on('pageshow', "#storedetails", function (event, data) {

    var $j = jQuery.noConflict();
    var contype = checkInternetConnectivity();
    var storeId = window.localStorage.getItem("StoreId");
    // $.blockUI({ css: { backgroundColor: '#f00', color: '#fff' } });


    $j.each(stores, function (i, item) {
        if (item.Id == storeId) {
            store = item;
        }
    });

    //$j('body').css('display', 'none');
    //$j('body').fadeIn(1000);

    // $j('#storeDetailsContent').simplesplitview();
    // $j("#rightTabs").scroll();

    //$j('#rightTabs').slimScroll({
    //    height: '400px',
    //});

    $j("#storehead").html('Store ' + store.Name);
    $j("#storeid").html('<h3> Store ' + store.Name + '</h3>');
    $j("#storeaddress").html(store.BillingStreet + ', ' + store.BillingCity + ' ' + store.BillingState + ' ' + store.BillingPostalCode + ' ' + store.BillingCountryCode);

    $j("#store").html('<strong>Store: </strong>' + store.Name);
    $j("#storename").html('<strong>Store Name: </strong>' + store.Store_Name__c);
    $j("#bussinessstatus").html('<strong>Bussiness Status: </strong>' + store.Business_Status__c);
    $j("#statusreason").html('<strong>Status Reason: </strong>' + store.Status_Reason__c);
    $j("#sitetype").html('<strong>Site Type: </strong>' + store.Site_Type__c);
    $j("#leaseexp").html('<strong>Lease Exp.: </strong>' + store.Lease_Expiration_Date__c);

    $j("#managingowner").html('<strong>Managing Owner: </strong>' + store.Managing_Owner__c);
    $j("#ownertype").html('<strong>Owner Type: </strong>' + store.Owner_Type__c);
    $j("#region").html('<strong>Region: </strong>' + store.Reporting_Region__c);
    $j("#distributioncenter").html('<strong>Distribution Center: </strong>' + store.Distribution_Center__c);

    //Field Operations Team
    if (contype == 'No network connection') {
        console.log("OFFLINE " + JSON.stringify(store));
        $j("#fbcname").html('<strong>FBC: </strong>' + store.FBC_Name__r);
        $j("#rdoname").html('<strong>RDO: </strong>' + store.RDO_Name__r);
        $j("#rvpname").html('<strong>RVP: </strong>' + store.RVP_Name__r);
    }
    else {
        if (store.FBC_Name__r != null) {
            $j("#fbcname").html('<strong>FBC: </strong>' + store.FBC_Name__r.Name);
        }
        else {
            $j("#fbcname").html('<strong>FBC: </strong>');
        }
        if (store.RDO_Name__r != null) {
            $j("#rdoname").html('<strong>RDO: </strong>' + store.RDO_Name__r.Name);
        }
        else {
            $j("#rdoname").html('<strong>RDO: </strong>');
        }
        if (store.RVP_Name__r != null) {
            $j("#rvpname").html('<strong>RVP: </strong>' + store.RVP_Name__r.Name);
        }
        else {
            $j("#rvpname").html('<strong>RVP: </strong>');
        }
    }
    $j("#fbcemail").html(' ' + store.FBC_Email__c);
    $j("#rdoemail").html(' ' + store.RDO_Email__c);
    $j("#rvpemail").html(' ' + store.RVP_Email__c);


    //Store Contact Information
    $j("#bussinessphone").html('<strong>Business Phone: </strong>' + store.Business_Phone_2__c);
    $j("#storeaddress1").html('<strong>Store Address: </strong>' + '<div>' + store.BillingStreet + ', ' + store.BillingCity + ' ' + store.BillingState + ' ' + store.BillingPostalCode + ' ' + store.BillingCountry + '</div>');
    $j("#county").html('<strong>County: </strong>' + store.County__c);

    //Hours of operation
    $j("#mondayopen").html('<strong>Monday: </strong> Open: ' + store.Monday_Open__c);
    $j("#tuesdayopen").html('<strong>Tuesday: </strong> Open: ' + store.Tuesday_Open__c);
    $j("#wednesdayopen").html('<strong>Wednesday: </strong> Open: ' + store.Wednesday_Open__c);
    $j("#thursdayopen").html('<strong>Thursday: </strong> Open: ' + store.Thursday_Open__c);
    $j("#fridayopen").html('<strong>Friday: </strong> Open: ' + store.Friday_Open__c);
    $j("#saturdayopen").html('<strong>Saturday: </strong> Open: ' + store.Saturday_Open__c);
    $j("#sundayopen").html('<strong>Sunday: </strong>' + store.Sunday_Open__c);

    $j("#mondayclose").html('Close: ' + store.Monday_Close__c);
    $j("#tuesdayclose").html('Close: ' + store.Tuesday_Close__c);
    $j("#wednesdayclose").html('Close: ' + store.Wednesday_Close__c);
    $j("#thursdayclose").html('Close: ' + store.Thursday_Close__c);
    $j("#fridayclose").html('Close: ' + store.Friday_Close__c);
    $j("#saturdayclose").html('Close: ' + store.Saturday_Close__c);
    $j("#sundayclose").html(store.Sunday_Close__c);



    //######## SALES  ##############
    ShowSalesData();

    function ShowSalesData() {
        var data = [];
        //$j.mobile.loading('show', {
        //    text: 'Loading Sales Data',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});
        var storeId = window.localStorage.getItem("StoreId");
        forcetkClient.query("SELECT First_Day_of_Week__c, CY_IVR_Net_3__c FROM Weekly_Sales_Data__c ws, ws.Store__r s WHERE \
                         s.Id='" + store.Id + "' ORDER BY First_Day_of_Week__c DESC NULLS LAST LIMIT 4 ", onsuccessweeklysales, onError);
        function onsuccessweeklysales(response) {
            console.log(JSON.stringify(response));

            if (response.totalSize != 0) {
                $j.each(response.records, function (i, item) {
                    //console.log(JSON.stringify(response.records));
                    data.push([item.First_Day_of_Week__c, item.CY_IVR_Net_3__c]);
                });
                console.log(JSON.stringify(data));
                //console.log(JSON.stringify(data));
                $j.jqplot('barChartstoredetails', [data],
                {
                    title: 'Weekly Sales',
                    axes: {
                        xaxis:
                            {
                                renderer: $j.jqplot.DateAxisRenderer,
                                //tickRenderer: $j.jqplot.CanvasAxisTickRenderer,
                                tickOptions: {
                                    formatString: '%b %#d',
                                    //  angle: -30
                                },
                                tickInterval: '2 weeks'
                            }
                    },
                    series: [{ lineWidth: 4, markerOptions: { style: 'square' } }]
                }
                          ).replot({ clear: true, resetAxes: true });
                //  $j("#barChartstoredetails").toggle(false);
            }
            else {
                $j("#barChartstoredetails").html("No Sales data found!!");
            }
            // $j.mobile.loading('hide');  // stop loading sales
            $j("#barChartstoredetails").toggle(false);
            $j("#salesHead").toggle(false);
        }
    }
    if (contype == 'No network connection') {
        $j("#barChartstoredetails").toggle(false);
        $j("#salesHead").toggle(false);
    }

    function onError(response) {
        console.log("On error called.." + JSON.stringify(response));
        if (response.status == 404) {
            //alert("Your internet connection is very slow");
        }
        else {
            alert("Error : " + JSON.stringify(response)
                );
        }
        //  $j.mobile.loading('hide');
        $j.unblockUI();
        console.log(JSON.stringify(response));
        // $j.mobile.loading('hide');
    }


    /*******    QWAY History table     *********/
    ShowQwayHistoryTable();
    function ShowQwayHistoryTable() {
        //$j.mobile.loading('show', {
        //    text: 'Loading Qway Data',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});
        var SurResponses;
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            db.transaction(queryDB, errorCB);
            function queryDB(tx) {
                tx.executeSql('SELECT * FROM SurveyResponses where SurveyType="QWAY" and Store__c="' + store.Id + '"', [], querySuccess1, errorCB);
            }

            function querySuccess1(tx, results) {
                var len = results.rows.length;
                SurResponses = results.rows.resultSet;
                console.log("### " + JSON.stringify(results.rows.resultSet));

                displayQwayTable();
            }
        }
        else {
            forcetkClient.query("SELECT Score__c,Name,User__r.Name,Survey_Status__c,Id,Survey_End_Datetime__c FROM Survey_Response__c s, s.Store__r a\
                            where s.Survey__r.Survey_Type__c='Qway' and s.Survey__r.Status__c='Active'\
                            and a.Id='" + store.Id + "'", onsuccesstablehistory, onError);
        }
        function onsuccesstablehistory(response) {
            SurResponses = response.records;
            displayQwayTable();
        }

        function displayQwayTable() {
            console.log("respnsecc  " + JSON.stringify(SurResponses));
            var isdraft = false;
            var list = '';
            var cntAlt = 0;
            var contype = checkInternetConnectivity();
            $j.each(SurResponses, function (i, item) {
                console.log("&&&&&&&&&&& SurveyResponse:" + JSON.stringify(item));
                var endDate;
                var uid = 0;
                if (item.Survey_End_Datetime__c != null)
                    endDate = item.Survey_End_Datetime__c.split("T")[0];
                else
                    endDate = null;

                var uName;
                if (item.User__r != null) {
                    uName = item.User__r.Name;
                }
                else {
                    if (contype == 'No network connection') {
                        uid = item.UserId;

                    }
                }
                if (cntAlt % 2 == 0) {
                    list += '<tr id="' + item.Id + '"class="trforeachresponse">\
                        <td id="datefor' + item.Id + '">' + endDate + '</td>\
                        <td>' + item.Score__c + '%</td>\
                        <td>' + item.Survey_Status__c + '</td>\
                        <td id="'+ uid + '_' + item.Id + '">' + uName + '</td>\
                     </tr>';
                }
                else {
                    list += '<tr id="' + item.Id + '"class="lightPink trforeachresponse">\
                        <td id="datefor' + item.Id + '">' + endDate + '</td>\
                        <td>' + item.Score__c + '%</td>\
                        <td>' + item.Survey_Status__c + '</td>\
                        <td id="'+ uid + '_' + item.Id + '">' + uName + '</td>\
                     </tr>';
                }
                if (item.Survey_Status__c == "In Draft") {
                    responseQwayId = item.Id;
                    isdraft = true;
                }
                cntAlt = cntAlt + 1;
            });
            if (isdraft == true) {
                $j("#startqway").attr("disabled", "disabled");
                $j("#resumeqway").removeAttr("disabled");
                $j("#deleteqway").removeAttr("disabled");
                $j("#submitqway").removeAttr("disabled");
            }
            else {
                $j("#startqway").removeAttr("disabled");
                $j("#resumeqway").attr("disabled", "disabled");
                $j("#deleteqway").attr("disabled", "disabled");
                $j("#submitqway").attr("disabled", "disabled");
            }


            $j("#tbodyforqway").append(list);

            if (contype == 'No network connection') {

                db.transaction(queryDBForUserName, errorCB);
                function queryDBForUserName(tx) {
                    $j.each(SurResponses, function (i, item) {
                        tx.executeSql('SELECT * FROM Users where Id="' + item.UserId + '"', [], querySuccess2, errorCB);
                        function querySuccess2(tx, results) {
                            var len = results.rows.length;
                            UserResponses = results.rows.resultSet;
                            console.log("### User" + JSON.stringify(results));
                            uName = results.rows.resultSet[0].Name;
                            $j("#" + results.rows.resultSet[0].Id + "_" + item.Id).html(uName);
                        }
                    });
                }
                $j("#submitqway").attr("disabled", "disabled");
                // $j("#deleteqway").attr("disabled", "disabled");
            }
            //  $j.mobile.loading('hide'); // stop loading qway history
            $j.unblockUI();
        }

    }
    //click on any row of history table to get categorywise scores
    $j(document).off('click', '.trforeachresponse').on('click', '.trforeachresponse', function () {
        $j(this).siblings().removeClass('activ');
        $j(this).addClass("activ");
        var rowid = $j(this).attr("id");
        window.localStorage.setItem("QwayRowId", rowid);
        $j.mobile.changePage('DetailedView.html', { transition: "slideup" });
    });

    $j(document).off('vclick', '#startqway').on('vclick', '#startqway', function () {
        actionVisit = "start";
        $j.mobile.changePage('Qway.html', { transition: "slideup" });
    });

    $j(document).off('vclick', '#resumeqway').on('vclick', '#resumeqway', function () {
        actionVisit = "resume";
        $j.mobile.changePage('Qway.html', { transition: "slideup" });
    });

    $j(document).off('vclick', '#submitqway').on('vclick', '#submitqway', function () {
        //$j.mobile.loading('show', {
        //    text: 'Submitting Qway',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});
        TotalEarnedPoints = 0;
        TotalEvaluatedPoints = 0;
        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Submitting Qway</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });

        quesobj = [];
        var distinctQuestionGrps = [];
        var incompleteQuesIds = [];
        var incompleteSurveyFlag = null;
        forcetkClient.query("SELECT Question_Group__c,Question_ID__c,Id,Name,Scoring_Points__c,Use_Criteria__c,Display_Type__c,\
                            (SELECT Criteria_Text__c,Id, Criteria_Options__c FROM Survey_Question_Criterias__r)\
                            FROM Survey_Question__c\
                            q, q.Survey_ID__r s where s.Survey_Type__c='QWAY' and s.Status__c='Active'", onsuccessallquesforsurvey, onError);

        function onsuccessallquesforsurvey(response) {
            quesobj = [];
            console.log("onsuccessallquesforsurvey called..response : "+ JSON.stringify(response));
            $j.each(response.records, function (i, item) {
                //console.log("item" + JSON.stringify(item));
                var criteriaCount = 0;
                if (item.Use_Criteria__c == true) {
                    criteriaCount += item.Survey_Question_Criterias__r.totalSize;
                }
                else {
                    criteriaCount++;
                }
                //console.log("CriteriaCount" + criteriaCount);
                quesobj.push({
                    "quesid": item.Id,
                    "quesDisplayId": item.Question_ID__c,
                    "EarnedPoints": "0",
                    "EvaluatedPoints": "0",
                    "ScoringPoints": item.Scoring_Points__c,
                    "isCriteria": item.Use_Criteria__c,
                    "DisplayType": item.Display_Type__c,
                    "Options": "",
                    "Group": item.Question_Group__c,
                    "CriteriaCount": criteriaCount,
                    "AnswerCount": "0"
                });

            });

            checkVariablequestlength();
            function checkVariablequestlength() {
                if (quesobj.length != response.totalSize) {
                    //console.log("imageattachment" + imageAttachment.length);
                    window.setTimeout(checkVariablequestlength, 100);
                }
                else {
                    getSurveyAnswersAfterQuestion();
                }
            }
            
            checkVariableflag();
            //var cnt = 0;
            function checkVariableflag() {
                if (incompleteSurveyFlag == null) {
                    console.log("%%%%%% incompleteSurveyFlag" + incompleteSurveyFlag);
                    //console.log("imageattachment" + imageAttachment.length);
                    window.setTimeout(checkVariableflag, 100);
                    //cnt++;
                    //if (cnt > 50) {
                    //    incompleteSurveyFlag = false;
                    //    console.log("incompleteSurveyFlag = false; set");
                    //    window.setTimeout(CalculateScoresAndUpdateDb, 5000);
                    //}
                }
                else {
                    console.log("%%%%%% &&&&&&&& incompleteSurveyFlag" + incompleteSurveyFlag);
                    window.setTimeout(CalculateScoresAndUpdateDb, 5000);
                }
            }
            //console.log("quesobj :   " + JSON.stringify(quesobj));                              
            //$j.when(getSurveyAnswersAfterQuestion()).done(function () {
            //    setTimeout(CalculateScoresAndUpdateDb, 10000);
            //});
        }

        function getSurveyAnswersAfterQuestion() {
            console.log("getSurveyAnswersAfterQuestion called");
            $j.each(quesobj, function (i, q) {
                forcetkClient.query("SELECT q.Question_Text__c,Id FROM Survey_Answer__c a, a.Survey_Question__r q, a.Survey_Response__r r, a.Survey_Question_Criteria__r c \
                    where Survey_Response__c='" + responseQwayId + "' and r.IsDeleted=false and a.Survey_Question__c='" + q.quesid + "'", onSuccessCalculateAnsCountForOneQues, onError);
                function onSuccessCalculateAnsCountForOneQues(response) {
                    q.AnswerCount = response.totalSize;
                    //console.log("@@@@@@@@@@@ ques obj   " + JSON.stringify(quesobj));

                    if (q.AnswerCount < q.CriteriaCount)
                    {
                        //console.log("&&&&&&&&& q.display id" + q.quesDisplayId);
                        //console.log("          qitem " + JSON.stringify(q));
                        if ($j.inArray(q.Group, distinctQuestionGrps) == -1) {
                            distinctQuestionGrps.push(q.Group);
                            incompleteQuesIds.push({ "Group": q.Group, "Ids": [] });
                            //console.log("incomplete grps" + JSON.stringify(incompleteQuesIds));
                            $j.each(incompleteQuesIds, function (i, item) {
                                //console.log("item.group " + item.Group + "  q.group " + q.Group);
                                if (item.Group == q.Group) {
                                    item.Ids.push(" " + q.quesDisplayId);
                                    //console.log(" pushed q.display id" + q.quesDisplayId);
                                }
                            });
                        }
                        else
                        {
                            $j.each(incompleteQuesIds, function (i, item) {
                                //console.log("item.group " + item.Group + "  q.group " + q.Group);
                                if (item.Group == q.Group) {
                                    item.Ids.push(" " + q.quesDisplayId);
                                    //console.log(" pushed q.display id" + q.quesDisplayId);
                                }
                            });
                            //console.log("incomplete ids" + JSON.stringify(incompleteQuesIds));
                        }
                        incompleteSurveyFlag = true;
                        console.log("incompleteSurveyFlag = true; set")
                    }
                    console.log("i " + i);
                    console.log("ques obj length " + quesobj.length);
                    console.log("incompleteSurveyFlag " + incompleteSurveyFlag);
                    if (i+1 >= quesobj.length-1 && incompleteSurveyFlag!=true)
                    {
                        console.log("incompleteSurveyFlag = false;");
                        incompleteSurveyFlag = false;
                    }
                }                
            });            
        }
        function CalculateScoresAndUpdateDb() {
            console.log("CalculateScoresAndUpdateDb called");
            if (incompleteSurveyFlag == false) {
                console.log("@@@@@@@ incompleteSurveyFlag : false;");
                $j.each(quesobj, function (i, q) {
                    naflag = false;
                    naCnt = 0;
                    noflag = false;
                    fields = {};

                    forcetkClient.query("SELECT c.Criteria_Options__c ,q.Question_Options__c, q.Scoring_Points__c, Criteria__c,Id,IsDeleted, \
                    Name,Question__c,Response__c,Survey_Question_Criteria__c,Survey_Question__c,Survey_Response__c,Type_of_Data__c \
                    FROM Survey_Answer__c a, a.Survey_Question__r q, a.Survey_Response__r r, a.Survey_Question_Criteria__r c \
                    where Survey_Response__c='" + responseQwayId + "' and r.IsDeleted=false and a.Survey_Question__c='" + q.quesid + "'", onsuccessansforoneques, onError);
                    function onsuccessansforoneques(response) {
                        if (q.isCriteria == true) {
                            if (q.DisplayType == "Radio Button") {
                                noflag = false;
                                naCnt = 0;
                                $j.each(response.records, function (i, item) {
                                    opt = item.Survey_Question_Criteria__r.Criteria_Options__c;
                                    //console.log("opt " + JSON.stringify(opt));
                                    q.Options = opt.split("\n");

                                    //console.log("q.Options: " + JSON.stringify(q.Options));
                                    if (item.Response__c == "NO") {
                                        noflag = true;
                                        //console.log("No flag set!!");
                                    }
                                    if (item.Response__c == 'N/A') {
                                        naCnt++;
                                    }
                                    //console.log("id: " + q.quesid + "value:" + item.Response__c);
                                });
                                //console.log("noflag:" + noflag + "naCnt:" + naCnt);
                                if (noflag == true) {
                                    q.EarnedPoints = 0;
                                    q.EvaluatedPoints = q.ScoringPoints;
                                    TotalEvaluatedPoints += q.ScoringPoints;
                                }
                                else if (naCnt == response.records.length || response.records.length == 0) {
                                    q.EarnedPoints = 0;
                                    q.EvaluatedPoints = 0;
                                }
                                else {
                                    q.EarnedPoints = q.ScoringPoints;
                                    q.EvaluatedPoints = q.ScoringPoints;
                                    TotalEarnedPoints += q.ScoringPoints;
                                    TotalEvaluatedPoints += q.ScoringPoints;
                                }
                            }
                            else if (q.DisplayType == "Number Input") {
                                noflag = false;
                                naCnt = 0;
                                $j.each(response.records, function (j, c) {
                                    opt = c.Survey_Question_Criteria__r.Criteria_Options__c;
                                    console.log("opt " + JSON.stringify(opt));
                                    q.Options = opt.split("\n");
                                    console.log("q.Options: " + JSON.stringify(q.Options));

                                    textsforques = c.Response__c;
                                    console.log("input value entered: " + textsforques);
                                    if (textsforques != null || textsforques != "") {
                                        console.log("Number Input with criteria");
                                        if (textsforques == 'N/A') {
                                            console.log("naCnt++ for N/A");
                                            naCnt++;
                                        }
                                        else if (q.Options[0] >= textsforques || textsforques >= q.Options[1]) {
                                            noflag = true;
                                        }
                                    }
                                    else {
                                        naCnt++;
                                    }
                                });
                                //console.log("noFlag:" + noflag);
                                //console.log("naCnt" + naCnt);
                                //console.log("response.records.length" + response.records.length);
                                if (noflag == true) {
                                    console.log("No flag set");
                                    q.EarnedPoints = 0;
                                    q.EvaluatedPoints = q.ScoringPoints;
                                    TotalEvaluatedPoints += q.ScoringPoints;

                                }
                                else if (naCnt == response.records.length || response.records.length == 0) {
                                    //console.log("naCnt " + naCnt);
                                    //console.log("response.records.length" + response.records.length);
                                    q.EarnedPoints = 0;
                                    q.EvaluatedPoints = 0;
                                }
                                else {
                                    q.EarnedPoints = q.ScoringPoints;
                                    q.EvaluatedPoints = q.ScoringPoints;
                                    TotalEarnedPoints += q.ScoringPoints;
                                    TotalEvaluatedPoints += q.ScoringPoints;
                                }
                            }
                        }

                        else {
                            opt = response.records[0].Survey_Question__r.Question_Options__c;
                            q.Options = opt.split("\n");
                            textsforques = response.records[0].Response__c;
                            if (textsforques != null || textsforques != "") {
                                //console.log("qoptions0: " + q.Qoptions[0]);
                                //console.log("qoptions1: " + q.Qoptions[1]);
                                //console.log("textsforques: " + textsforques);
                                //console.log("Number input without criteria");
                                if (q.Options[0] >= textsforques || textsforques >= q.Options[1]) {
                                    console.log("No flag set!!");
                                    q.EarnedPoints = 0;
                                    q.EvaluatedPoints = q.ScoringPoints;
                                    TotalEvaluatedPoints += q.ScoringPoints;
                                }
                                else {
                                    q.EarnedPoints = q.ScoringPoints;
                                    q.EvaluatedPoints = q.ScoringPoints;
                                    TotalEarnedPoints += q.ScoringPoints;
                                    TotalEvaluatedPoints += q.ScoringPoints;
                                }
                            }
                            else {
                                q.EarnedPoints = 0;
                                q.EvaluatedPoints = 0;
                            }
                        }
                        console.log("Each ques  " + JSON.stringify(q));
                        fields = {};
                        fields.Earned_Points__c = q.EarnedPoints;
                        fields.Points_Evaluated__c = q.EvaluatedPoints;
                        fields.Survey_Question_ID__c = q.quesid;
                        fields.Survey_Response_ID__c = responseQwayId;

                        console.log(JSON.stringify(fields) + " for creating score");
                        forcetkClient.create("Survey_Score__c", fields, function (response) { q.SurveyScoreId = response.id }, onError);

                        console.log("******TotalEarnedPoints: " + TotalEarnedPoints);
                        console.log("******TotalEvaluatedPoints: " + TotalEvaluatedPoints);
                    }
                });

                //console.log("quesobj  " + JSON.stringify(quesobj));

               
                // saving geo location

                getGeolocation();
                setTimeout(submitQway, 5000);
                function submitQway() {
                    if (geoLocation != null) {
                        if (geoLocation == "NoGPS") {
                            alert("Please enable 'Use wireless networks' option in 'Location and Security' settings");
                        }
                        else {
                            fields = {};
                            fields.Survey_Status__c = "Submitted";
                            fields.Survey_End_Datetime__c = new Date();
                            fields.Survey_End_Geolocation__latitude__s = geoLocation.latitude;
                            fields.Survey_End_Geolocation__longitude__s = geoLocation.longitude;
                            console.log("****** fields " + JSON.stringify(fields));
                            forcetkClient.upsert("Survey_Response__c", "Id", responseQwayId, fields, function (response) {
                                console.log("Response status has been modified to Submitted!!");
                                alert("Response updated..")
                                $j("#startqway").removeAttr("disabled");
                                $j("#resumeqway").attr("disabled", "disabled");
                                $j("#deleteqway").attr("disabled", "disabled");
                                $j("#submitqway").attr("disabled", "disabled");
                            },onError);
                            $j("#tbodyforqway").empty();
                            ShowQwayHistoryTable();
                            // $j.mobile.loading('hide'); // stop loading for qway submit
                            $j.unblockUI();
                            alert("QWay submitted successfully");

                            // Free local space
                            db.transaction(deleteDB2, errorCB, successdeleteDB2);
                            function deleteDB2(tx) {
                                tx.executeSql('Delete from SurveyAnswers where Survey_Response__c = "' + responseQwayId + '"');
                            }
                            function successdeleteDB2() {
                                console.log("@@@ ## successfully deleted");
                            }
                        }
                    }
                    else {
                        window.setTimeout(submitQway, 1000);
                    }
                }
            }
            else {
                console.log("@@@@@@@ incompleteSurveyFlag : true;");
                // $j.mobile.loading('hide'); // stop loading qway history
                $j.unblockUI();
                var str = "";
                console.log("********* incompltee  " + JSON.stringify(incompleteQuesIds));
                $j.each(incompleteQuesIds, function (i, item) {
                    str += "\n" + item.Group + ": " + item.Ids + "\n";
                });
                alert("Please answer the following questions before submitting survey:" + str);
            }
        }
    });

    $j(document).off('vclick', '#deleteqway').on('vclick', '#deleteqway', function () {
        var contype = checkInternetConnectivity();
        if (confirm('Are you sure you want to delete survey in draft?')) {
            $j.blockUI({
                message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Deleting Q-Way Survey In Draft</h4>',
                css: {
                    color: '#78604F', border: 'none',
                    '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                }
            });
            if (contype == 'No network connection') {
                // delete locally
                if (responseQwayId.indexOf("QWAY") != -1) {
                    db.transaction(deleteDB, errorCB, successdeleteDB);
                }
                else {
                    alert("Sorry! this survey is Synced with the Server...You have to delete it in online mode");
                    $j.unblockUI();
                }
            }
            else {
                forcetkClient.del("Survey_Response__c", responseQwayId, callbackdeleteqway, onError);
                // delete locally
                db.transaction(deleteDB, errorCB, successdeleteDB);
            }

            function deleteDB(tx) {
                tx.executeSql('Delete from SurveyResponses where Id = "' + responseQwayId + '"');
                tx.executeSql('Delete from SurveyAnswers where Survey_Response__c = "' + responseQwayId + '"');

                if (contype == 'No network connection') {
                    $j("#tbodyforqway").empty();
                    ShowQwayHistoryTable();
                }
            }
            function successdeleteDB() {
                console.log("@@@ ## successfully deleted");
            }
        }
        else {
        }

        function callbackdeleteqway(response) {
            $j("#tbodyforqway").empty();
            ShowQwayHistoryTable();
        }

    });

    //................ Store Visit History..........


    ShowVisitHistoryTable();
    function ShowVisitHistoryTable() {
        //$j.mobile.loading('show', {
        //    text: 'Loading Store Visit History',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});


        var SurResponsesSV;
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {

            db.transaction(queryDB, errorCB);

            function queryDB(tx) {
                tx.executeSql('SELECT * FROM SurveyResponses where SurveyType="Store Visit" and Store__c="' + store.Id + '"', [], querySuccess1, errorCB);
            }

            function querySuccess1(tx, results) {
                var len = results.rows.length;
                SurResponsesSV = results.rows.resultSet;

                displayStoreVisitTable();

                var res = [];
                $j.each(results.rows.resultSet, function (i, item) {
                    res.push("'" + item.Id + "'");
                });

                db.transaction(queryDBForAnswers, errorCB);
                function queryDBForAnswers(tx) {
                    if (res.length != 0) {
                        tx.executeSql('SELECT * FROM SurveyAnswers where Question__c="Overall Summary" and Survey_Response__c IN \
                             ('+ res + ')', [], querySuccessAnswers, errorCB);
                    }
                }
                function querySuccessAnswers(tx, results) {
                    $j.each(results.rows.resultSet, function (i, item) {
                        $j("#summary_" + item.Survey_Response__c).html(item.Response__c);
                    });
                }
                //$j.unblockUI();
            }
        }
        else {

            forcetkClient.query("SELECT Id,Name,Store__c,CreatedDate,Survey_End_Datetime__c,Survey_Status__c,Survey_Type__c,Survey__c FROM Survey_Response__c\
                            s, s.Store__r a where s.Survey__r.Survey_Type__c='Store Visit' and s.Survey__r.Status__c='Active'\
                            and a.Id='" + store.Id + "'", onsuccessGetVisitHistory, onError);
        }

        function onsuccessGetVisitHistory(response) {
            SurResponsesSV = response.records;
            displayStoreVisitTable();
            var res = [];
            $j.each(response.records, function (i, item) {
                res.push("'" + item.Id + "'");
            });
            if (res.length != 0)
                forcetkClient.query("SELECT Id,Question__c,Response__c,Comment__c,Survey_Question__c,Type_of_Data__c,Survey_Response__c \
                            FROM Survey_Answer__c where Question__c='Overall Summary' and Survey_Response__c IN \
                             ("+ res + ")", onsuccessSummary, onError);

            function onsuccessSummary(response) {
                $j.each(response.records, function (i, item) {
                    $j("#summary_" + item.Survey_Response__c).html(item.Response__c);
                });
            }



        }

        function displayStoreVisitTable() {
            var list = '';
            var isDraft = false;
            var cntAlt = 0;

            $j.each(SurResponsesSV, function (i, item) {
                var endDate;

                if (item.Survey_End_Datetime__c != null)
                    endDate = item.Survey_End_Datetime__c.split("T")[0];
                else
                    endDate = null;

                if (cntAlt % 2 == 0) {
                    list += '<tr id=' + item.Id + ' class="trVisitResponse"><td class="col-md-3 col-sm-3">' + endDate + '</td>\
                        <td class="col-md-4 col-sm-4" id="summary_'+ item.Id + '"></td>\
                        <td class="col-md-4 col-sm-4">' + item.Survey_Status__c + '</td></tr>';
                }
                else {
                    list += '<tr id=' + item.Id + ' class="lightPink trVisitResponse"><td class="col-md-3 col-sm-3">' + endDate + '</td>\
                        <td class="col-md-4 col-sm-4" id="summary_' + item.Id + '"></td>\
                        <td class="col-md-4 col-sm-4">' + item.Survey_Status__c + '</td></tr>';
                }
                if (item.Survey_Status__c == "In Draft") {
                    surveyVisitInDraftId = item.Id;
                    isDraft = true;
                }
                cntAlt = cntAlt + 1;
            });

            $j("#tbodyVisithistory").append(list);

            if (isDraft == true) {
                $j("#startVisitBtn").attr("disabled", "disabled");
                $j("#resumeVisitBtn").removeAttr("disabled");
                $j("#deleteVisitBtn").removeAttr("disabled");
                $j("#submitVisitBtn").removeAttr("disabled");
            }
            else {
                $j("#startVisitBtn").removeAttr("disabled");
                $j("#resumeVisitBtn").attr("disabled", "disabled");
                $j("#deleteVisitBtn").attr("disabled", "disabled");
                $j("#submitVisitBtn").attr("disabled", "disabled");
            }

            if (contype == 'No network connection') {
                $j("#submitVisitBtn").attr("disabled", "disabled");
                // $j("#deleteVisitBtn").attr("disabled", "disabled");
            }
            // $j.mobile.loading('hide');
            $j.unblockUI();
        }
    }

    $j(document).off('vclick', '#startVisitBtn').on('vclick', '#startVisitBtn', function () {
        actionVisit = "start";
        $j.mobile.changePage('SiteVisitForStore.html', { transition: "slideup" });
    });

    $j(document).off('vclick', '#resumeVisitBtn').on('vclick', '#resumeVisitBtn', function () {
        actionVisit = "resume";
        $j.mobile.changePage('SiteVisitForStore.html', { transition: "slideup" });
    });

    $j(document).off('vclick', '#submitVisitBtn').on('vclick', '#submitVisitBtn', function () {
        //$j.mobile.loading('show', {
        //    text: 'Submitting Survey',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});
        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Submitting Store Visit Survey</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });

        getGeolocation();

        forcetkClient.query("Select Question_Text__c,Question_Options__c,Question_ID__c,Use_Criteria__c,Question_Group__c,\
                    Is_Required__c, Id,Survey_ID__c,Display_Type__c, RecordTypeId From Survey_Question__c\
                    q, q.Survey_ID__r s where s.Survey_Type__c='Store Visit' and s.Status__c='Active' and Is_Required__c=true", onsuccessGetVisitSubmit, onError);

        function onsuccessGetVisitSubmit(response) {
            console.log(JSON.stringify(response));
            var requiredQuesCount = response.totalSize;
            //console.log("response for ques:" + JSON.stringify(response.Question_ID__c));

            var quests = [];
            $j.each(response.records, function (i, item) {
                quests.push("'" + item.Id + "'");
            });
            console.log("quests" + quests);
            console.log("quests" + JSON.stringify(quests));

            if (quests.length)
                forcetkClient.query("SELECT Id,Question__c,Response__c,Comment__c,Survey_Question__c,Type_of_Data__c,Survey_Response__c \
                            FROM Survey_Answer__c where Survey_Response__c='" + surveyVisitInDraftId + "' and Survey_Question__c IN \
                             ("+ quests + ")", onsuccessSubmitVisitSurvey, onError);


            function onsuccessSubmitVisitSurvey(response) {
                console.log("$$$$$ response answers" + JSON.stringify(response));
                if (response.totalSize < requiredQuesCount) {
                    alert("Sorry..! Some questions are remaining " + response.totalSize + "- " + requiredQuesCount);
                    //  $j.mobile.loading('hide');
                    $j.unblockUI();
                }
                else {
                    var fields = {};
                    fields.Survey_Status__c = "Submitted";
                    fields.Survey_End_Datetime__c = new Date();


                    getGeolocation();
                    submitStoreVisit();
                    function submitStoreVisit() {
                        if (geoLocation != null) {
                            if (geoLocation == "NoGPS") {
                                alert("Please enable 'Use wireless networks' option in 'Location and Security' settings");
                            }
                            else {
                                fields.Survey_End_Geolocation__latitude__s = geoLocation.latitude;
                                fields.Survey_End_Geolocation__longitude__s = geoLocation.longitude;
                                forcetkClient.upsert("Survey_Response__c", "Id", surveyVisitInDraftId, fields, onsuccessSubmitted, onError);
                            }
                        }
                        else {
                            window.setTimeout(submitStoreVisit, 100);
                        }
                    }

                }

                function onsuccessSubmitted(response) {
                    alert("Survey Submitted successfully");

                    // empty local answer space
                    db.transaction(deleteDB1, errorCB, successdeleteDB1);
                    function deleteDB1(tx) {
                        tx.executeSql('Delete from SurveyAnswers where Survey_Response__c = "' + surveyVisitInDraftId + '"');
                    }
                    function successdeleteDB1() {
                        console.log("@@@ ## successfully deleted");
                    }

                    $j("#tbodyVisithistory").empty();
                    ShowVisitHistoryTable();
                    if (response != null) {
                        console.log("Survey submitted..");
                    }
                    // $j.mobile.loading('hide');
                    $j.unblockUI();
                }
            }
        }
    });

    $j(document).off('vclick', '#deleteVisitBtn').on('vclick', '#deleteVisitBtn', function () {

        if (confirm('Are you sure you want to delete survey in draft?')) {
            $j.blockUI({
                message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Deleting Store Visit Survey In Draft</h4>',
                css: {
                    color: '#78604F', border: 'none',
                    '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                }
            });
            if (contype == 'No network connection') {
                // delete locally
                if (surveyVisitInDraftId.indexOf("Store Visit") != -1) {
                    db.transaction(deleteDB, errorCB, successdeleteDB);
                }
                else {
                    alert("Sorry! this survey is Synced with the Server...You have to delete it in online mode");
                    $j.unblockUI();
                }
            }
            else {
                forcetkClient.del("Survey_Response__c", surveyVisitInDraftId, callbackDeleteStoreVisit, onError);
                // delete locally        
                db.transaction(deleteDB, errorCB, successdeleteDB);
            }

            function deleteDB(tx) {
                //  tx.executeSql('Delete from SurveyResponses where Store__c = "' + store.Id + '" and  SurveyType="Store Visit" and Survey_Status__c="In Draft"');
                tx.executeSql('Delete from SurveyResponses where Id = "' + surveyVisitInDraftId + '"');
                tx.executeSql('Delete from SurveyAnswers where Survey_Response__c = "' + surveyVisitInDraftId + '"');

                if (contype == 'No network connection') {
                    $j("#tbodyVisithistory").empty();
                    ShowVisitHistoryTable();
                }
            }
            function successdeleteDB() {
                console.log("@@@ ## successfully deleted");
            }
        }
        else {
            // when cancel is clicked
        }

        function callbackDeleteStoreVisit(response) {
            $j("#tbodyVisithistory").empty();
            ShowVisitHistoryTable();
        }
    });


    // For OFFLINe connection disable buttons
    if (contype == 'No network connection') {
        $j("#historySales").append("<h5>Sales not available in offline mode</h5>");
        $j("#startBtnPL").attr("disabled", "disabled");
        $j("#historyPL").append("<h5>P&L not available in offline mode</h5>");
        $j("#startmi").attr("disabled", "disabled");
        $j("#historyMI").append("<h5>Market Intelligence and Store Milestones not available in offline mode</h5>");
        $j("#startTask").attr("disabled", "disabled");
        $j("#historyTask").append("<h5>Task not available in offline mode</h5>");
    }


    //.........P&L History table

    forcetkClient.query(" SELECT Id,Name,P_L_Quarter__c,P_L_Status__c,P_L_Year__c FROM P_L__c P, P.Store__r a  where a.Id='" + store.Id + "'", onsuccesstablehistoryforpl, onError);
    function onsuccesstablehistoryforpl(response) {
        var list = '';
        var cntAlt = 0;
        $j.each(response.records, function (i, item) {
            if (cntAlt % 2 == 0) {
                list += '<tr class="plrow" id="' + item.Id + '"><td class="col-md-2 col-sm-3" >' + item.Name + '</td>\
                        <td class="col-md-2 col-sm-2">' + item.P_L_Quarter__c + '</td>\
                           <td class="col-md-2 col-sm-2">'+ item.P_L_Year__c + '</td>\
                            <td class="col-md-2 col-sm-3">' + item.P_L_Status__c + '</td>\
                    </tr>';
            }
            else {
                list += '<tr class="lightPink plrow" id="' + item.Id + '"><td class="col-md-2 col-sm-3" >' + item.Name + '</td>\
                        <td class="col-md-2 col-sm-2">' + item.P_L_Quarter__c + '</td>\
                           <td class="col-md-2 col-sm-2">'+ item.P_L_Year__c + '</td>\
                            <td class="col-md-2 col-sm-3">' + item.P_L_Status__c + '</td>\
                    </tr>';
            }
            cntAlt = cntAlt + 1;
        });
        $j("#tbodyforhistoryonpl").append(list);
    }
    $j(document).off('click', '.plrow').on('click', '.plrow', function () {
        $j(this).siblings().removeClass('activ');
        $j(this).addClass("activ");
        var rowid = $j(this).attr("id");
        console.log("select id is" + rowid);
        window.localStorage.setItem("PLRowId", rowid);
        $j.mobile.changePage('PL.html', { transition: "slideup" });
    });

    $j("#startBtnPL").click(function () {
        window.localStorage.setItem("PLRowId", null);
        $j.mobile.changePage('PL.html', { transition: "slideup" });
    });


    //............................. Market Intelligence.............................
    forcetkClient.query(" SELECT Description__c,Name,Store_ID__c FROM Store_Milestone__c m, m.Store_ID__r s where s.Id='" + store.Id + "'", onsuccesstablemyrecords, onError);
    function onsuccesstablemyrecords(response) {
        var list = '';
        var cntAlt = 0;
        $j.each(response.records, function (i, item) {
            if (cntAlt % 2 == 0) {
                list += '<tr><td class="col-md-6 col-sm-6">' + item.Description__c + '</td>\
                    </tr>';
            } else {
                list += '<tr class="lightPink"><td class="col-md-6 col-sm-6">' + item.Description__c + '</td>\
                    </tr>';
            }
            cntAlt = cntAlt + 1;
        });
        $j("#tbodyformi").append(list);
    }

    $j("#startmi").click(function () {
        actionVisit = "start";
        $j.mobile.changePage('MarketIntelligence.html', { transition: "slideup" });
    });

    //............................. TASK............................
    $j("#startTask").click(function () {
        actionVisit = "start";
        $j.mobile.changePage('Task.html', { transition: "slideup" });
    });

    var listOfTasks = [];
    $j("#TaskHistoryHeader").html('Open Tasks for Store : ' + store.Name);
    forcetkClient.query("SELECT AccountId,ActivityDate,CreatedById,CreatedDate,Description,Id,IsDeleted,\
        OwnerId,Priority,ReminderDateTime,Status,Subject,Type,WhatId,WhoId FROM Task where IsClosed= false and AccountId='"+ store.Id + "' ", onsuccesstableTask, onError);
    function onsuccesstableTask(response) {
        var list = '';
        var cntAlt = 0;
        listOfTasks = response.records;
        $j.each(response.records, function (i, item) {

            if (cntAlt % 2 == 0) {
                list += '<tr class="trVisitResponse"><td class="col-md-3 col-sm-3">' + item.Subject + '</td>\
                        <td class="col-md-3 col-sm-3">'+ item.ActivityDate + '</td>\
                        <td class="col-md-3 col-sm-3">' + item.Priority + '</td>\
                        <td class="col-md-3 col-sm-3" id="assignto_'+ item.Id + '"></td>\
                        <td class="col-md-3 col-sm-3" id= "source_'+ item.Id + '"></td></tr>';
            }
            else {
                list += '<tr class="lightPink trVisitResponse"><td class="col-md-3 col-sm-3">' + item.Subject + '</td>\
                        <td class="col-md-3 col-sm-3">'+ item.ActivityDate + '</td>\
                        <td class="col-md-3 col-sm-3">' + item.Priority + '</td>\
                        <td class="col-md-3 col-sm-3" id="assignto_' + item.Id + '"></td>\
                        <td class="col-md-3 col-sm-3" id= "source_' + item.Id + '"></td></tr>';
            }
            cntAlt = cntAlt + 1;
        });
        $j("#tbodyForTask").append(list);
        if (response.totalSize == 0)
            $j.mobile.loading('hide');
        fillAssignToAndSourceForOpenTasks();
    }

    function fillAssignToAndSourceForOpenTasks() {
        $j.each(listOfTasks, function (i, item) {
            forcetkClient.query("SELECT Survey__r.Survey_Type__c FROM Survey_Response__c where Id='" + item.WhatId + "'", onsuccesssourceid, onError);
            function onsuccesssourceid(response) {
                if (response.records[0] != null)
                    $j("#source_" + item.Id).html(response.records[0].Survey__r.Survey_Type__c);
                else
                    $j("#source_" + item.Id).html("P & L");
            }
            forcetkClient.query("SELECT FirstName, Name FROM User where Id='" + item.OwnerId + "'", onsuccesssownerid, onError);
            function onsuccesssownerid(response) {
                if (response.records[0] != null)
                    $j("#assignto_" + item.Id).html(response.records[0].FirstName);
                $j.mobile.loading('hide');
            }
        });

    }


    // click events
    $j(".storeDetailsLi").click(function () {
        console.log("store li clicked");
        $j(".imgStoreDetailsLi").each(function () {
            // console.log("inside" + $j(this).attr("src"));
            var src = $j(this).attr("src");
            if (src != null)
                var newsrc = src.replace("active", "normal");
            $j(this).attr("src", newsrc);
        });

        var src = $j(this).find("img").attr("src");
        var newsrc = src.replace("normal", "active");
        $j(this).find("img").attr("src", newsrc);

    });

    $j(document).off("vclick", "#allstores").on("vclick", "#allstores", function () {
        $j.mobile.changePage('Stores.html', { transition: "none" });
        //console.log("Current location:" + $j.mobile.path.getLocation());

    });

    $j(document).off("vclick", "#link_logout").on("vclick", "#link_logout", function () {
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            alert("Sorry!..Can't logout in offline mode");
        }
        else {
            if (confirm('Are you sure you want to Log Out?')) {
                logToConsole("link_logout clicked");
                var sfOAuthPlugin = cordova.require("salesforce/plugin/oauth");
                sfOAuthPlugin.logout();
            }
            else { }
        }
    });

    $j(document).off("vclick", "#allopentasks").on("vclick", "#allopentasks", function () {
        $j.mobile.changePage('AllOpenTasks.html', { transition: "none" });
    });

});

$(document).on('pagebeforeshow', '#storedetails', function (event, data) {
    var $j = jQuery.noConflict();
    $j.blockUI({
        message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Store Details</h4>',
        css: {
            color: '#78604F', border: 'none',
            '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
        }
    });
    //$j('body').css('display', 'none');
    //$j('body').fadeIn(4000);
    $j(document).off('vclick', '#salesnav').on('vclick', '#salesnav', function () {
        // $j("#salesnav").click(function () {      
        $j("#barChartstoredetails").toggle(true);
        $j("#salesHead").toggle(true);
    });

    $j(document).off('vclick', '.othersNav').on('vclick', '.othersNav', function () {
        // $j(".othersNav").click(function () {
        $j(this).parent().parent().find("a").css("color", "#FFFFFF");
        $j(this).css("color", "#6F5748");

        if ($j(this).attr("id") != "salesnav") {
            $j("#barChartstoredetails").toggle(false);
            $j("#salesHead").toggle(false);
        }

    });

    $j("#StoreDetailsBackBtn").click(function () {
        $j.mobile.changePage('Stores.html', { transition: "slideup" });
    });


});

$(document).on('pagebeforeshow', "#qway", function (event, data) {
    var $j = jQuery.noConflict();
    //$j('body').css('display', 'none');
    //$j('body').fadeIn(4000);
    $j.blockUI({
        message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Question groups</h4>',
        css: {
            color: '#78604F', border: 'none',
            '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
        }
    });
});

$(document).on('pageshow', "#qway", function (event, data) {
    var current_tab;
    var currentQuestionGrp;
    var sel_ques;
    var sel_criteria;
    var sel_quesqId;
    var sel_quesText;
    var sel_criteriaText;

    quesobj = [];
    var QuestGroupList;
    var distinctQList = [];

    var QuestionsForGrpList;

    var $j = jQuery.noConflict();

    var viewport = {
        width: $j(window).width(),
        height: $j(window).height()
    };
    //$j('#qwayQuestDiv').slimScroll({
    //    height: '300px',
    //});

    var contype = checkInternetConnectivity();

    console.log("$$$ Width is " + JSON.stringify(viewport));

    loadQwayQuestions();

    function QwayStart() {

        // check internet con
        var contype = checkInternetConnectivity();

        if (contype == 'No network connection') {
            // create response locally
            db.transaction(createResponse, errorCB, successcreateResponse);

            function createResponse(tx) {
                var sid = "QWAY_" + store.Id;
                responseQwayId = sid;
                tx.executeSql('INSERT INTO SurveyResponses (Id,Store__c,SurveyType,Score__c,Name,Survey_Start_Datetime__c,Survey_End_Datetime__c,Survey_Status__c,StartGeoLatitude,StartGeoLongitude)\                            VALUES ("' + responseQwayId + '","' + store.Id + '","QWAY",\                            "' + null + '","' + null + '","' + new Date() + '","' + null + '","In Draft","' + geoLocation.latitude + '","' + geoLocation.longitude + '")');
            }
            function successcreateResponse() {
                console.log("@@@ ## successfully created response");
            }
        }
        else {
            forcetkClient.query("SELECT Id FROM Survey__c where Survey_Type__c='QWAY' and Status__c='Active'", onsuccessSurveyId, onError);
        }

        function onsuccessSurveyId(response) {
            //alert("onsuccessSurveyId called..");
            surveyId = response.records[0].Id;
            var fields = {};

            fields.Survey_Start_Geolocation__latitude__s = geoLocation.latitude;
            fields.Survey_Start_Geolocation__longitude__s = geoLocation.longitude;

            fields.Store__c = store.Id;
            console.log(JSON.stringify("surveyId" + surveyId));
            fields.Survey__c = surveyId;
            fields.Survey_Status__c = "In Draft";
            fields.Survey_Start_Datetime__c = new Date();
            //fields.Survey_End_Datetime__c = new Date();
            fields.User__c = userId;

            forcetkClient.create("Survey_Response__c", fields, callbackcreateresponseqway, onError);

            function callbackcreateresponseqway(response) {
                console.log("@@@ ## successfully created response in salesforce");
                responseQwayId = response.id;
                // create response locally
                db.transaction(createResponse1, errorCB, successcreateResponse1);

                function createResponse1(tx) {
                    console.log("@@@ inserting " + responseQwayId);
                    tx.executeSql('INSERT INTO SurveyResponses (Id,Store__c,SurveyType,Score__c,Name,Survey_End_Datetime__c,Survey_Status__c)\                            VALUES ("' + responseQwayId + '","' + store.Id + '","QWAY",\                            "' + null + '","' + null + '","' + null + '","In Draft")');
                }

                function successcreateResponse1() {
                    console.log("@@@ ## successfully created response");

                }
            }
        }

    }

    var ResumeAnsObj;
    var imageAttachment = [];

    function QwayResume() {
        console.log("responseQwayId" + responseQwayId);
        //$j.mobile.loading('show', {
        //    text: 'Resuming Qway',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});
        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Resuming Q-Way</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });
        console.log("survey response id " + responseQwayId);

        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            db.transaction(queryDB, errorCB);

            function queryDB(tx) {
                tx.executeSql("SELECT Comment__c,Criteria__c,Id,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c\
            FROM SurveyAnswers where Survey_Response__c='" + responseQwayId + "' and Question_Group__c='" + currentQuestionGrp + "'", [], querySuccess1, errorCB);
            }

            function querySuccess1(tx, results) {
                console.log("### results answers" + JSON.stringify(results))
                var len = results.rows.length;
                ResumeAnsObj = results.rows.resultSet;
                resumeAnswers();
            }
        } else {
            forcetkClient.query("SELECT Comment__c,Criteria__c,Id,Question__c,Response__c,Survey_Question_Criteria__c,Survey_Question__c,Survey_Response__c,Type_of_Data__c\
            FROM Survey_Answer__c a, a.Survey_Question__r q where Survey_Response__c='" + responseQwayId + "' and q.Question_Group__c='" + currentQuestionGrp + "'", callbackanswers, onError);
        }


        function callbackanswers(response) {
            ResumeAnsObj = response.records;
            $j.each(ResumeAnsObj, function (i, item) {
                forcetkClient.query("Select Id, ParentId From Attachment where ParentId='" + item.Id + "'", onSuccessParentId, OnError);
                function onSuccessParentId(response) {
                    // console.log("response attachment id and parent" + JSON.stringify(response));
                    $j.each(response.records, function (i, aitem) {
                        //forcetkClient.retrieveBlobField("Attachment", "00Pc0000000n7hLEAQ", "Body",
                        forcetkClient.retrieveBlobField("Attachment", aitem.Id, "Body", insertImageAttachment, OnError);

                        function insertImageAttachment(response) {
                            console.log("attachment response from retrieve blob field:" + JSON.stringify(response));
                            var base64data = base64ArrayBuffer(response);
                            //$j('#imageid').attr('src', "data:image/png;base64," + base64data);
                            //if (imageAttachment == null) {
                            imageAttachment.push({ "QuesId": item.Survey_Question__c, "ParentId": aitem.ParentId, "CriteriaId": item.Survey_Question_Criteria__c, "ImageData": "data:image/png;base64," + base64data });
                            //}
                            console.log("ImageAttachment" + JSON.stringify(imageAttachment));

                        }
                    });
                }
                function OnError(response) {
                    alert("Error occurred..");
                    //alert(JSON.stringify(response));

                }
            });
            resumeAnswers();
        }

        function resumeAnswers() {
            var parId = [];
            console.log("Resume ans obj " + JSON.stringify(ResumeAnsObj));
            $j.each(ResumeAnsObj, function (i, item) {


                parId.push("'" + item.Id + "'");


                //console.log("### criteraia" + item.Criteria__c);
                if (item.Type_of_Data__c == "Radio Button") {
                    //console.log("answer item: " + JSON.stringify(item));
                    //var id = item.Response__c.split(" ")[0] + "_" + item.Survey_Question__c;
                    //console.log(id);
                    //$j("input[id='" + id + "']").attr("checked", "checked");
                    //$j("input[id='" + id + "']").checkboxradio().checkboxradio("refresh");

                    if (item.Response__c != null) {
                        var id = item.Response__c.split(" ")[0] + "_" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c;
                    }
                    var qid = item.Survey_Question__c;
                    //   console.log("id: " + id);
                    $j("input[id='" + id + "']").attr("checked", "checked");
                    //$j('input[name="' + qid + '"][value="' + id + '"]').attr('checked', 'checked');
                    //$j("input[id='" + id + "']").checkboxradio().checkboxradio("refresh");
                    $j("input[type='radio']").checkboxradio().checkboxradio("refresh");
                }
                else if (item.Type_of_Data__c == "Number Input") {
                    //  console.log("answer item: " + JSON.stringify(item));
                    var id = "Text_" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c;
                    // console.log("id: " + id);
                    if (item.Response__c == "N/A") {
                        $j("input[id='checkbox_" + item.Survey_Question__c + "']").attr("checked", "checked");
                        $j("input[id='checkbox_" + item.Survey_Question__c + "']").checkboxradio().checkboxradio("refresh");
                    }
                    else {
                        $j("input[id='" + id + "']").val(item.Response__c);
                    }
                }


                if (contype == 'No network connection') {
                    if (item.Comment__c != "") {
                        console.log("OFFLINEEEEE inside not NUUUULLLLL" + JSON.stringify(item));
                        $j("#" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c).data("commentObj", { comment: item.Comment__c });
                        $j("#" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c).find(".toaddicon").append("<img  style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                    }
                }
                else {
                    if (item.Comment__c != null) {
                        console.log("inside not NUUUULLLLL");
                        $j("#" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c).data("commentObj", { comment: item.Comment__c });
                        $j("#" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c).find(".toaddicon").append("<img  style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                    }
                    checkVariable();
                    function checkVariable() {
                        if (imageAttachment.length == 0) {
                            //console.log("imageattachment" + imageAttachment.length);
                            window.setTimeout(checkVariable, 100);
                        }
                        else {
                            checkForCameraIcons();
                        }
                    }
                    function checkForCameraIcons() {
                        $j.each(imageAttachment, function (i, aitem) {
                            if (aitem.CriteriaId == item.Survey_Question_Criteria__c) {
                                $j("#" + item.Survey_Question__c + "_" + item.Survey_Question_Criteria__c).find(".toaddicon").append("<img style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                            }
                        });
                    }
                }
            });
            $j.unblockUI();
            // $j.mobile.loading('hide');
        }
    }

    function getDistinct(st, b) {
        var n = st.length;
        var count = 0;
        for (var c = 0; c < n; c++) {
            for (var d = 0; d < count; d++) {
                if (st[c].Question_Group__c == b[d].Question_Group__c)
                    break;
            }
            if (d == count) {
                b.push(st[c]);
                //b[count] = a[c];
                count++;
            }
        }
        return b;
    }

    var questGroupDistinctList;

    function loadQwayQuestions() {
        //Query to get the list of question groups

        //$j.mobile.loading('show', {
        //    text: 'Loading Question groups',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});

        // var qwaySid = window.localStorage.getItem("QwaySurveyIdKey");
        var qwaySid = QwayActiveId;
        console.log("qway sid " + qwaySid);

        if (actionVisit == "start") {
            getGeolocation();
            var cnt = 0;
            checkGeoVariable();
            function checkGeoVariable() {
                console.log("geoLocation  " + JSON.stringify(geoLocation));
                console.log("checkGeoVariable called");
                if (geoLocation != null) {
                    if (geoLocation == "NoGPS") {
                        alert("Please enable 'Use wireless networks' option in 'Location and Security' settings");
                        $j.mobile.back();
                    }
                    else {
                        QwayStart();
                    }
                }
                else {
                    cnt++;
                    if (cnt < 30)
                        window.setTimeout(checkGeoVariable, 100);
                    else {
                        alert("Problem fetching Geolocation.. ");
                        $j.mobile.back();
                    }
                }
            }
        }
        //  $j("#QwayQuestHeader").html('<strong class="navbar-brand">Q-Way for Store '+store.Name+'</strong>');
        $j("#QwayQuestHeader").html('Q-Way for ' + store.Name + '');

        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            db.transaction(queryDB, errorCB);


            function queryDB(tx) {
                tx1 = tx;
                tx.executeSql("SELECT distinct Question_Group__c FROM SurveyQuestions where Survey_ID__c='" + qwaySid + "'", [], querySuccess1, errorCB);
            }

            function querySuccess1(tx, results) {
                var len = results.rows.length;
                questGroupDistinctList = results.rows.resultSet;
                console.log("offline questions " + results.rows.resultSet);
                displayQuestGroups();
            }
        }
        else {
            forcetkClient.query("SELECT Question_Group__c FROM Survey_Question__c sq,sq.Survey_ID__r s \
                            where s.Status__c='Active' AND s.Survey_Type__c='QWAY'", onSuccessList, onError);
        }

        function onSuccessList(response) {
            QuestGroupList = response.records;
            questGroupDistinctList = getDistinct(QuestGroupList, distinctQList);
            displayQuestGroups()
        }

        function displayQuestGroups() {
            var list = '';
            var listknob = '';
            $j("#questGrp").append('<ul id="qglist" class="nav nav-tabs nav-pills nav-stacked"></ul>');
            $j("#ulforknobs").append('<ul id="knoblist" class="nav nav-tabs nav-pills nav-stacked"></ul>');
            var cnt = 0;

            // $j.mobile.loading('hide');  // stop loading question groups
            $j.unblockUI();

            $j.each(questGroupDistinctList, function (i, item) {

                if (cnt == 0) {

                    //$j.mobile.loading('show', {
                    //    text: 'Loading Questions',
                    //    textVisible: true,
                    //    //theme:theme,
                    //    html: ""
                    //});
                    $j.blockUI({
                        message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Questions</h4>',
                        css: {
                            color: '#78604F', border: 'none',
                            '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                        }
                    });

                    current_tab = "quest" + cnt;
                    currentQuestionGrp = item.Question_Group__c;
                    list += '<li class="active storeDetailsLi"><a href="#' + item.Question_Group__c + '" name="' + item.Question_Group__c + '" rel="' + item.Question_Group__c + '" class="questgrplist" style="border-radius:0px; border:none;margin-right:0px;padding-right:0px">\
                            <h4>' + item.Question_Group__c + '</h4>\
                              </a></li>';
                    listknob += '<li class="active storeDetailsLi"><a href="#' + item.Question_Group__c + '" rel="' + item.Question_Group__c + '" class="questgrplist" style="border-radius:0px; border:none;margin-right:0px;padding-right:0px">\
                             <div class="text-center" style="padding-bottom:10px;padding-right:5px"><canvas id="knob_' + cnt + '" width="45" bheight="" group="' + item.Question_Group__c + '" categoryWiseCnt="" categoryWiseAnsCnt="" height="45"></div>\
                                </a></li>';


                    $j("#questtab").append('<div id="quest' + cnt + '"><h4 class="text-center" style="color: #D00000">' + item.Question_Group__c + '</h4></div>');

                    //check internet connection
                    //  var contype = checkInternetConnectivity();
                    if (contype == 'No network connection') {
                        db.transaction(queryDB, errorCB);

                        function queryDB(tx) {
                            tx.executeSql("SELECT Id,Display_Type__c,Evaluation_Criteria__c,IsDeleted,Is_Required__c,Name,Option_Values__c,\
                                    Question_Category__c,Question_Group__c,Question_ID__c,Question_Options__c,Question_Order__c,Question_Text__c,Scoring_Points__c,\
                                     Survey_ID__c,Use_Criteria__c FROM SurveyQuestions where Question_Group__c='" + item.Question_Group__c + "' ORDER BY Question_ID__c", [], querySuccess1, errorCB);
                        }

                        function querySuccess1(tx, results) {
                            var len = results.rows.length;
                            QuestionsForGrpList = results.rows.resultSet;
                            displayQuestionsforGrps();
                        }

                    } else { // internet con
                        var str = "Select Question_Text__c,Question_Options__c,Question_ID__c,Use_Criteria__c,\
                         Question_Group__c, Is_Required__c, Id,Scoring_Points__c,Display_Type__c, (SELECT Criteria_Text__c,Id,Criteria_Options__c FROM Survey_Question_Criterias__r)\
                         From Survey_Question__c q, q.Survey_ID__r s where s.Survey_Type__c='qway' and s.Status__c='Active'and Question_Group__c='" + item.Question_Group__c + "' order by Question_ID__c";
                        //console.log(str);
                        forcetkClient.query(str, ShowQuestionsOnSuccess, onError);
                    }

                }
                else { //if cnt > 0
                    $j("#questtab").append('<div id="quest' + cnt + '" class="hidden"><h4 class="text-center" style="color: #D00000">' + item.Question_Group__c + '</h4></div>');

                    list += '<li class="storeDetailsLi"><a href="#' + item.Question_Group__c + '" name="' + item.Question_Group__c + '" rel="' + item.Question_Group__c + '" class="questgrplist" style="color:#FFFFFF;border-radius:0px; border:none;margin-right:0px;padding-right:0px">\
                             <h4>' + item.Question_Group__c + '</h4>\
                                </a></li>';
                    listknob += '<li class="storeDetailsLi"><a href="#' + item.Question_Group__c + '" rel="' + item.Question_Group__c + '" class="questgrplist" style="color:#FFFFFF;border-radius:0px; border:none;margin-right:0px;padding-right:0px">\
                             <div class="text-center" style="padding-bottom:5px"><canvas id="knob_' + cnt + '" width="45" bheight="" group="' + item.Question_Group__c + '" categoryWiseCnt="" categoryWiseAnsCnt="" style=" background-color:#4F3C30" height="45"></div>\
                                </a></li>';
                }
                cnt = cnt + 1;
            });

            $j("#qglist").append(list);
            $j("#knoblist").append(listknob);
            //console.log($j("#questGrp").html());
            //console.log($j("#ulforknobs").html());
            checkVariable();
            function checkVariable() {
                if (responseQwayId != null) {
                    refreshKnobsDiv();
                }
                else {
                    window.setTimeout(checkVariable, 100);
                }
            }
        }

    }

    $j(window).on("orientationchange", function (event) {
        setTimeout(setHeightOfCanvas, 100);
        //alert("Orientation is: " + event.orientation);


        function setHeightOfCanvas() {
            $j.each(questGroupDistinctList, function (i, item) {
                if (item.Question_Group__c != "null") {

                    height = $j("a[name='" + item.Question_Group__c + "']").height();
                    console.log("height before" + height);
                    if (height > 0) {
                        $j("canvas[group='" + item.Question_Group__c + "']").parent().parent().height(height);
                        $j("canvas[group='" + item.Question_Group__c + "']").attr("bheight", height);
                    }
                    else
                        $j("canvas[group='" + item.Question_Group__c + "']").parent().parent().height($j("canvas[group='" + item.Question_Group__c + "']").attr("bheight"));
                }
            });
        }
    });

    function refreshKnobsDiv() {

        console.log("@@@@@@@@@@@@@@@@ " + responseQwayId);

        if (contype == 'No network connection') {
            sid = window.localStorage.getItem("QwaySurveyIdKey");
            //sid = QwayActiveId;

            $j.each(questGroupDistinctList, function (i, item) {
                if (item.Question_Group__c != "null") {
                    height = $j("a[name='" + item.Question_Group__c + "']").height();

                    if (height > 0) {
                        $j("canvas[group='" + item.Question_Group__c + "']").parent().parent().height(height);
                        $j("canvas[group='" + item.Question_Group__c + "']").attr("bheight", height);
                    }
                    else
                        $j("canvas[group='" + item.Question_Group__c + "']").parent().parent().height($j("canvas[group='" + item.Question_Group__c + "']").attr("bheight"));

                    var categoryWiseCnt = 0;
                    db.transaction(queryDBForQuestions, errorCB);
                    function queryDBForQuestions(tx) {
                        tx.executeSql("SELECT Id,Evaluation_Criteria__c,IsDeleted,Is_Required__c,Name,Question_Group__c,\
                                    Survey_ID__c,Use_Criteria__c FROM SurveyQuestions where Survey_ID__c='"+ sid + "' and Question_Group__c='" + item.Question_Group__c + "'", [], querySuccessQuestions, errorCB);
                    }
                    function querySuccessQuestions(tx, results) {
                        categoryWiseCnt = 0;

                        if (results.rows != null) {
                            QuestionsForGrpList = results.rows.resultSet;
                            $j.each(QuestionsForGrpList, function (i, item) {
                                db.transaction(queryDBCriteriaForEachQues, errorCB);
                                function queryDBCriteriaForEachQues(tx) {
                                    tx.executeSql("SELECT Id,Criteria_Options__c,Criteria_Order__c,Criteria_Text__c,Display_Type__c,IsDeleted,Name,\
                                            Option_Values__c,Survey_Question_ID__c FROM SurveyCriterias where Survey_Question_ID__c='" + item.Id + "'", [], querySuccessCriteriaForEachQues, errorCB);
                                }
                                function querySuccessCriteriaForEachQues(tx, results) {
                                    if (results.rows != null) {
                                        categoryWiseCnt += results.rows.length;
                                    }
                                }
                            });

                            $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseCnt", categoryWiseCnt);
                        }
                    }

                    db.transaction(queryDBForAnswers, errorCB);
                    function queryDBForAnswers(tx) {
                        tx.executeSql("SELECT Id,Name,Question__c,Response__c,Question_Group__c\
                                    FROM SurveyAnswers where Survey_Response__c='" + responseQwayId + "'and Question_Group__c='" + item.Question_Group__c + "'", [], querySuccessForAnswers, errorCB);
                    }
                    function querySuccessForAnswers(tx, results) {
                        //console.log("### results answers" + JSON.stringify(results))
                        $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseAnsCnt", results.rows.length);
                        //  console.log("group" + item.Question_Group__c + "  \n categoryWiseAnsCnt: " + results.rows.length);
                    }
                }
            });
            setTimeout(drawknobs, 4000);
        }
        else {
            $j.each(questGroupDistinctList, function (i, item) {
                height = $j("a[name='" + item.Question_Group__c + "']").height();

                if (height > 0) {
                    $j("canvas[group='" + item.Question_Group__c + "']").parent().parent().height(height);
                    $j("canvas[group='" + item.Question_Group__c + "']").attr("bheight", height);
                }
                else
                    $j("canvas[group='" + item.Question_Group__c + "']").parent().parent().height($j("canvas[group='" + item.Question_Group__c + "']").attr("bheight"));


                var categoryWiseCnt = 0;
                forcetkClient.query("Select Question_Text__c,Question_Options__c,Question_ID__c,Use_Criteria__c,\
                                    Question_Group__c, Survey_ID__c,Id,Scoring_Points__c,Display_Type__c, \
                                    (SELECT Criteria_Text__c,Id, Criteria_Options__c FROM Survey_Question_Criterias__r)\
                                    From Survey_Question__c q, q.Survey_ID__r s where s.Survey_Type__c='qway' and s.Status__c='Active' \
                                    and Question_Group__c='"+ item.Question_Group__c + "' order by Question_ID__c",
                onsuccessquestforcategory, onError);

                function onsuccessquestforcategory(response) {
                    var categoryWiseCnt = 0;
                    var categoryWiseAnsCnt = 0;
                    $j.each(response.records, function (i, item) {
                        if (item.Use_Criteria__c == true) {
                            var criteria = item.Survey_Question_Criterias__r.records;
                            $j.each(criteria, function (i, qitem) {
                                categoryWiseCnt++;
                            });
                            //categoryWiseCnt += item.Survey_Question_Criterias__r.totalSize;
                        }
                        else {
                            categoryWiseCnt++;
                        }
                    });
                    //   console.log("group" + item.Question_Group__c + "  \n categoryWiseCnt: " + categoryWiseCnt);
                    $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseCnt", categoryWiseCnt);
                }
            });
            $j.each(questGroupDistinctList, function (i, item) {
                forcetkClient.query("SELECT Id FROM Survey_Answer__c a, a.Survey_Question__r q \
                                            where a.Survey_Response__c='" + responseQwayId + "' and q.Survey_ID__r.Survey_Type__c='qway' \
                                            and q.Survey_ID__r.Status__c='Active' and q.Question_Group__c='" + item.Question_Group__c + "'", onsuccessansforcategory, onError);
                function onsuccessansforcategory(response)// get saved answers for the current category
                {
                    categoryWiseAnsCnt = response.totalSize;
                    $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseAnsCnt", categoryWiseAnsCnt);
                    // console.log("group" + item.Question_Group__c + "  \n categoryWiseAnsCnt: " + categoryWiseAnsCnt);
                }
            });
            setTimeout(drawknobs, 5000);
            //function onErrorKnobs(response)
            //{
            //    if (response.status == 404) {
            //        alert("Your internet connection is very slow");
            //        var contype = checkInternetConnectivity();
            //        if (contype == 'No network connection') {
            //        }
            //        else {
            //            refreshKnobsDiv();
            //        }
            //    }
            //    else {
            //        alert("Error" + JSON.stringify(response));
            //        $j.unblockUI();
            //    }
            //    //  $j.mobile.loading('hide');
            //}
        }
    }

    function drawknobs() {
        $j.mobile.loading('show', {
            text: 'Calculating Completion Percentage',
            textVisible: true,
            //theme:theme,
            html: ""
        });
        //$j.each(questGroupDistinctList, function (i, item) {
        //    if (item.Question_Group__c != "null") {
        //        var categoryWiseCnt = $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseCnt");
        //        var categoryWiseAnsCnt = $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseAnsCnt");
        //        console.log("QcNT " + JSON.stringify(categoryWiseCnt) + " AnsCnt " + JSON.stringify(categoryWiseAnsCnt));
        //        if (categoryWiseAnsCnt == "" || categoryWiseCnt == "")
        //        {
        //            drawknobs();
        //        }
        //    }
        //});
        $j.each(questGroupDistinctList, function (i, item) {
            if (item.Question_Group__c != "null") {
                var categoryWiseCnt = $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseCnt");
                var categoryWiseAnsCnt = $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseAnsCnt");

                console.log("******************** currentQuestionGrp:" + item.Question_Group__c + "\n categoryWiseCnt:" + $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseCnt") + "\n categoryWiseAnsCnt" + $j("canvas[group='" + item.Question_Group__c + "']").attr("categoryWiseAnsCnt"));
                //var canvas = document.getElementsByName(item.Question_Group__c);
                var canvas = $j("canvas[group='" + item.Question_Group__c + "']")[0];

                if (canvas != null) {
                    var context = canvas.getContext('2d');
                    if (context) {
                        context.clearRect(0, 0, 45, 45);
                        var x = canvas.width / 2;
                        var y = canvas.height / 2;
                        var radius = 17;
                        var counterClockwise = false;

                        var startAngle = 0;
                        var endAngle = 2 * Math.PI;
                        context.beginPath();
                        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
                        context.lineWidth = 4;
                        context.strokeStyle = '#B2AFAC';
                        context.stroke();
                        startAngle = -Math.PI / 2;
                        if (categoryWiseCnt != 0)
                            endAngle = categoryWiseAnsCnt * 2 * Math.PI / categoryWiseCnt - Math.PI / 2;
                        else
                            endAngle = -Math.PI / 2;
                        context.beginPath();
                        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
                        context.lineWidth = 4;
                        context.strokeStyle = '#FA980D';
                        context.stroke();

                        context.font = "10px Arial";
                        context.fillStyle = '#B2AFAC';
                        if (categoryWiseCnt != 0)
                            context.fillText(Math.round(categoryWiseAnsCnt / categoryWiseCnt * 100) + "%", x - x / 3, y + y / 10);
                        else
                            context.fillText("0%", x - x / 3, y + y / 10);
                    }
                }
                else {
                    console.log("$$$$$$$$$$$$ canvas is null");
                }
            }
        });

        $j.mobile.loading('hide');
    }

    function ShowQuestionsOnSuccess(response) {
        QuestionsForGrpList = response.records;
        //  console.log("$$$ response obj" + JSON.stringify(response));
        displayQuestionsforGrps();
    }

    function displayQuestionsforGrps() {
        var list = '';
        var radioId;

        $j("#" + current_tab).append('<div data-role="listview" data-inset="true"></div>');
        $j("#" + current_tab).trigger("create");


        $j.each(QuestionsForGrpList, function (i, item) {
            var contype = checkInternetConnectivity();
            if (contype == 'No network connection') {

                $j.blockUI({
                    message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Questions</h4>',
                    css: {
                        color: '#78604F', border: 'none',
                        '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                    }
                });

            }
            //var quesobj= [{ "questid": item.Id, "criterias": [{ "cid": item.Id + "_" + qitem.Id, "value": radioId }, { "cid": item.Id + "_" + qitem.Id, "value": radioId }] }]

            list += '<div id="' + item.Id + '">\
                <div class=\"row questHead\"><h4 class=\"col-md-2 col-sm-2 col-xs-2 questDisplayId\" style=\"border-right:1px solid #C7C7C7\">  ' + item.Question_ID__c + '</h4>\
                <h5 class=\"col-md-7 col-sm-7 col-xs-7 questDisplayText\">' + item.Question_Text__c + '</h5>\
                <div class=\"col-md-3 col-sm-3 col-xs-3\"><label><input type="checkbox" data-mini=\"true\" style=\"width:auto\" id=\"checkbox_' + item.Id + '\" name=\"' + item.Id + '\" class="disablechilddiv col-sm-2 col-xs-2" data-related-item="fieldset_' + item.Id + '" / >NA</label></div>\
                </div>';
            list += '<fieldset id="fieldset_' + item.Id + '">';
            var criteria;

            if (item.Use_Criteria__c == "true" || item.Use_Criteria__c == true) {

                if (contype == 'No network connection') {
                    db.transaction(queryDB, errorCB);

                    function queryDB(tx) {
                        tx.executeSql("SELECT Id,Criteria_Options__c,Criteria_Order__c,Criteria_Text__c,Display_Type__c,IsDeleted,Name,\
                    Option_Values__c,Survey_Question_ID__c FROM SurveyCriterias where Survey_Question_ID__c='" + item.Id + "'", [], querySuccess1, errorCB);
                    }

                    function querySuccess1(tx, results) {
                        var len = results.rows.length;
                        criteria = results.rows.resultSet;
                        //  console.log("Offline criteria is" + JSON.stringify(criteria));
                        // console.log("criteria  lenght is" + len);
                    }
                }
                else {
                    criteria = item.Survey_Question_Criterias__r.records;
                }
                // console.log(JSON.stringify(quesobj));
                if (quesobj == null) {
                    quesobj = [{
                        "quesid": item.Id, "NA": false, "SurveyScoreId": "", "DisplayType": item.Display_Type__c, "quesText": item.Question_Text__c,
                        "quesDisplayId": item.Question_ID__c, "Question_Group__c": item.Question_Group__c, "ScoringPoints": item.Scoring_Points__c, "EarnedPoints": "0", "EvaluatedPoints": "0",
                        "Qoptions": item.Question_Options__c, "value": "", "comments": "", "imageData": "", "isCriteria": item.Use_Criteria__c, "criterias": []
                    }];

                }
                else {
                    quesobj.push({
                        "quesid": item.Id, "NA": false, "SurveyScoreId": "", "DisplayType": item.Display_Type__c, "quesText": item.Question_Text__c,
                        "quesDisplayId": item.Question_ID__c, "Question_Group__c": item.Question_Group__c, "ScoringPoints": item.Scoring_Points__c, "EarnedPoints": "0", "EvaluatedPoints": "0",
                        "Qoptions": item.Question_Options__c, "value": "", "comments": "", "imageData": "", "isCriteria": item.Use_Criteria__c, "criterias": []
                    });

                }

                $j.each(criteria, function (i, qitem) {

                    radioId = item.Id + "_" + qitem.Id;
                    $j.each(quesobj, function (i, quesitem) {
                        if (quesitem.quesid == item.Id) {
                            if (quesitem.criterias == null) {
                                quesitem.criterias = [{
                                    "cid": qitem.Id, "SurveyAnswerId": "", "ctext": qitem.Criteria_Text__c, "comments": "", "imageData": "",
                                    "Coptions": qitem.Criteria_Options__c, "value": ""
                                }];
                            }
                            else {
                                quesitem.criterias.push({
                                    "cid": qitem.Id, "SurveyAnswerId": "", "ctext": qitem.Criteria_Text__c, "comments": "", "imageData": "",
                                    "Coptions": qitem.Criteria_Options__c, "value": ""
                                });
                            }
                        }

                    });
                    var options = qitem.Criteria_Options__c.split("\n");
                    options[0] = options[0].split(/\r| /)[0];
                    options[1] = options[1].split(/\r| /)[0];
                    qitem.Coptions = options;   // c.Coptions.split("\n");

                    if (item.Display_Type__c == "Radio Button") {

                        list += '<div class=\"row questCat\" id=\"' + radioId + '\">\
                                <div class=\"col-md-2 col-sm-2 col-xs-2\"></div>\
                                <div class=\"col-md-10 col-sm-10 col-xs-10\">\
                                    <div class=\"row\">\
                                        <div data-role=\"fieldcontain\">\
                                            <fieldset class=\"toaddicon\" data-role=\"controlgroup\" data-type=\"horizontal\" data-mini=\"true\">\
                                                <legend style=\"font-size:13px; border:none\">' + qitem.Criteria_Text__c + '</legend>\
                                                <div class=\"col-md-3 col-sm-3 col-xs-4 padding_0\"><input type=\"radio\" name=\"' + qitem.Id + '\" id= \"' + options[0] + '_' + radioId + '\" value=\"' + options[0] + ' \" class="required"/>\
                                                <label for=\"' + options[0] + '_' + radioId + '\" class=\"leftRadio\">' + options[0] + '</label></div>\
                                                <div class=\"col-md-3 col-sm-3 col-xs-4 padding_0\"><input type=\"radio\" name=\"' + qitem.Id + '\" id=\"' + options[1] + '_' + radioId + '\" value=\"' + options[1] + ' \" />\
                                                <label for=\"' + options[1] + '_' + radioId + '\" class=\"centerRadio\">' + options[1] + '</label></div>\
                                                <div class=\"col-md-3 col-sm-3 col-xs-4 padding_0\"><input type=\"radio\" name=\"' + qitem.Id + '\" id=\"' + options[2] + '_' + radioId + '\" value=\"' + options[2] + ' \" />\
                                                <label for=\"' + options[2] + '_' + radioId + '\" class=\"rightRadio\">' + options[2] + '</label></div>\
                                                <label for=\"' + qitem.Id + '\" class="error">Please select at least one option</label>\
                                           </fieldset>\
                                        </div></div></div>\
                            </div>';

                    }
                    else if (item.Display_Type__c == "Number Input") {

                        list += '<div class=\"row questCat\" id=\"' + radioId + '\">\
                                <div class=\"col-md-2 col-sm-2 col-xs-2\"></div>\
                                <div class=\"col-md-10 col-sm-10 col-xs-10\">\
                                    <div class=\"row\">\
                                        <div data-role=\"fieldcontain\">\
                                               <div class=\"col-md-8 col-sm-8 col-xs-8"><label for=\"Text_' + radioId + '\" class=\"col-md-2 control-label\">' + qitem.Criteria_Text__c + '</label>\
                                                <input type=\"number\" name=\"' + qitem.Id + '\" id=\"Text_' + radioId + '\" class=\"form-control\"/></div>\
                                           <div class=\"col-md-4 col-sm-4 col-xs-4 toaddicon">\
                                                <label for=\"' + qitem.Id + '\" class="error">This is required field</label>\
                                       </div></div></div></div>\
                            </div>';
                    }
                });
            }
            else //if isCriteria is not true
            {
                //textId = "text_"+current_tab + "_" + item.Question_ID__c;
                //btnNAId="NA_"+current_tab + "_" + item.Question_ID__c;
                quesobj.push({
                    "quesid": item.Id, "SurveyScoreId": "", "SurveyAnswerId": "", "DisplayType": item.Display_Type__c,
                    "quesText": item.Question_Text__c, "quesDisplayId": item.Question_ID__c, "ScoringPoints": item.Scoring_Points__c,
                    "EvaluatedPoints": "0", "Qoptions": item.Question_Options__c, "response": "", "comments": "", "imageData": ""
                });
                // quesobj.Qoptions = quesobj.Qoptions.split("\n");
                list += '<div class=\"row questCat\" id=\"' + item.Id + '\">\
                                <div class=\"col-md-2 col-sm-2 col-xs-2\"></div>\
                                <div class=\"col-md-10 col-sm-10 col-xs-10\">\
                                    <div class=\"row\">\
                                        <div data-role=\"fieldcontain\">\
                                            <fieldset data-role=\"controlgroup\" data-type=\"horizontal\">\
                                                <input type=\"number\" name=\"' + item.Id + '\" id=\"Text_' + item.Id + '\" class="required" />\
                                                <label for=\"' + item.Id + '\" class="error">This is required field</label>\
                                            </fieldset>\
                                        </div></div></div>\
                            </div>';
            }
            list += '</fieldset></div>';

            //if (contype == 'No network connection') {
            //  //  $j.mobile.loading('hide');
            //}
        });

        $j("#" + current_tab).append(list);
        $j("input[type='radio']").checkboxradio().checkboxradio("refresh");
        $j("input[type='checkbox']").checkboxradio().checkboxradio("refresh");
        //    $j("input[type='number']").textinput().textinput("refresh");
        // $j("input[type='radio']").checkboxradio().checkboxradio("refresh");
        //  $j("#questionList").listview("refresh");
        //$j("#" + current_tab).listview().listview('refresh');


        // console.log($j("#questtab").html());
        //  console.log("***********questobj*********" + JSON.stringify(quesobj));

        // $j.mobile.loading('hide');   // stop loading questions
        $j.unblockUI();

        if (typeof questGrpObj != "undefined") {
            questGrpObj.addClass("questgrplist");
        }

        if (actionVisit == "resume") {
            QwayResume();
        }
    }

    var questGrpObj;
    var tx1;
    $j(document).off('vclick', '.questgrplist').on('vclick', '.questgrplist', function () {

        $j(this).removeClass("questgrplist");

        questGrpObj = $j(this);
        var ind = $j(this).parent().index();

        $j('#qglist li').eq(ind).siblings().attr("class", "storeDetailsLi");
        $j('#qglist li').eq(ind).attr("class", "active storeDetailsLi");

        $j('ul#knoblist li:eq(' + ind + ')').siblings().attr("class", "storeDetailsLi");
        $j('ul#knoblist li:eq(' + ind + ')').attr("class", "active storeDetailsLi");

        // clear earlier selected questions
        sel_ques = null;
        sel_criteria = null;
        $j("#ComImg").attr("src", "../www/Images/icons/icon-addComment-normal.png");
        $j("#ComImg").parent().attr("href", "");
        $j("#CamImg").attr("src", "../www/Images/icons/icon-addPhoto-normal.png");
        $j("#CamImg").parent().attr("href", "");


        var qgrpstring = $j(this).attr("rel");
        var cnt = 0;

        $j.each(questGroupDistinctList, function (i, item) {
            console.log("hidedn" + item.Question_Group__c);
            //  $j("#quest" + cnt).css("display", "none");
            $j("#quest" + cnt).addClass("hidden");
            $j("canvas[group='" + item.Question_Group__c + "']").css("background-color", "#4F3C30");
            cnt = cnt + 1;
        });
        $j("#quest" + ind).removeClass("hidden");
        currentQuestionGrp = qgrpstring;
        $j("canvas[group='" + qgrpstring + "']").css("background-color", "white");

        current_tab = "quest" + ind;

        if ($j("#" + current_tab).children().is(':empty')) {
            $j(this).addClass("questgrplist");
        }
        else {
            $j.blockUI({
                message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Questions</h4>',
                css: {
                    color: '#78604F', border: 'none',
                    '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                }
            });
            //check internet is on
            var contype = checkInternetConnectivity();
            if (contype == 'No network connection') {
                $j.blockUI({
                    message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Questions</h4>',
                    css: {
                        color: '#78604F', border: 'none',
                        '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                    }
                });

                db.transaction(queryDB, errorCB);

                function queryDB(tx) {

                    tx.executeSql("SELECT Id,Display_Type__c,Evaluation_Criteria__c,IsDeleted,Is_Required__c,Name,Option_Values__c,\
                                    Question_Category__c,Question_Group__c,Question_ID__c,Question_Options__c,Question_Order__c,Question_Text__c,Scoring_Points__c,\
                                     Survey_ID__c,Use_Criteria__c FROM SurveyQuestions where Question_Group__c='" + qgrpstring + "' order by Question_ID__c", [], querySuccess1, errorCB);
                }

                function querySuccess1(tx, results) {

                    var len = results.rows.length;
                    QuestionsForGrpList = results.rows.resultSet;
                    displayQuestionsforGrps();
                }
            }
            else { // internet con
                var str = "Select Question_Text__c,Question_Options__c,Question_ID__c,Use_Criteria__c,\
            Question_Group__c, Is_Required__c, Id,Scoring_Points__c,Display_Type__c, (SELECT Criteria_Text__c,Id,Criteria_Options__c FROM Survey_Question_Criterias__r)\
            From Survey_Question__c where Question_Group__c='" + qgrpstring + "' order by Question_ID__c";
                console.log(str);
                forcetkClient.query(str, ShowQuestionsOnSuccess, onError);
            }
        }

        //console.log("^^^^^^^^^^^^^^^^quest tab after changing grp:          " + $j("#questtab").html());
    });

    $j(document).off('change', 'input[type="checkbox"]').on('change', 'input[type="checkbox"]', function () {
        var item = $j(this);
        var qid = $j(this).attr("id");
        var idlist = qid.split("_");
        console.log("idlist is: " + idlist);
        console.log("select id is" + idlist[1])
        var question;

        var relatedItem = $j("#" + item.attr("data-related-item"));

        if (item.is(":checked")) {
            $j.each(quesobj, function (i, ques) {
                if (ques.quesid == idlist[1]) {
                    ques.NA = true;
                    question = ques;
                    return false;
                }
            });
            relatedItem.fadeOut();

            if (sel_criteria == null) {
                $j("#ComImg").attr("src", "../www/Images/icons/icon-addComment-normal.png");
                $j("#ComImg").parent().attr("href", "");
                $j("#CamImg").attr("src", "../www/Images/icons/icon-addPhoto-normal.png");
                $j("#CamImg").parent().attr("href", "");
            }
            else {
                $j.each(question.criterias, function (i, c) {
                    if (c.cid == sel_criteria) {
                        $j("#ComImg").attr("src", "../www/Images/icons/icon-addComment-normal.png");
                        $j("#ComImg").parent().attr("href", "");
                        $j("#CamImg").attr("src", "../www/Images/icons/icon-addPhoto-normal.png");
                        $j("#CamImg").parent().attr("href", "");
                    }
                });
            }
            $j(this).closest('#questtab').find(".questCat").removeClass('activ');
            //relatedItem.attr("disabled","disabled");
        }
        else {
            $j.each(quesobj, function (i, ques) {
                if (ques.quesid == idlist[1]) {
                    ques.NA = false;
                    return false;
                }
            });
            //relatedItem.removeAttr("disabled");
            relatedItem.fadeIn();
        }
    });

    //$j(document).off('vclick', '.questCat').on('vclick', '.questCat', function () {
    //    alert("bahar clicked");
    //    $j(this).closest('#questtab').find(".questCat").removeClass('activ');
    //    $j(this).addClass('activ');

    //    var qid = $j(this).attr("id");
    //    var idlist = qid.split("_");

    //    sel_ques = idlist[0];
    //    sel_criteria = idlist[1];

    //    sel_quesqId = $j(this).closest("#" + sel_ques).find("h4").text();
    //    sel_quesText = $j(this).closest("#" + sel_ques).find("h5").text();
    //    sel_criteriaText = $j(this).find("legend").text();


    //    $j("#ComImg").attr("src", "../www/Images/icons/icon-addComment-press.png");
    //    $j("#ComImg").parent().attr("href", "#commentPopup");
    //    $j("#CamImg").attr("src", "../www/Images/icons/icon-addPhoto-press.png");
    //    $j("#CamImg").parent().attr("href", "#camPopup");
    //});

    // event fired when radio btn clicked

    $j(document).off('change', 'input[type="radio"]').on('change', 'input[type="radio"]', function () {

        $j(this).closest('#questtab').find(".questCat").removeClass('activ');
        $j(this).closest('.questCat').addClass('activ');

        var qid = $j(this).closest('.questCat').attr("id");
        var idlist = qid.split("_");

        sel_ques = idlist[0];
        sel_criteria = idlist[1];

        sel_quesqId = $j(this).closest("#" + sel_ques).find("h4").text();
        sel_quesText = $j(this).closest("#" + sel_ques).find("h5").text();
        sel_criteriaText = $j(this).closest(".questCat").find("legend").text();


        $j("#ComImg").attr("src", "../www/Images/icons/icon-addComment-press.png");
        $j("#ComImg").parent().attr("href", "#commentPopup");
        $j("#CamImg").attr("src", "../www/Images/icons/icon-addPhoto-press.png");
        $j("#CamImg").parent().attr("href", "#camPopup");

    });

    $j(document).off('vclick', 'input[type="number"]').on('vclick', 'input[type="number"]', function () {
        $j(this).closest('#questtab').find(".questCat").removeClass('activ');
        $j(this).closest('.questCat').addClass('activ');

        var qid = $j(this).closest('.questCat').attr("id");
        var idlist = qid.split("_");

        sel_ques = idlist[0];
        sel_criteria = idlist[1];

        sel_quesqId = $j(this).closest("#" + sel_ques).find("h4").text();
        sel_quesText = $j(this).closest("#" + sel_ques).find("h5").text();
        sel_criteriaText = $j(this).closest(".questCat").find("label").first().text();

        $j("#ComImg").attr("src", "../www/Images/icons/icon-addComment-press.png");
        $j("#ComImg").parent().attr("href", "#commentPopup");
        $j("#CamImg").attr("src", "../www/Images/icons/icon-addPhoto-press.png");
        $j("#CamImg").parent().attr("href", "#camPopup");
    });

    // Save Q-Way
    $j(document).off('vclick', '#qwaySave').on('vclick', '#qwaySave', function () {
        // $j("#qwaySave").click(function () {

        //$j.mobile.loading('show', {
        //    text: 'Saving Qway Response',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});
        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Saving Qway Response</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });

        var Qoptions, Coptions;
        var radioforcriteria;
        var surveyAnswers;
        var textsforques;
        var naCnt = 0, noflag = false, naflag = false;

        //************
        //To store answers for each criteria of each question
        var valuesforcriteria, valuesfornocriteria;

        $j.each(quesobj, function (i, q) {
            if (q.Question_Group__c == currentQuestionGrp) {
                if (q.isCriteria == true || q.isCriteria == "true") {
                    $j.each(q.criterias, function (j, c) {

                        if (q.DisplayType == "Radio Button") {
                            if (!$j("input[name='" + c.cid + "']:checked").val()) {
                                // console.log('Nothing is checked!');
                            }
                            else {
                                valuesforcriteria = $j("[id*='" + c.cid + "']:checked");
                                c.value = valuesforcriteria[0].value;
                            }
                        }
                        else {
                            valuesforcriteria = $j("[id*='" + c.cid + "']:input");
                            // console.log("values for criteria:" + valuesforcriteria[0].value);
                            c.value = valuesforcriteria[0].value;
                        }


                        if (typeof $j("#" + q.quesid + "_" + c.cid).data("commentObj") != "undefined") {
                            c.comments = $j("#" + q.quesid + "_" + c.cid).data("commentObj").comment;
                            //$j("#" + sel_ques + "_" + sel_criteria).data("commentObj").comment);
                        }
                        if (typeof $j("#" + q.quesid + "_" + c.cid).data("Image") != "undefined") {
                            c.imageData = $j("#" + q.quesid + "_" + c.cid).data("Image").imageData;
                        }
                        console.log("critrira....." + JSON.stringify(c));
                    });
                }
                else {
                    valuesfornocriteria = $j("[id*='" + q.quesid + "']:input");
                    console.log(valuesfornocriteria[0].value);
                    q.response = valuesfornocriteria[0].value;
                    // q.Qoptions = q.Qoptions.split("\n");
                    console.log("qoptions: " + q.Qoptions);

                    if (typeof $j("#" + q.quesid).data("commentObj") != "undefined") {
                        q.comments = $j("#" + q.quesid).data("commentObj").comment;
                    }
                    if (typeof $j("#" + q.quesid).data("Image") != "undefined") {
                        q.imageData = $j("#" + q.quesid).data("Image").imageData;
                    }
                }
            }
        });

        // check internet connection
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            db.transaction(queryDB, errorCB);

            function queryDB(tx) {
                tx.executeSql("SELECT Comment__c,Criteria__c,Id,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c\
            FROM SurveyAnswers where Survey_Response__c='" + responseQwayId + "' and Question_Group__c='" + currentQuestionGrp + "'", [], querySuccess1, errorCB);
            }

            function querySuccess1(tx, results) {
                console.log("### results answers" + JSON.stringify(results))
                var len = results.rows.length;
                surveyAnswers = results.rows.resultSet;
                saveAnswerResponse();
            }

        }
        else {// if internet con
            forcetkClient.query("SELECT Comment__c, CreatedById, CreatedDate, Criteria__c, Id, IsDeleted, LastActivityDate,\
                                        LastModifiedById, LastModifiedDate, LastReferencedDate, LastViewedDate,Name, Question_Order__c, \
                                        Question__c, Response__c,Survey_Question_Criteria__c, Survey_Question__c, Survey_Response__c, \
                                        SystemModstamp, Type_of_Data__c FROM Survey_Answer__c a, a.Survey_Question__r q where q.Question_Group__c='" + currentQuestionGrp + "'\
                                        and Survey_Response__c='" + responseQwayId + "' and IsDeleted=false", onsuccessgetansforresposne, onError);
        }
        function onsuccessgetansforresposne(response) {
            surveyAnswers = response.records;
            console.log("survey answers: " + JSON.stringify(surveyAnswers));
            saveAnswerResponse();
        }

        function saveAnswerResponse() {
            //Inserting Survey Answer objects for each survey response in database
            $j.each(quesobj, function (i, q) {
                if (q.Question_Group__c == currentQuestionGrp) {
                    fields = {};
                    if (q.isCriteria == true || q.isCriteria == "true") {

                        $j.each(q.criterias, function (j, c) {
                            if (q.NA == true) {
                                fields.Response__c = "N/A";
                                fields.Comment__c = c.comments;
                            }
                            else {
                                fields.Response__c = c.value;
                                fields.Comment__c = c.comments;
                            }

                            var isupdated = false;

                            $j.each(surveyAnswers, function (i, item) {
                                if (q.quesid == item.Survey_Question__c && c.cid == item.Survey_Question_Criteria__c) {
                                    //  check internet con
                                    if (contype == 'No network connection') { }
                                    else {
                                        forcetkClient.upsert("Survey_Answer__c", "Id", item.Id, fields, function (response) {
                                            //console.log(JSON.stringify(response));

                                            // for attaching image
                                            if (c.imageData != "") {
                                                forcetkClient.query("Select Id, ParentId From Attachment where ParentId='" + item.Id + "'", onsuccessAttachment, onError);
                                                function onsuccessAttachment(response) {
                                                    var Camfields = {};
                                                    Camfields.Body = c.imageData;
                                                    if (response.totalSize == 0) {
                                                        Camfields.Name = "image_" + q.quesid + "_" + c.cid;
                                                        Camfields.ParentId = item.Id;
                                                        forcetkClient.create("Attachment", Camfields, onsuccessAttached, onError);
                                                        imageAttachment.push({ "ParentId": item.Id, "CriteriaId": c.cid, "ImageData": c.imageData });
                                                    }
                                                    else {
                                                        forcetkClient.upsert("Attachment", "Id", response.records[0].Id, Camfields, onsuccessAttached, onError);
                                                        var flag = false;
                                                        $j.each(imageAttachment, function (i, item) {
                                                            //console.log("item criteria" + item.CriteriaId + " Selected Criteria " + sel_criteria);                                                        
                                                            if (item.CriteriaId == c.cid) {
                                                                item.ImageData = c.imageData;
                                                                flag = true;
                                                            }
                                                        });
                                                        if (flag == false) {
                                                            imageAttachment.push({ "QuesId": item.Survey_Question__c, "ParentId": item.Id, "CriteriaId": c.cid, "ImageData": c.imageData });
                                                        }
                                                    }
                                                    function onsuccessAttached() {
                                                        alert("Image Attached");
                                                    }
                                                }
                                            }
                                            if (response != null) {
                                                c.SurveyAnswerId = response.id;
                                            }
                                        }, onError);
                                    }
                                    // update locally
                                    db.transaction(updateDB, errorCB, successupdateDB);

                                    function updateDB(tx) {
                                        tx.executeSql('UPDATE SurveyAnswers SET Response__c = "' + fields.Response__c + '" WHERE Id ="' + item.Id + '"');
                                    }
                                    function successupdateDB() {
                                        console.log("@@@ ## successfully UPDATED");
                                    }
                                    isupdated = true;
                                }
                            });

                            if (isupdated == false) {

                                fields.Survey_Response__c = responseQwayId;
                                fields.Survey_Question__c = q.quesid;
                                fields.Survey_Question_Criteria__c = c.cid;

                                //add the field for comment here..                   

                                if (fields.Response__c != "") {
                                    //  check internet con
                                    if (contype == 'No network connection') {

                                        // insert locally without id
                                        db.transaction(insertDB, errorCB, successInsertDB);

                                        function insertDB(tx) {
                                            var answerId = responseQwayId + "_" + c.cid;
                                            tx.executeSql('INSERT INTO SurveyAnswers (Id,Comment__c,Criteria__c,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,\                                    Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c) VALUES ("' + answerId + '","' + fields.Comment__c + '","' + c.ctext.replace(/"/g, "") + '",\                                    "' + null + '","' + null + '","' + q.quesText.replace(/"/g, "") + '","' + fields.Response__c + '","' + fields.Survey_Question_Criteria__c + '",\
                                    "' + fields.Survey_Question__c + '","' + fields.Survey_Response__c + '","' + q.DisplayType + '","' + q.Question_Group__c + '")');
                                        }
                                        function successInsertDB() {
                                            console.log("successfully inserted");
                                        }
                                    }
                                    else {
                                        var fieldsLocal = {};
                                        fieldsLocal.Response__c = fields.Response__c;
                                        fieldsLocal.Comment__c = c.comments;
                                        fieldsLocal.Survey_Response__c = responseQwayId;
                                        fieldsLocal.Survey_Question__c = q.quesid;
                                        fieldsLocal.Survey_Question_Criteria__c = c.cid;

                                        forcetkClient.create("Survey_Answer__c", fields, function (response) {
                                            console.log(JSON.stringify(response));
                                            c.SurveyAnswerId = response.id;

                                            // insert locally with id
                                            db.transaction(insertDB1, errorCB, successInsertDB1);

                                            function insertDB1(tx) {
                                                tx.executeSql('INSERT INTO SurveyAnswers (Id,Comment__c,Criteria__c,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,\                                    Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c) VALUES ("' + response.id + '","' + fieldsLocal.Comment__c + '","' + c.ctext.replace(/"/g, "") + '",\                                    "' + null + '","' + null + '","' + q.quesText.replace(/"/g, "") + '","' + fieldsLocal.Response__c + '","' + fieldsLocal.Survey_Question_Criteria__c + '",\
                                    "' + fieldsLocal.Survey_Question__c + '","' + fieldsLocal.Survey_Response__c + '","' + q.DisplayType + '","' + q.Question_Group__c + '")');
                                            }
                                            function successInsertDB1() {
                                                console.log("successfully inserted");
                                            }

                                            // for attaching image
                                            if (c.imageData != "") {
                                                var Camfields = {};
                                                Camfields.Body = c.imageData;
                                                Camfields.Name = "image_" + q.quesid + "_" + c.cid;
                                                Camfields.ParentId = response.id
                                                console.log("Camfields:" + JSON.stringify(Camfields));
                                                forcetkClient.create("Attachment", Camfields, onsuccessAttached, onError);
                                                imageAttachment.push({ "QuesId": q.quesid, "ParentId": response.id, "CriteriaId": c.cid, "ImageData": c.imageData });
                                                ////var Camfields = {};
                                                ////Camfields.Body = c.imageData;
                                                ////Camfields.Name = "image_" + q.quesid + "_" + c.cid;
                                                ////Camfields.ParentId = response.id;
                                                ////forcetkClient.upsert("Attachment", "ParentId", response.id, Camfields, onsuccessAttached, onError);
                                                function onsuccessAttached() {
                                                    alert("Image Attached.");
                                                }
                                            }

                                        }, onError);
                                    }

                                }
                                //forcetkClient.upsert("Survey_Answer__c", null, null, fields, function (response) { console.log(JSON.stringify(response)); c.SurveyAnswerId = response.id}, onError);                   
                            }

                        });
                    }
                    else {
                        fields.Survey_Response__c = responseQwayId;
                        fields.Survey_Question__c = q.quesid;
                        fields.Response__c = q.response;
                        //add field for comment
                        fields.Comment__c = q.comments;

                        if (fields.Response__c != "") {

                            //  check internet con
                            if (contype == 'No network connection') { }
                            else {
                                forcetkClient.create("Survey_Answer__c", fields, function (response) {
                                    console.log(JSON.stringify(response));
                                    q.SurveyAnswerId = response.id

                                    // for attaching image
                                    if (q.imageData != "") {
                                        var Camfields = {};
                                        Camfields.Body = q.imageData;
                                        Camfields.Name = "image_" + q.quesid;
                                        Camfields.ParentId = response.id;
                                        forcetkClient.create("Attachment", Camfields, onsuccessAttached, onError);
                                        function onsuccessAttached() {
                                            alert("Image Attached");
                                        }
                                    }

                                }, onError);
                            }

                            // insert locally
                            db.transaction(insertDB, errorCB, successInsertDB);

                            function insertDB(tx) {
                                tx.executeSql('INSERT INTO SurveyAnswers (Id,Comment__c,Criteria__c,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,\                                    Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c) VALUES ("' + null + '","' + fields.Comment__c + '","' + null + '",\                                    "' + null + '","' + null + '","' + q.quesText.replace(/"/g, "") + '","' + fields.Response__c + '","' + null + '",\
                                    "' + fields.Survey_Question__c + '","' + fields.Survey_Response__c + '","' + q.DisplayType + '","' + q.Question_Group__c + '")');
                            }
                            function successInsertDB() {
                                console.log("successfully inserted");
                            }

                        }
                        //forcetkClient.upsert("Survey_Answer__c",null,null, fields, function (response) { q.SurveyAnswerId = response.id }, onError);
                    }
                }
            });

            // $j.mobile.loading('hide');
            $j.unblockUI();
            alert("Q-Way Saved Successfully");
            refreshKnobsDiv();
            //  $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
        }

    });

    // $j("#form1").validate();
    $j(document).off('vclick', '#tog').on('vclick', '#tog', function () {

        var src = $j(this).attr("src");
        if (src == "../www/Images/menu-toggle-left.png") {
            $j(this).attr("src", "../www/Images/menu-toggle-right.png");
            document.getElementById("qwayQuestDiv").className = "col-md-11 col-sm-11 col-xs-11 padding_0";
            document.getElementById("qwayQuestDivHead").className = "col-md-11 col-sm-11 col-xs-11 padding_0";
        }
        else {
            $j(this).attr("src", "../www/Images/menu-toggle-left.png");
            document.getElementById("qwayQuestDiv").className = "col-md-8 col-sm-8 col-xs-8 padding_0";
            document.getElementById("qwayQuestDivHead").className = "col-md-8 col-sm-8 col-xs-8 padding_0";
        }

        $j("#qcategories").toggle();
        $j("#qcategoriesHead").toggle();
        //$j("#questGrpHead").toggle();
        //$j("#questgrplist h4").toggle();
    });

    //To close the popups
    $j(document).off('vclick', '#btnComCancel').on('vclick', '#btnComCancel', function (e) {
        $j("#commentPopup").popup("close");
        e.stopPropagation();
        return false;
        // $j.unblockUI();
        //  $j("body").unwrap();
    });

    $j(document).off('vclick', '#btnComSave').on('vclick', '#btnComSave', function (e) {
        var commentStr = $j("#comTextArea").val();
        if (commentStr == "")
        { alert("Please write comment"); }
        else {
            $j("#" + sel_ques + "_" + sel_criteria).data("commentObj", { comment: commentStr });

            var src = $j("#" + sel_ques + "_" + sel_criteria).find(".toaddicon").find("img").attr("src");
            if (src != "../www/Images/icons/icon-commentAdded.png") {
                $j("#" + sel_ques + "_" + sel_criteria).find(".toaddicon").append("<img style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
            }
            $j("#commentPopup").popup("close");
            $j("#commentPopup").popup("close");
            e.stopPropagation();
            return false;
            // $j.unblockUI();
            // $j("body").unwrap();
        }
    });

    $j(document).off('vclick', '#btnPicSave').on('vclick', '#btnPicSave', function (e) {
        if (imageData == null)
        { alert("Please take photo"); }
        else {
            $j("#" + sel_ques + "_" + sel_criteria).data("Image", { imageData: imageData });
            var src = $j("#" + sel_ques + "_" + sel_criteria).find(".toaddicon").find("img").attr("src");
            if (src != "../www/Images/icons/icon-photoAdded.png") {
                $j("#" + sel_ques + "_" + sel_criteria).find(".toaddicon").append("<img style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
            }
            $j("#camPopup").popup("close");
            $j("#camPopup").popup("close");
            e.stopPropagation();
            return false;
        }
    });

    $j(document).off('vclick', '#btnPicCancel').on('vclick', '#btnPicCancel', function (e) {
        $j("#camPopup").popup("close");
        e.stopPropagation();
        return false;
    });

    $j("#commentPopup").popup({
        beforeposition: function (event, ui) {

            //$j.blockUI({
            //    css: {
            //        color: '#78604F', border: 'none',
            //        '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            //    }
            //});
            //  $j("#qway").wrap("<div style='width:100%;height: 100%;top: 0px;left: 0px;background-color: rgba(0,0,0,0.3);'></div>");
            $j("#comTextArea").val("");
            $j("#QWAYCONTENTS :input").attr("disabled", "disabled");

            $j("#comQid").html(sel_quesqId);
            $j("#comQtext").html(sel_quesText);
            $j("#comCtext").html(sel_criteriaText);
            if (typeof $j("#" + sel_ques + "_" + sel_criteria).data("commentObj") != "undefined") {
                var comment = $j("#" + sel_ques + "_" + sel_criteria).data("commentObj").comment;
                $j("#comTextArea").val(comment);
            }
        },
        afterclose: function (event, ui) {
            setTimeout(removeAttribute, 500);
            function removeAttribute() {
                $j("#QWAYCONTENTS :input").removeAttr("disabled");
            }
            // $j("body").unwrap();
            // $j.unblockUI();
        }
    });

    $j("#camPopup").popup({
        beforeposition: function (event, ui) {
            imageData = null;
            $j("#camQid").html(sel_quesqId);
            $j("#camQtext").html(sel_quesText);
            $j("#camCtext").html(sel_criteriaText);
            $j("#QWAYCONTENTS :input").attr("disabled", "disabled");
            var canvas = document.getElementById('camImageCanvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, 250, 280);
            var flag = false;
            var imageObj = new Image();
            console.log("imageAttachment" + JSON.stringify(imageAttachment));
            $j.each(imageAttachment, function (i, item) {
                console.log("item criteria" + item.CriteriaId + " Selected Criteria " + sel_criteria);

                if (item.CriteriaId == sel_criteria) {
                    imageObj.src = item.ImageData;
                    console.log("************** imageobj.src:" + imageObj.src);
                    flag = true;
                }
            });
            if (flag == false) {
                imageObj.src = "../www/Images/icons/icon-takephoto.png";
            }
            imageObj.onload = function () {
                console.log("$$$$$$$$$$$$$$$$$$$$ imageobj.src:" + imageObj.src);
                context.drawImage(imageObj, 0, 0, 250, 280);
            };
        },
        afterclose:
           function (event, ui) {
               setTimeout(removeAttribute, 500);
               function removeAttribute() {
                   $j("#QWAYCONTENTS :input").removeAttr("disabled");
               }
           }
    });

    var imageData = null;;
    //Camera functionality
    $j(document).off('vclick', '#CamTap').on('vclick', '#CamTap', function () {
        var CamObj = cordova.require("cordova/plugin/Camera");
        console.log("***camobj***" + JSON.stringify(CamObj));

        CamObj.getPicture(CamOnSuccess, CamOnFail, {
            quality: 50,
            // destinationType: Camera.DestinationType.FILE_URI
            destinationType: Camera.DestinationType.DATA_URL

        });

        function CamOnSuccess(imageURI) {
            console.log("image data is -- " + imageURI);
            var canvas = document.getElementById('camImageCanvas');
            var context = canvas.getContext('2d');
            var imageObj = new Image();

            imageData = imageURI;
            imageObj.src = "data:image/png;base64," + imageURI;

            imageObj.onload = function () {
                context.drawImage(imageObj, 0, 0, 250, 280);
            };

            //   image.src = imageURI;
        }

        function CamOnFail(message) {
            alert('Failed because: ' + message);
        }
    });

    $j(document).on('click', '.naBtnDisable', function () {
        var qid = $j(this).attr("id");
        var id = qid.split("_");
        if ($j('#' + 'Text_' + id[1]).prop('disabled'))
            $('#' + 'Text_' + id[1]).prop('disabled', false);
        else
            $j('#' + 'Text_' + id[1]).prop('disabled', 'disabled');
    });

    function onError(response) {
        if (response.status == 404) {
            alert("Your internet connection is very slow");
        }
        else {
            alert("Error" + JSON.stringify(response)
                );
        }
        //  $j.mobile.loading('hide');
        $j.unblockUI();

    }


});

//pagebeforeshow event called before the pageby id- #storevisit loads
$(document).on('pageshow', "#storevisitpage", function (event, data) {
    var $j = jQuery.noConflict();

    $j("#createTaskFormForStoreVisit").validate({
        rules: {
            TaskVis: "required",
            StatusVis: "required",
            PriorityVis: "required",
            AssignToText: "required"
        },
        messages: {
            TaskVis: "Please enter subject",
            StatusVis: "Please select status",
            PriorityVis: "Please select priority",
            AssignToText: "Please select user"
        }
    });
    $j.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    var visitQuestObj = []; // to store the store visit responses
    var StoreVisitResumeResp; // to store Resume response object
    var surveyResponseId;
    var currentQuestion;
    var currentQuestionId;

    var StoreQList;
    var imageAttachmentVS = [];
    loadStoreVisitQuestions();


    function loadStoreVisitQuestions() {

        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Store Visit</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });

        $j("#StoreVisitQuestHead").html('Store Visit for Store ' + store.Name + '');

        // check internet connectivity
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {

            // var SvsurveyId = window.localStorage.getItem("SvSurveyIdKey");
            var SvsurveyId = SVActiveId;

            db.transaction(queryDB, errorCB);

            function queryDB(tx) {
                tx.executeSql('Select * from SurveyQuestions where Survey_ID__c="' + SvsurveyId + '" order by Question_Order__c', [], querySuccessQuest, errorCB);
            }

            function querySuccessQuest(tx, results) {
                var len = results.rows.length;
                StoreQList = results.rows.resultSet;
                console.log("### " + JSON.stringify(results.rows.resultSet));

                displaySVQuestions();
            }
        }
        else {
            forcetkClient.query("SELECT Id FROM Survey__c where Survey_Type__c='Store Visit' and Status__c='Active'", onsuccessVisitSurveyId, onError);
        }

        function onsuccessVisitSurveyId(response) {

            surveyId = response.records[0].Id;
            //Query to get list of all questions of survey type STORE VISIT
            var querystr = "Select Question_Text__c,Question_Options__c,Question_ID__c,Use_Criteria__c,Question_Group__c,\
                    Is_Required__c, Id,Survey_ID__c,Display_Type__c, RecordTypeId From Survey_Question__c\
                    where Survey_ID__c='" + surveyId + "' order by Question_Order__c";

            forcetkClient.query(querystr, ShowStoreVisitQuestionsOnSuccess, onError);

        }

        // Callback event onsucces to show the list of store visit questions
        function ShowStoreVisitQuestionsOnSuccess(response) {
            StoreQList = response.records;
            displaySVQuestions();
        }

        function displaySVQuestions() {
            var list = '';
            var listStar = '';
            var listCharge = '';
            var listCheckbox = '';
            var listLineItems = '';
            var listOverallSummary = '';

            $j("#storeVisitQuest").append('<ul class="list-group" data-role="listview" id="storeQli"></ul>');
            $j("#StarRatingQuest").append('<ul class="list-group" data-role="listview" id="storeRatingQli"></ul>');
            $j("#StoreCheckBoxQuest").append('<div class="col-md-12" data-role="listview" id="storeCheckQli"></div>');
            //     $j("#storeVisitQuest").trigger("create");

            $j.each(StoreQList, function (i, item) {
                if (visitQuestObj == null) {
                    console.log("visitQuestObj is undefined");
                    visitQuestObj = [{
                        "Id": item.Id, "value": "", "comments": "", "imageData": "", "Display_Type__c": item.Display_Type__c, "Question_Text__c": item.Question_Text__c,
                        "Question_ID__c": item.Question_ID__c, "Use_Criteria__c": item.Use_Criteria__c, "criterias": []
                    }];
                }
                else {
                    visitQuestObj.push({
                        "Id": item.Id, "value": "", "comments": "", "imageData": "", "Display_Type__c": item.Display_Type__c, "Question_Text__c": item.Question_Text__c,
                        "Question_ID__c": item.Question_ID__c, "Use_Criteria__c": item.Use_Criteria__c, "criterias": []
                    });
                }

                if (item.Display_Type__c == "Radio Button") {

                    var options = item.Question_Options__c.split("\n");
                    console.log("split values" + options[0].split(" ")[0] + "," + options[1].split(" ")[0] + "," + options[2].split(" ")[0]);

                    list += '<li class=\"list-group-item liRadioQuest\" data-role=\"fieldcontain\" id=\"' + item.Id + '\" opt=\"' + item.Display_Type__c + '\">\
                                                <fieldset class=\"toaddicon\" data-role=\"controlgroup\" data-type=\"horizontal\" data-mini=\"true\">\
                                                    <legend style=\"font-size:13px; border:none\">' + item.Question_Text__c + '</legend>\
                                                    <div class=\"col-md-3 col-sm-3 col-xs-4 padding_0\"><input type=\"radio\" class="radioOptionsclass" data-role="button"\
                                                        name=\"' + item.Id + '\" id=\"' + options[0].split(" ")[0] + '_' + item.Id + '\" value=\"' + options[0] + '\" />\
                                                    <label for=\"' + options[0].split(" ")[0] + '_' + item.Id + '\" class=\"leftRadio\">' + options[0] + '</label></div>\
                                                    <div class=\"col-md-3 col-sm-3 col-xs-4 padding_0\"><input type=\"radio\" class="radioOptionsclass" data-role="button"\
                                                        name=\"' + item.Id + '\" id=\"' + options[1].split(" ")[0] + '_' + item.Id + '\" value=\"' + options[1] + '\" />\
                                                    <label for=\"' + options[1].split(" ")[0] + '_' + item.Id + '\" class=\"centerRadio\">' + options[1] + '</label></div>\
                                                    <div class=\"col-md-3 col-sm-3 col-xs-4 padding_0\"><input type=\"radio\" class="radioOptionsclass" data-role="button"\
                                                        name=\"' + item.Id + '\" id=\"' + options[2].split(" ")[0] + '_' + item.Id + '\" value=\"' + options[2] + '\" />\
                                                    <label for=\"' + options[2].split(" ")[0] + '_' + item.Id + '\" class=\"rightRadio\">' + options[2] + '</label></div>\
                                                </fieldset>\
                                            </li>';

                }
                else if (item.Display_Type__c == "Drop Down Box") {
                    console.log("Drop down");
                    listStar += '<li class=\"list-group-item starListitem\">\
                                                <div class=\"row\">\
                                                    <div class=\"col-md-3 col-sm-4 col-xs-4\">\
                                                        <strong>\
                                                            <h4>' + item.Question_Text__c + ' :</h4>\
                                                        </strong>\
                                                    </div>\
                                                    <div style=\"padding-left:0px\" class=\"col-md-4 col-sm-4 col-xs-4 starImages\" id=\"' + item.Id + '\" opt=\"' + item.Display_Type__c + '\">\
                                                        <img class=\"starImg\" src=\"../www/Images/icons/icon-ratingStar-normal.png\" />\
                                                        <img class=\"starImg\" src=\"../www/Images/icons/icon-ratingStar-normal.png\" />\
                                                        <img class=\"starImg\" src=\"../www/Images/icons/icon-ratingStar-normal.png\" />\
                                                        <img class=\"starImg\" src=\"../www/Images/icons/icon-ratingStar-normal.png\" />\
                                                        <img class=\"starImg\" src=\"../www/Images/icons/icon-ratingStar-normal.png\" />\
                                                    </div>\
                                                    <div style=\"padding-left:0px\" class=\"starNA col-md-2 col-sm-1 col-xs-2\">\
                                                        <button type=\"button\" name=\"1na\" class=\"btn btn-default btnStarNA\">NA</button>\
                                                    </div>\
                                               <div class=\"col-md-2 col-sm-2 col-xs-2 toaddicon\">\
                                                </div>\
                                                </div>\
                                            </li>'
                }
                else if (item.Display_Type__c == "Text Box") {
                    console.log("store charge");
                    listCharge += ' <div class=\"form-group\">\
                                               <label for=\"' + item.Id + '\" class=\"col-md-2 control-label\">' + item.Question_Text__c + '</label>\
                                               <div class=\"col-md-4\">\
                                                   <input type=\"text\" class=\"form-control\" id=\"'+ item.Id + '\" placeholder=\"Enter the of Store in charge\">\
                                               </div>\
                                           </div>';
                }
                else if (item.Display_Type__c == "Checkbox") {
                    console.log("store check box");
                    listCheckbox += ' <div data-role=\"fieldcontain\" class=\"dicsussion\">\
                                            <fieldset class=\"toaddicon\" data-role=\"controlgroup\">\
                                              <div class=\"col-md-10 col-sm-10 col-xs-8\">\
                                                <input type=\"checkbox\" name=\"' + item.Id + '\" id=\"' + item.Id + '\" class=\"custom\" opt=\"' + item.Display_Type__c + '\" />\
                                               <label for=\"' + item.Id + '\">' + item.Question_Text__c + '\
                                                </label>\
                                              </div>\
                                            </fieldset>\
                                        </div>'
                }
                else if (item.Display_Type__c == "Number Input") {
                    console.log("store line items");
                    listLineItems += '<div class=\"col-md-6 col-sm-6\">\
                                                        <form class=\"form-horizontal\" role=\"form\">\
                                                            <div class=\"form-group\">\
                                                                <label for=\"' + item.Id + '\" class=\"col-md-4 control-label\">' + item.Question_Text__c + '</label>\
                                                                <div class=\"col-md-8\">\
                                                                    <input type=\"number\" class=\"form-control\" id=\"' + item.Id + '\" placeholder=\"Enter Seconds\">\
                                                                </div>\
                                                            </div>\
                                                        </form>\
                                                    </div>'
                }
                else if (item.Display_Type__c == "Text Area") {
                    console.log("store overall summary");
                    listOverallSummary += '<div class=\"row\">\
                                    <div class=\"col-md-12 historyHeaders\">\
                                        <h4>'+ item.Question_Text__c + '</h4>\
                                    </div>\
                                </div>\
                                <div class=\"row\">\
                                    <div class=\"col-md-12\">\
                                        <textarea rows=\"10\" cols=\"20\" id=\"'+ item.Id + '\" style=\"width:100%;height: 200px\"></textarea>\
                                    </div>\
                                </div>'
                }

            });

            $j(".radioclass").button().button('refresh');
            $j("#storeQli").append(list);
            $j("#storeRatingQli").append(listStar);
            $j("#StoreChargeQuest").append(listCharge);
            $j("#storeCheckQli").append(listCheckbox);
            $j("#StoreLineQuest").append(listLineItems);
            $j("#StoreOveralSummaryQuest").append(listOverallSummary);


            // for refreshing elements to apply css
            $j("input[type='radio']").checkboxradio().checkboxradio("refresh");
            $j("input[type='checkbox']").checkboxradio().checkboxradio("refresh");
            //$j("input[type='textbox']").textinput().textinput("refresh");
            //$j("textarea").textinput().textinput("refresh");
            //$j('#StoreVisitContent').trigger('create');
            console.log("$$$ Visit object" + JSON.stringify(visitQuestObj));

            // $j.mobile.loading('hide'); //stop Loading Store Visit
            $j.unblockUI();

            if (actionVisit == "start") {
                //$j.mobile.loading('show', {
                //    text: 'Starting your Survey',
                //    textVisible: true,
                //    //theme:theme,
                //    html: ""
                //});
                $j.blockUI({
                    message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Starting your Survey</h4>',
                    css: {
                        color: '#78604F', border: 'none',
                        '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                    }
                });

                getGeolocation();
                var cnt = 0;
                checkGeoVariable();

                function checkGeoVariable() {
                    if (geoLocation != null) {
                        if (geoLocation == "NoGPS") {
                            alert("Please enable 'Use wireless networks' option in 'Location and Security' settings");
                            $j.mobile.back();
                        }
                        else {
                            StoreVisitStart();
                        }
                    }
                    else {
                        cnt++;
                        if (cnt < 30)
                            window.setTimeout(checkGeoVariable, 100);
                        else {
                            alert("Problem fetching Geolocation.. ");
                            $j.mobile.back();
                        }
                    }
                }
            }
            else
                StoreVisitResume();
        }

        //function ShowStoreVisitQuestionsOnError() {
        //    alert("Error loading Store Visit Questions");
        //}

    }

    var contype = checkInternetConnectivity();

    if (contype == 'No network connection') {
        $j("#AddTaskBtnVis").attr("disabled", "disabled");
        $j("#createTaskFormForStoreVisit").attr("disabled", "disabled");
        $j("#TaskActionHeader").append("<h6>Task Cannot be added in offline mode</h6>")
    }
    else {
        loadUsers();
    }

    function loadUsers() {
        //$j.mobile.loading('show', {
        //    text: 'Loading Users',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});

        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });
        forcetkClient.query("SELECT Id,Alias,City,CommunityNickname,CompanyName,Country,Email,\
                FirstName,Name,Username,IsActive FROM User where IsActive=true", onsuccessListUsers, onError);

        function onsuccessListUsers(response) {
            var list = '';

            //$j("#assignTocontent").append("<ul id='assignToList' data-role='listview' data-autodividers='true' data-inset='true' data-filter='true' data-filter-placeholder='Search...'></ul>");
            //$j("#assignTocontent").trigger("create");
            $j.each(response.records, function (i, item) {

                list += '<tr id="' + item.Id + '"class="AssigntToUserRow">\
                        <td>' + item.FirstName + '</td>\
                        <td>' + item.Email + '</td>\
                     </tr>';

            });

            //var tableHead=' <table class=\"table table-striped\" style=\"border-top-width: 1.5px\" id=\"tableForAssignToUsers\">\
            //                    <thead class=\"tableHeadGrad\">\
            //                        <tr>\
            //                            <th class=\"col-md-6 col-sm-6\">Name</th>\
            //                            <th class=\"col-md-6 col-sm-6\">Email</th>\
            //		                </tr>\
            //                    </thead>\
            //                    <tbody id=\"tbodyforAssignToUsers\">\
            //                    </tbody>\
            //                </table>'

            //$j("assignToList").append("tableHead");
            //$j("#assignToList").listview("refresh");
            $j("#tbodyforAssignToUsers").append(list);

            // $j.mobile.loading('hide');
            $j.unblockUI();
            $j('table').filterTable();
        }
    }

    function StoreVisitStart() {

        var contype = checkInternetConnectivity();

        if (contype == 'No network connection') {
            // create response locally
            db.transaction(createResponse, errorCB, successcreateResponse);

            function createResponse(tx) {
                var sid = "Store Visit_" + store.Id;
                surveyResponseId = sid;
                var geo = { "latitude": geoLocation.latitude, "longitude": geoLocation.longitude };
                tx.executeSql('INSERT INTO SurveyResponses (Id,Store__c,SurveyType,Score__c,Name,Survey_Start_Datetime__c,Survey_End_Datetime__c,Survey_Status__c,StartGeoLatitude,StartGeoLongitude)\                            VALUES ("' + surveyResponseId + '","' + store.Id + '","Store Visit",\                            "' + null + '","' + null + '","' + new Date() + '","' + null + '","In Draft","' + geoLocation.latitude + '","' + geoLocation.longitude + '")');
            }
            function successcreateResponse() {
                console.log("@@@ ## successfully created response");
                // $j.mobile.loading('hide');  // stop loading survey
                $j.unblockUI();
            }
        }
        else {

            var fields = {};
            fields.Store__c = store.Id;
            //surveyId = response.records[0].Id;
            fields.Survey__c = surveyId;
            fields.Survey_Status__c = "In Draft";
            fields.Survey_Start_Datetime__c = new Date();

            fields.User__c = userId;

            fields.Survey_Start_Geolocation__latitude__s = geoLocation.latitude;
            fields.Survey_Start_Geolocation__longitude__s = geoLocation.longitude;

            console.log("******Fields:  " + JSON.stringify(fields));
            forcetkClient.create("Survey_Response__c", fields, callbackGetResponseId, onError);
        }

        //  }

        function callbackGetResponseId(response) {
            surveyResponseId = response.id;

            // create response locally
            db.transaction(createResponse1, errorCB, successcreateResponse1);

            function createResponse1(tx) {
                tx.executeSql('INSERT INTO SurveyResponses (Id,Store__c,SurveyType,Score__c,Name,Survey_End_Datetime__c,Survey_Status__c)\                            VALUES ("' + surveyResponseId + '","' + store.Id + '","Store Visit",\                            "' + null + '","' + null + '","' + null + '","In Draft")');
            }
            function successcreateResponse1() {
                console.log("@@@ ## successfully created response");
            }

            // $j.mobile.loading('hide');  // stop loading survey
            $j.unblockUI();
        }
    }

    function StoreVisitResume() {

        //$j.mobile.loading('show', {
        //    text: 'Resuming your Survey',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});      
        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Resuming your Survey</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });

        surveyResponseId = surveyVisitInDraftId;

        var contype = checkInternetConnectivity();

        if (contype == 'No network connection') {
            db.transaction(queryDB, errorCB);

            function queryDB(tx) {
                tx.executeSql("SELECT Comment__c,Criteria__c,Id,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c\
            FROM SurveyAnswers where Survey_Response__c='" + surveyResponseId + "'", [], querySuccess1, errorCB);
            }

            function querySuccess1(tx, results) {
                console.log("### results answers" + JSON.stringify(results))
                var len = results.rows.length;
                StoreVisitResumeResp = results.rows.resultSet;
                resumeAnswersStoreVisit();
            }
        }
        else {
            forcetkClient.query(" SELECT Comment__c,Criteria__c,Id,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,Survey_Question__c,Survey_Response__c,Type_of_Data__c\
            FROM Survey_Answer__c a, a.Survey_Question__r where Survey_Response__c='" + surveyVisitInDraftId + "'", onsuccessResumeVisit, onError);
        }

        function onsuccessResumeVisit(response) {
            StoreVisitResumeResp = response.records;
            console.log("$$$response visit" + JSON.stringify(StoreVisitResumeResp));

            $j.each(StoreVisitResumeResp, function (i, item) {
                forcetkClient.query("Select Id, ParentId From Attachment where ParentId='" + item.Id + "'", onSuccessParentId, onError);
                function onSuccessParentId(response) {
                    console.log("response attachment id and parent" + JSON.stringify(response));
                    $j.each(response.records, function (i, aitem) {
                        //forcetkClient.retrieveBlobField("Attachment", "00Pc0000000n7hLEAQ", "Body",
                        forcetkClient.retrieveBlobField("Attachment", aitem.Id, "Body", insertImageAttachment, onError);

                        function insertImageAttachment(response) {
                            console.log("attachment response from retrieve blob field:" + JSON.stringify(response));
                            var base64data = base64ArrayBuffer(response);
                            //$j('#imageid').attr('src', "data:image/png;base64," + base64data);
                            //if (imageAttachment == null) {
                            imageAttachmentVS.push({ "ParentId": aitem.ParentId, "QuesId": item.Survey_Question__c, "ImageData": "data:image/png;base64," + base64data });
                            //}
                            //console.log("ImageAttachment" + JSON.stringify(imageAttachment));

                        }
                    });
                }
                //function OnError(response) {
                //    alert(JSON.stringify(response));
                //}
            });
            resumeAnswersStoreVisit();
        }

        function resumeAnswersStoreVisit() {
            console.log("@@@@ StoreVisitResumeResp " + StoreVisitResumeResp);
            $j.each(StoreVisitResumeResp, function (i, item) {
                if (item.Type_of_Data__c == "Radio Button") {
                    console.log("Radio Button " + JSON.stringify(item));
                    if (item.Response__c != null) {
                        var id = item.Response__c.split(" ")[0] + "_" + item.Survey_Question__c;
                        $j("input[id='" + id + "']").attr("checked", "checked");
                        $j("input[id='" + id + "']").checkboxradio().checkboxradio("refresh");
                    }
                }
                else if (item.Type_of_Data__c == "Number Input") {
                    console.log("Number Input " + JSON.stringify(item));
                    $j("[id*='" + item.Survey_Question__c + "']:input").val(item.Response__c);
                }
                else if (item.Type_of_Data__c == "Text Box") {
                    console.log("Text Box " + JSON.stringify(item));
                    $j("[id*='" + item.Survey_Question__c + "']:input").val(item.Response__c);
                }
                else if (item.Type_of_Data__c == "Checkbox") {
                    console.log("Checkboxn " + JSON.stringify(item));
                    if (item.Response__c == "true") {
                        $j("input[id='" + item.Survey_Question__c + "']").attr("checked", "checked");
                        $j("input[id='" + item.Survey_Question__c + "']").checkboxradio().checkboxradio("refresh");
                    }
                }
                else if (item.Type_of_Data__c == "Drop Down Box") {
                    var pointsResp = item.Response__c;
                    $j("#" + item.Survey_Question__c).data("Rating", { points: pointsResp });
                    if (pointsResp == "NA") {
                        $j("#" + item.Survey_Question__c).parent().find(".starNA").children().removeClass("btn-default").addClass("btn-primary");
                        // var len = $j("#" + item.Survey_Question__c).children.length;
                        for (var j = 0; j < 5; j++) {
                            console.log("IN" + j);
                            $j("#" + item.Survey_Question__c).children().eq(j).attr("src", "../www/Images/icons/icon-ratingStar-normal.png");
                            $j("#" + item.Survey_Question__c).children().eq(j).removeClass("starImg");
                            // obj.src = "../www/Images/icons/icon-ratingStar-normal.png";
                            //  obj.className = "";
                        }
                    }
                    else {
                        for (var i = 0; i < pointsResp; i++) {
                            $j("#" + item.Survey_Question__c).children().eq(i).attr("src", "../www/Images/icons/icon-ratingStar-pressed.png");
                        }
                    }
                }
                else if (item.Type_of_Data__c == "Text Area") {
                    $j("#" + item.Survey_Question__c).val(item.Response__c);
                }

                if (contype == 'No network connection') {
                    if (item.Comment__c != "") {
                        console.log("no con $$$$ " + item.Comment__c);
                        $j("#" + item.Survey_Question__c).data("commentObj", { comment: item.Comment__c });
                        if (item.Type_of_Data__c == "Checkbox") {
                            var src = $j("#" + item.Survey_Question__c).closest("fieldset").find("img").attr("src");
                            if (src != "../www/Images/icons/icon-commentAdded.png") {
                                $j("#" + item.Survey_Question__c).closest("fieldset").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                            }
                        }
                        if (item.Type_of_Data__c == "Drop Down Box") {
                            var src = $j("#" + item.Survey_Question__c).parent().find(".toaddicon").find("img").attr("src");
                            if (src != "../www/Images/icons/icon-commentAdded.png") {
                                $j("#" + item.Survey_Question__c).parent().find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                            }
                        }
                        if (item.Type_of_Data__c == "Radio Button") {
                            var src = $j("#" + item.Survey_Question__c).find(".toaddicon").find("img").attr("src");
                            if (src != "../www/Images/icons/icon-commentAdded.png") {
                                $j("#" + item.Survey_Question__c).find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                            }
                        }
                    }
                }
                else {
                    if (item.Comment__c != null) {
                        console.log("@@@@###### " + item.Comment__c);
                        $j("#" + item.Survey_Question__c).data("commentObj", { comment: item.Comment__c });
                        if (item.Type_of_Data__c == "Checkbox") {
                            var src = $j("#" + item.Survey_Question__c).closest("fieldset").find("img").attr("src");
                            if (src != "../www/Images/icons/icon-commentAdded.png") {
                                $j("#" + item.Survey_Question__c).closest("fieldset").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                            }
                        }
                        if (item.Type_of_Data__c == "Drop Down Box") {
                            var src = $j("#" + item.Survey_Question__c).parent().find(".toaddicon").find("img").attr("src");
                            if (src != "../www/Images/icons/icon-commentAdded.png") {
                                $j("#" + item.Survey_Question__c).parent().find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                            }
                        }
                        if (item.Type_of_Data__c == "Radio Button") {
                            var src = $j("#" + item.Survey_Question__c).find(".toaddicon").find("img").attr("src");
                            if (src != "../www/Images/icons/icon-commentAdded.png") {
                                $j("#" + item.Survey_Question__c).find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                            }
                        }
                    }

                    checkVariableImageAttachnmentVS();
                    function checkVariableImageAttachnmentVS() {
                        if (imageAttachmentVS.length == 0) {
                            // console.log("imageattachment length: " + imageAttachmentVS.length);
                            window.setTimeout(checkVariableImageAttachnmentVS, 100);
                        }
                        else {
                            checkForCameraIcons();
                        }
                    }
                    function checkForCameraIcons() {
                        $j.each(imageAttachmentVS, function (i, aitem) {
                            if (aitem.QuesId == item.Survey_Question__c) {

                                if (item.Type_of_Data__c == "Checkbox") {
                                    var src = $j("#" + item.Survey_Question__c).closest("fieldset").find("img").attr("src");
                                    if (src != "../www/Images/icons/icon-photoAdded.png") {
                                        $j("#" + item.Survey_Question__c).closest("fieldset").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                                    }
                                }
                                if (item.Type_of_Data__c == "Drop Down Box") {
                                    var src = $j("#" + item.Survey_Question__c).parent().find(".toaddicon").find("img").attr("src");
                                    if (src != "../www/Images/icons/icon-photoAdded.png") {
                                        $j("#" + item.Survey_Question__c).parent().find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                                    }
                                }
                                if (item.Type_of_Data__c == "Radio Button") {
                                    var src = $j("#" + item.Survey_Question__c).find(".toaddicon").find("img").attr("src");
                                    if (src != "../www/Images/icons/icon-photoAdded.png") {
                                        $j("#" + item.Survey_Question__c).find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                                    }
                                }
                            }
                        });
                    }
                }
            });
            // $j.mobile.loading('hide');  // stop resuming store visit
            $j.unblockUI();
        }
    }

    // nav tabs click event
    $j(document).off('vclick', '.StoreVisitNavLi').on('vclick', '.StoreVisitNavLi', function () {

        $j(".imgNavStoreVisit").each(function () {
            console.log("inside" + $j(this).attr("src"));
            var src = $j(this).attr("src");
            var newsrc = src.replace("pressed", "normal");
            $j(this).attr("src", newsrc);
        });

        var src = $j(this).find("img").attr("src");
        var newsrc = src.replace("normal", "pressed");
        $j(this).find("img").attr("src", newsrc);

        currentQuestion = null;
        currentQuestionId = null;
        $j("#visitComImg").attr("src", "../www/Images/icons/icon-addComment-normal.png");
        $j("#visitComImg").parent().attr("href", "");
        $j("#visitCamImg").attr("src", "../www/Images/icons/icon-addPhoto-normal.png");
        $j("#visitCamImg").parent().attr("href", "");
    });

    $j(document).off('vclick', '.siteNextBtn').on('vclick', '.siteNextBtn', function () {

        $j(".imgNavStoreVisit").each(function () {
            var src = $j(this).attr("src");
            var newsrc = src.replace("pressed", "normal");
            $j(this).attr("src", newsrc);
        });

        var id = $j(this).attr("id");
        var ind = id.split("_");
        $j("#SiteUlTabs li").eq(ind[0]).addClass('active').siblings().removeClass('active');

        var src = $j("#SiteUlTabs li").eq(ind[0]).find("img").attr("src");
        var newsrc = src.replace("normal", "pressed");
        $j("#SiteUlTabs li").eq(ind[0]).find("img").attr("src", newsrc);

        currentQuestion = null;
        currentQuestionId = null;
        $j("#visitComImg").attr("src", "../www/Images/icons/icon-addComment-normal.png");
        $j("#visitComImg").parent().attr("href", "");
        $j("#visitCamImg").attr("src", "../www/Images/icons/icon-addPhoto-normal.png");
        $j("#visitCamImg").parent().attr("href", "");
    });

    $j(document).off('vclick', '.siteBackBtn').on('vclick', '.siteBackBtn', function () {
        $j(".imgNavStoreVisit").each(function () {
            var src = $j(this).attr("src");
            var newsrc = src.replace("pressed", "normal");
            $j(this).attr("src", newsrc);
        });

        var id = $j(this).attr("id");
        var ind = id.split("_");
        $j("#SiteUlTabs li").eq(ind[0]).addClass('active').siblings().removeClass('active');

        var src = $j("#SiteUlTabs li").eq(ind[0]).find("img").attr("src");
        var newsrc = src.replace("normal", "pressed");
        $j("#SiteUlTabs li").eq(ind[0]).find("img").attr("src", newsrc);

        currentQuestion = null;
        currentQuestionId = null;
        $j("#visitComImg").attr("src", "../www/Images/icons/icon-addComment-normal.png");
        $j("#visitComImg").parent().attr("href", "");
        $j("#visitCamImg").attr("src", "../www/Images/icons/icon-addPhoto-normal.png");
        $j("#visitCamImg").parent().attr("href", "");
    });

    // event fired when checkbox is clicked
    $j(document).off('change', 'input[type="checkbox"]').on('change', 'input[type="checkbox"]', function () {

        $j(this).closest('#StoreVisitContent').find(".dicsussion").removeClass('activ');
        $j(this).closest("#StoreVisitContent").find(".liRadioQuest").removeClass('activ');
        $j(this).closest(".dicsussion").addClass('activ');

        currentQuestion = $j(this).parent()[0].innerText;
        currentQuestionId = $j(this).attr("id");

        $j("#visitComImg").attr("src", "../www/Images/icons/icon-addComment-press.png");
        $j("#visitComImg").parent().attr("href", "#commentPopupVis");
        $j("#visitCamImg").attr("src", "../www/Images/icons/icon-addPhoto-press.png");
        $j("#visitCamImg").parent().attr("href", "#camPopupVis");

    });

    // event fired when radio btn clicked
    $j(document).off('change', 'input[type="radio"]').on('change', 'input[type="radio"]', function () {

        $j(this).closest('#StoreVisitContent').find(".dicsussion").removeClass('activ');
        $j(this).closest("#StoreVisitContent").find(".liRadioQuest").removeClass('activ');
        $j(this).closest(".liRadioQuest").addClass('activ');

        currentQuestion = $j(this).closest(".liRadioQuest").find("legend").text();
        currentQuestionId = $j(this).attr("id").split("_")[1];

        $j("#visitComImg").attr("src", "../www/Images/icons/icon-addComment-press.png");
        $j("#visitComImg").parent().attr("href", "#commentPopupVis");
        $j("#visitCamImg").attr("src", "../www/Images/icons/icon-addPhoto-press.png");
        $j("#visitCamImg").parent().attr("href", "#camPopupVis");

    });

    // event fired when star list item is clicked
    $j(document).off('vclick', '.starListitem').on('vclick', '.starListitem', function () {
        $j(this).siblings().css("background-color", "#FFFFFF");
        $j(this).css("background-color", "#E0EEE0");

        currentQuestion = $j(this).children().children()[0].innerText;
        currentQuestionId = $j(this).children().children(".starImages").attr("id");

        $j("#visitComImg").attr("src", "../www/Images/icons/icon-addComment-press.png");
        $j("#visitComImg").parent().attr("href", "#commentPopupVis");
        $j("#visitCamImg").attr("src", "../www/Images/icons/icon-addPhoto-press.png");
        $j("#visitCamImg").parent().attr("href", "#camPopupVis");
    });

    //Event fired whwn star image is clicked
    $j(document).off('vclick', '.starImg').on('vclick', '.starImg', function () {
        var ind = $j(this).index();
        var parent = $j(this).parent();
        var ratingPoints;

        for (var i = 1; i < 5; i++) {
            parent.children().eq(i).attr("src", "../www/Images/icons/icon-ratingStar-normal.png")
        }

        if (ind == 0) {
            if (parent.children().eq(ind).attr("src") == "../www/Images/icons/icon-ratingStar-normal.png") {
                parent.children().eq(ind).attr("src", "../www/Images/icons/icon-ratingStar-pressed.png");
                ratingPoints = 1;
            }
            else {
                parent.children().eq(ind).attr("src", "../www/Images/icons/icon-ratingStar-normal.png");
                ratingPoints = 0;
            }
        }
        else {
            for (var i = 0; i <= ind; i++) {
                parent.children().eq(i).attr("src", "../www/Images/icons/icon-ratingStar-pressed.png");
                ratingPoints = ind + 1;
            }
        }

        $j(this).parent().data("Rating", { points: ratingPoints });
        console.log("%%id is" + $j(this).parent().attr("id") + " data is" + $j(this).parent().data("Rating").points);
    });

    //Event fired when NA button for stars is clicked to DISABLE STAR rating
    $j(document).off('vclick', '.btnStarNA').on('vclick', '.btnStarNA', function () {

        var len = $j(this).parent().siblings()[1].children.length;
        if ($j(this).hasClass("btn-primary")) {
            $j(this).removeClass("btn-primary").addClass("btn-default");
            for (var i = 0; i < len; i++) {
                var obj = $j(this).parent().siblings()[1].children[i];
                obj.className = "starImg";
            }
            $j(this).parent().parent().find(".starImages").removeData("Rating");
        }
        else {
            $j(this).removeClass("btn-default").addClass("btn-primary");
            for (var i = 0; i < len; i++) {
                var obj = $j(this).parent().siblings()[1].children[i];
                obj.src = "../www/Images/icons/icon-ratingStar-normal.png";
                obj.className = "";
            }
            $j(this).parent().parent().find(".starImages").data("Rating", { points: "NA" });
        }
    });

    var visitObj = {}; // object to store the storevisit saved response

    //Function to store the responses of Store visit 
    //called on click of save button
    $j(document).off('vclick', '#StoreVisitSave').on('vclick', '#StoreVisitSave', function () {
        var valuesForVisitQues;
        var fields;

        //$j.mobile.loading('show', {
        //    text: 'Saving your Response',
        //    textVisible: true,
        //    //theme:theme,
        //    html: ""
        //});

        $j.blockUI({
            message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Saving your response</h4>',
            css: {
                color: '#78604F', border: 'none',
                '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            }
        });

        var contype = checkInternetConnectivity();

        $j.each(visitQuestObj, function (i, item) {
            if (item.Display_Type__c == "Radio Button") {
                if (!$j("input[name='" + item.Id + "']:checked").val()) {
                    console.log('Nothing is checked!');
                }
                else {
                    valuesForVisitQues = $j("[id*='" + item.Id + "']:checked");
                    item.value = valuesForVisitQues[0].value;
                }
            }
            else if (item.Display_Type__c == "Number Input") {
                valuesForVisitQues = $j("[id*='" + item.Id + "']:input");
                item.value = valuesForVisitQues[0].value;
            }
            else if (item.Display_Type__c == "Text Box") {
                valuesForVisitQues = $j("[id*='" + item.Id + "']:input");
                item.value = valuesForVisitQues[0].value;
            }
            else if (item.Display_Type__c == "Checkbox") {
                if ($j('#' + item.Id).is(':checked'))
                    item.value = true;
                else
                    item.value = false;

            }
            else if (item.Display_Type__c == "Drop Down Box") {
                if (typeof $j("#" + item.Id).data("Rating") != "undefined")
                    item.value = $j("#" + item.Id).data("Rating").points;
            }
            else if (item.Display_Type__c == "Text Area") {
                item.value = $j("#" + item.Id).val();

            }
            // for storing comments
            if (typeof $j("#" + item.Id).data("commentObj") != "undefined")
                item.comments = $j("#" + item.Id).data("commentObj").comment;

            //for storing image data
            if (typeof $j("#" + item.Id).data("Image") != "undefined")
                item.imageData = $j("#" + item.Id).data("Image").imageData;
        });

        // console.log("$$$visit Obj is" + JSON.stringify(visitObj));
        console.log("$$$visit QUES Obj is" + JSON.stringify(visitQuestObj));

        console.log("$$$ Resume Obj is" + JSON.stringify(StoreVisitResumeResp));

        $j.each(visitQuestObj, function (i, q) {
            fields = {};
            fields.Response__c = q.value;
            fields.Comment__c = q.comments;
            var isupdated = false;

            if (actionVisit == "resume") {

                $j.each(StoreVisitResumeResp, function (i, item) {

                    if (q.Id == item.Survey_Question__c) {
                        //  console.log("$$$ fields found" + JSON.stringify(fields));
                        if (contype == 'No network connection') { }
                        else {
                            forcetkClient.upsert("Survey_Answer__c", "Id", item.Id, fields, function (response) {

                                // for attaching image
                                if (q.imageData != "") {
                                    forcetkClient.query("Select Id, ParentId From Attachment where ParentId='" + item.Id + "'", onsuccessAttachment, onError);
                                    function onsuccessAttachment(response) {
                                        var Camfields = {};
                                        Camfields.Body = q.imageData;
                                        if (response.totalSize == 0) {
                                            Camfields.Name = "image_" + q.Id;
                                            Camfields.ParentId = item.Id;
                                            forcetkClient.create("Attachment", Camfields, onsuccessAttached, onError);
                                            imageAttachmentVS.push({ "ParentId": item.Id, "QuesId": q.Id, "ImageData": q.imageData });
                                        }
                                        else {
                                            forcetkClient.upsert("Attachment", "Id", response.records[0].Id, Camfields, onsuccessAttached, onError);
                                            var flag = false;
                                            $j.each(imageAttachmentVS, function (i, image) {
                                                //console.log("item criteria" + item.CriteriaId + " Selected Criteria " + sel_criteria);                                                        
                                                if (image.ParentId == item.Id) {
                                                    image.ImageData = q.imageData;
                                                    flag = true;
                                                }
                                            });
                                            if (flag == false) {
                                                imageAttachmentVS.push({ "ParentId": item.Id, "QuesId": q.Id, "ImageData": q.imageData });
                                            }
                                        }
                                        function onsuccessAttached() {
                                            alert("Image Attached");
                                        }
                                    }
                                }

                                if (response != null) {
                                    console.log("answer updated..");
                                }
                            }, onError);


                        }

                        // update locally
                        db.transaction(updateDB, errorCB, successupdateDB);

                        function updateDB(tx) {
                            tx.executeSql('UPDATE SurveyAnswers SET Response__c = "' + fields.Response__c + '" WHERE Id ="' + item.Id + '"');
                        }
                        function successupdateDB() {
                            console.log("@@@ ## successfully UPDATED");
                        }

                        isupdated = true;
                    }
                });
            }

            if (isupdated == false) {

                fields.Survey_Response__c = surveyResponseId;
                fields.Survey_Question__c = q.Id;

                if (fields.Response__c != "") {
                    console.log("#####@@@@@$$%%% Answr response " + fields.Response__c);
                    if (contype == 'No network connection') {
                        // insert locally without ID 
                        db.transaction(insertDB, errorCB, successInsertDB);

                        function insertDB(tx) {
                            var answerId = surveyResponseId + "_" + fields.Survey_Question__c;
                            tx.executeSql('INSERT INTO SurveyAnswers (Id,Comment__c,Criteria__c,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,\                                    Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c) VALUES ("' + answerId + '","' + fields.Comment__c + '","' + null + '",\                                    "' + null + '","' + null + '","' + q.Question_Text__c.replace(/"/g, "") + '","' + fields.Response__c + '","' + null + '",\
                                    "' + fields.Survey_Question__c + '","' + fields.Survey_Response__c + '","' + q.Display_Type__c + '","' + null + '")');
                        }
                        function successInsertDB() {
                            console.log("successfully inserted");
                        }
                    }
                    else {
                        var fieldsLocal = {};
                        fieldsLocal.Survey_Response__c = surveyResponseId;
                        fieldsLocal.Survey_Question__c = q.Id;
                        fieldsLocal.Response__c = q.value;
                        fieldsLocal.Comment__c = q.comments;

                        forcetkClient.create("Survey_Answer__c", fields, function (response) {
                            console.log("Survey Answer Response: " + JSON.stringify(response));

                            // insert locally with ID
                            db.transaction(insertDBID, errorCB, successInsertDBID);

                            function insertDBID(tx) {
                                console.log("#####@@@@@$$%%% INSIDE Answr response " + fieldsLocal.Response__c);
                                tx.executeSql('INSERT INTO SurveyAnswers (Id,Comment__c,Criteria__c,IsDeleted,Name,Question__c,Response__c,Survey_Question_Criteria__c,\                                    Survey_Question__c,Survey_Response__c,Type_of_Data__c,Question_Group__c) VALUES ("' + response.id + '","' + fieldsLocal.Comment__c + '","' + null + '",\                                    "' + null + '","' + null + '","' + q.Question_Text__c.replace(/"/g, "") + '","' + fieldsLocal.Response__c + '","' + null + '",\
                                    "' + fieldsLocal.Survey_Question__c + '","' + fieldsLocal.Survey_Response__c + '","' + q.Display_Type__c + '","' + null + '")');
                            }
                            function successInsertDBID() {
                                console.log("successfully inserted");
                            }

                            // for attaching image
                            if (q.imageData != "") {
                                var Camfields = {};
                                Camfields.Body = q.imageData;
                                Camfields.Name = "image_" + q.Id;
                                Camfields.ParentId = response.id;
                                forcetkClient.create("Attachment", Camfields, onsuccessAttached, onError);
                                imageAttachmentVS.push({ "ParentId": response.id, "QuesId": q.Id, "ImageData": q.imageData });
                                function onsuccessAttached() {
                                    alert("image attached");
                                }
                            }
                        }, onError);
                    }

                }


                //forcetkClient.upsert("Survey_Answer__c", null, null, fields, function (response) { console.log(JSON.stringify(response)); c.SurveyAnswerId = response.id}, onError);                   
            }

        });

        // $j.mobile.loading('hide');
        setTimeout(function () {
            $j.unblockUI();
            alert("Store Visit Saved Successfully");
        }, 3000);


        //   $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });

        //storeVisitObjLocally();
        //storeVisitResponseLocally();
        //storeVisitQuestObjLocally();

        //   saveAnswerResponses();
    });

    function callbackcreateVisit(response) {
        console.log("@@@visit response created" + JSON.stringify(response));
    }

    $j(document).off('vclick', '#AddTaskBtnVis').on('vclick', '#AddTaskBtnVis', function () {
        if ($j("#createTaskFormForStoreVisit").valid()) {

            //$j.mobile.loading('show', {
            //    text: 'Adding New Task',
            //    textVisible: true,
            //    //theme:theme,
            //    html: ""
            //});
            $j.blockUI({
                message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Adding New Task</h4>',
                css: {
                    color: '#78604F', border: 'none',
                    '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
                }
            });

            var task = $j("#TaskVis").val();
            var DueDate = $j("#DueDateVis").val();
            var Description = $j("#DescriptionVis").val();
            var Priority = $j("#PriorityVis").val();
            var Status = $j("#StatusVis").val();

            var fields = {};
            // fields.AccountId = store.Id;

            fields.Subject = task;
            fields.OwnerId = AssignToUserId;  // Assigned to
            //  fields.WhoId = userId;  // Who created

            if (actionVisit == "start")
                fields.WhatId = surveyResponseId;  //Related to what kind of task
            else
                fields.WhatId = surveyVisitInDraftId;  //Related to what kind of task


            fields.Description = Description;
            fields.ActivityDate = new Date(DueDate);
            fields.Priority = Priority;
            fields.Status = Status;

            console.log("******Fields:  " + JSON.stringify(fields));
            forcetkClient.create("Task", fields, callbackGetResponseTaskId, onError);


            function callbackGetResponseTaskId(response) {
                $j("#TaskVis").val("");
                $j("#DueDateVis").val("");
                $j("#DescriptionVis").val("");
                $j("#PriorityVis").val("Normal");
                $j("#StatusVis").val("Not Started");
                $j("#AssignToText").val("");
                alert("Task Created successfully");
                // $j.mobile.loading('hide'); // hide loading add new task
                $j.unblockUI();
            }

            //var strToAppend = "<div class=\"row\">\
            //                                <div class=\"panel-default panel\" style=\"margin: 5px\">\
            //                                    <div class=\"panel-body grey-bold\">\
            //                                        <a href=\"#commentPopupVis\" class=\"pull-right\" data-rel=\"popup\" data-position-to=\"window\">\
            //                                         <img id=\"TaskVisitDelImg\" src=\"../www/Images/icons/btn-remove.png\"/></a>\
            //                            <div class=\"col-md-12\">\
            //                                        <div class=\"col-md-6\">\
            //                                            <div data-role=\"fieldcontain\">\
            //                                                <div class=\"col-md-6\"><label>Task:</label></div>\
            //                                                <div class=\"col-md-6\"><label>" + task + "</label></div>\
            //                                            </div>\
            //                                            <div data-role=\"fieldcontain\">\
            //                                                <div class=\"col-md-6\"><label>Due Date:</label></div>\
            //                                                <div class=\"col-md-6\"><label>" + DueDate + "</label></div>\
            //                                            </div>\
            //                                        </div>\
            //                                        <div class=\"col-md-6\">\
            //                                            <div data-role=\"fieldcontain\">\
            //                                                <div class=\"col-md-6\"><label>Description:</label></div>\
            //                                                <div class=\"col-md-6\"><label>" + Description + "</label></div>\
            //                                            </div>\
            //                                        </div>\
            //                                        <div class=\"col-md-4\">\
            //                                            <div data-role=\"fieldcontain\">\
            //                                               <div class=\"col-md-6\"><label>Priority:</label></div>\
            //                                                <div class=\"col-md-6\"><label>" + Priority + "</label></div>\
            //                                            </div>\
            //                                        </div>\
            //                                        <div class=\"col-md-4\">\
            //                                            <div data-role=\"fieldcontain\">\
            //                                                <div class=\"col-md-6\"><label>Status:</label></div>\
            //                                                <div class=\"col-md-6\"><label>" + Status + "</label></div>\
            //                                            </div>\
            //                                        </div>\
            //                                        <div class=\"col-md-4\">\
            //                                            <div data-role=\"fieldcontain\">\
            //                                                <div class=\"col-md-6\"><label>Assign To:</label></div>\
            //                                                <div class=\"col-md-6\"><label></label></div>\
            //                                            </div>\
            //                                        </div>\
            //                                    </div>\
            //                                </div>\
            //                            </div>\
            //                        </div>";

            //$j("#taskVisAdd").prepend(strToAppend);
        }
    });

    $j("#DueDateVis").datepicker({
        minDate: new Date(),
        onClose: function (dateText, inst) {

            //  $j(this).attr('type', "text");
        },
        beforeShow: function (input, inst) {
            $j.datepicker._pos = $j.datepicker._findPos(input); //this is the default position
            $j.datepicker._pos[0] = 0;
            $j.datepicker._pos[1] = 150; //top
        }
    });

    var AssignToUserId;
    var AssignToUserName;

    $j(document).off('vclick', '.AssigntToUserRow').on('vclick', '.AssigntToUserRow', function () {
        AssignToUserId = $j(this).attr("id");
        AssignToUserName = $j(this).children()[0].innerText;
        $j(this).parent().parent().css("background-color", "#E0EEE0");
        $j(this).siblings().css("background-color", "#FFFFFF");
        $j(this).css("background-color", "#E0EEE0");
    });

    $j(document).off('vclick', '#btnAssignToAddUser').on('vclick', '#btnAssignToAddUser', function (e) {
        if (AssignToUserId != null && AssignToUserName != null) {
            $j("#AssignToText").val(AssignToUserName);
            $j("#AssignUserPopup").popup("close");
        }
        else {
            alert("Please select user");
        }
        e.stopPropagation();
        return false;
    });

    $j(document).off('vclick', '#btnAssignToCancel').on('vclick', '#btnAssignToCancel', function (e) {
        $j("#AssignUserPopup").popup("close");
        e.stopPropagation();
        return false;
    });

    function errorCB(err) {
        alert("Error processing SQL: " + err);
        $j.mobile.loading('hide');
    }

    //To close the popups
    $j(document).off('vclick', '#btnComCancelVis').on('vclick', '#btnComCancelVis', function (e) {
        //  $j(".modalOverlay").remove();
        //  $j('#StoreVisitContent').off();
        $j("#commentPopupVis").popup("close");
        e.stopPropagation();
        return false;
        //$j.unblockUI();
    });

    $j(document).off('vclick', '#btnPicCancelVis').on('vclick', '#btnPicCancelVis', function (e) {
        $j("#camPopupVis").popup("close");
        e.stopPropagation();
        return false;
    });

    //Function called when OK button of popup is clicked
    //It stores the comments of to respective selected option
    $j(document).off('vclick', '#btnComSaveVis').on('vclick', '#btnComSaveVis', function (e) {
        var commentStr = $j("#comTextAreaVis").val();
        if (commentStr == "")
        { alert("Please write comment"); }
        else {
            $j("#" + currentQuestionId).data("commentObj", { comment: commentStr });

            if ($j("#" + currentQuestionId).attr("opt") == "Checkbox") {
                var src = $j("#" + currentQuestionId).closest("fieldset").find("img").attr("src");
                if (src != "../www/Images/icons/icon-commentAdded.png") {
                    $j("#" + currentQuestionId).closest("fieldset").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                }
            }
            if ($j("#" + currentQuestionId).attr("opt") == "Drop Down Box") {
                var src = $j("#" + currentQuestionId).parent().find(".toaddicon").find("img").attr("src");
                if (src != "../www/Images/icons/icon-commentAdded.png") {
                    $j("#" + currentQuestionId).parent().find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                }
            }
            if ($j("#" + currentQuestionId).attr("opt") == "Radio Button") {
                var src = $j("#" + currentQuestionId).find(".toaddicon").find("img").attr("src");
                if (src != "../www/Images/icons/icon-commentAdded.png") {
                    $j("#" + currentQuestionId).find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-commentAdded.png\">");
                }
            }
            //  $j(".modalOverlay").remove();
            $j("#commentPopupVis").popup("close");
            $j("#commentPopupVis").popup("close");
            e.stopPropagation();
            return false;
            //  $j.unblockUI();
        }
    });

    function onError(response) {
        if (response.status == 404) {
            alert("Your internet connection is very slow");
        }
        else {
            alert("Error" + JSON.stringify(response)
                );
        }
        //  $j.mobile.loading('hide');
        $j.unblockUI();
    }

    //Function called when comment popup is opened
    $j("#commentPopupVis").popup({
        beforeposition: function (event, ui) {
            // $j("body").append('<div class="modalOverlay">');
            //$j.blockUI({          
            //    css: {
            //        color: '#78604F', border: 'none',
            //        '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
            //    }
            //});
            // $j("#commentPopupVis").css("z-index", "1000");
            $j("#StoreVisitContent :input").attr("disabled", "disabled");
            $j("#comTextAreaVis").val("");
            $j("#comQtextVis").html(currentQuestion);
            if (typeof $j("#" + currentQuestionId).data("commentObj") != "undefined") {
                var comment = $j("#" + currentQuestionId).data("commentObj").comment;
                $j("#comTextAreaVis").val(comment);
            }
        },
        afterclose: function (event, ui) {
            $j(".modalOverlay").remove();
            setTimeout(removeAttribute, 500);
            function removeAttribute() {
                $j("#StoreVisitContent :input").removeAttr("disabled");
            }
        }
    });
    var imageData = null;
    //Function called when Photo popup is opened
    $j("#camPopupVis").popup({
        beforeposition: function (event, ui) {

            $j("#camQtextVis").html(currentQuestion);
            $j("#StoreVisitContent :input").attr("disabled", "disabled");
            var canvas = document.getElementById('camImageVisCanvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, 250, 280);
            var flag = false;
            var imageObj = new Image();
            //  console.log("imageAttachmentVS" + JSON.stringify(imageAttachmentVS));
            $j.each(imageAttachmentVS, function (i, item) {
                if (item.QuesId == currentQuestionId) {
                    imageObj.src = item.ImageData;
                    //  console.log("************** imageobj.src:" + imageObj.src);
                    flag = true;
                }
            });
            if (flag == false) {
                imageObj.src = "../www/Images/icons/icon-takephoto.png";
                imageData = null;
            }
            imageObj.onload = function () {
                // console.log("$$$$$$$$$$$$$$$$$$$$ imageobj.src:" + imageObj.src);
                context.drawImage(imageObj, 0, 0, 250, 280);
            };

        },
        afterclose: function (event, ui) {
            setTimeout(removeAttribute, 500);
            function removeAttribute() {
                $j("#StoreVisitContent :input").removeAttr("disabled");
            }
        }
    });

    $j(document).off('vclick', '#btnPicSaveVis').on('vclick', '#btnPicSaveVis', function (e) {
        console.log("^^^^^^^^^^ imageData " + imageData);
        if (imageData == null) {
            alert("Please click photo");
        }
        else {
            $j("#" + currentQuestionId).data("Image", { imageData: imageData });
            var src = $j("#" + currentQuestionId).find(".toaddicon").find("img").attr("src");

            if ($j("#" + currentQuestionId).attr("opt") == "Checkbox") {
                if (src != "../www/Images/icons/icon-photoAdded.png") {
                    $j("#" + currentQuestionId).closest("fieldset").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                }
            }
            if ($j("#" + currentQuestionId).attr("opt") == "Drop Down Box") {
                if (src != "../www/Images/icons/icon-photoAdded.png") {
                    $j("#" + currentQuestionId).parent().find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                }
            }
            if ($j("#" + currentQuestionId).attr("opt") == "Radio Button") {
                if (src != "../www/Images/icons/icon-photoAdded.png") {
                    $j("#" + currentQuestionId).find(".toaddicon").append("<img class=\"pull-right\" style=\"margin-top:7px\" src=\"../www/Images/icons/icon-photoAdded.png\">");
                }
            }
            $j("#camPopupVis").popup("close");
            $j("#camPopupVis").popup("close");
            e.stopPropagation();
            return false;
        }
    });


    //Camera functionality

    $j(document).off('vclick', '#CamTapVis').on('vclick', '#CamTapVis', function () {
        var CamObj = cordova.require("cordova/plugin/Camera");
        console.log("***camobj***" + JSON.stringify(CamObj));

        CamObj.getPicture(CamOnSuccess, CamOnFail, {
            quality: 50,
            // destinationType: Camera.DestinationType.FILE_URI
            destinationType: Camera.DestinationType.DATA_URL

        });

        function CamOnSuccess(imageURI) {
            console.log("image data is -- " + imageURI);
            var canvas = document.getElementById('camImageVisCanvas');
            var context = canvas.getContext('2d');
            var imageObj = new Image();

            imageData = imageURI;
            console.log("***********image data " + imageData);

            imageObj.src = "data:image/png;base64," + imageURI;

            imageObj.onload = function () {
                context.drawImage(imageObj, 0, 0, 250, 280);
            };

            //   image.src = imageURI;
        }

        function CamOnFail(message) {
            alert('Failed because: ' + message);
        }
    });

});

$(document).on('pagebeforeshow', "#plpage", function (event, data) {
    var $j = jQuery.noConflict();
    var rid = window.localStorage.getItem("PLRowId");
    var storeId = window.localStorage.getItem("StoreId");

    $j("#PLFormhead").html("P&L for Store " + store.Name + "");

    if (rid == 'null') {
        //function addLists() {
        //    var select = document.getElementById("plyear");
        //    for (var i = 2013; i >= 2010; --i) {
        //        var option = document.createElement('option');
        //        option.text = option.value = i;
        //        select.add(option, 0);
        //    }
        //    select = document.getElementById("plquarter");
        //    for (var i = 1; i <= 4; i++) {
        //        var option = document.createElement('option');
        //        option.text = option.value = "Q"+i;
        //        select.add(option, 0);
        //    }
        //}
        //addLists();

        $j("#inputstore").val(store.Name);

        $j("#quarterlyplform").validate({
            rules: {
                Net_2_Sales__c: "required",
                Net_3_Sales__c: "required"
                //,
                //Cost_of_Purchases_Food__c: "required",
                //Cost_of_Purchases_Paper__c: "required",
                //Payroll_per_Quarterly_941_Report__c: "required",
                //Staff_Wages__c: "required",
                //Manager_Wages__c: "required",
                //Owner_Wages__c: "required",
                //Number_of_Employees__c: "required",
                //Royalty__c: "required",
                //Advertising__c: "required",
                //Rent__c: "required",
                //Utilities__c: "required",
                //Local_Store_Marketing__c: "required",
                //Credit_Card_Fees__c: "required",
                //Other_Operating__c: "required",
                //Other_Non_Operating_Income_Expense__c: "required",
                //Loan_Payment__c: "required",
                //Partner_Contribution_Withdrawal__c: "required"
            },
            messages: {
                Net_2_Sales__c: "Please enter Net2 Sales",
                Net_3_Sales__c: "Please enter Net3 Sales (after discount)",
                Cost_of_Purchases_Food__c: "Please enter Cost of Purchases Food",
                Cost_of_Purchases_Paper__c: "Please enter Cost of Purchases Paper",
                Payroll_per_Quarterly_941_Report__c: "Please enter Payroll per Quarterly 941 Report ",
                Staff_Wages__c: "Please enter Staff Wages",
                Manager_Wages__c: "Please enter Manager Wages",
                Owner_Wages__c: "Please enter Owner Wages",
                Number_of_Employees__c: "Please enter Number of Employees",
                Royalty__c: "Please enter Royalty",
                Advertising__c: "Please enter Advertising",
                Rent__c: "Please enter Rent",
                Utilities__c: "Please enter Utilities",
                Local_Store_Marketing__c: "Please enter Local Store Marketing",
                Credit_Card_Fees__c: "Please enter Credit Card Fees",
                Other_Operating__c: "Please enter Other Operating",
                Other_Non_Operating_Income_Expense__c: "Please enter Other Non Operating Income Expense",
                Loan_Payment__c: "Please enter Loan Payment",
                Partner_Contribution_Withdrawal__c: "Please enter Partner Contribution Withdrawal"
            }
        });

        $j.validator.setDefaults({
            debug: true,
            success: "valid"
        });


        $j("#plsubmit").click(function () {
            if ($j("#quarterlyplform").valid()) {
                $j.mobile.loading('show', {
                    text: 'Saving P & L',
                    textVisible: true,
                    //theme:theme,
                    html: ""
                });
                var fields = {};
                fields.Net_2_Sales__c = $j("#Net_2_Sales__c").val();
                fields.Net_3_Sales__c = $j("#Net_3_Sales__c").val();
                fields.Cost_of_Purchases_Food__c = $j("#Cost_of_Purchases_Food__c").val();
                fields.Cost_of_Purchases_Paper__c = $j("#Cost_of_Purchases_Paper__c").val();
                fields.Payroll_per_Quarterly_941_Report__c = $j("#Payroll_per_Quarterly_941_Report__c").val();
                fields.Staff_Wages__c = $j("#Staff_Wages__c").val();
                fields.Manager_Wages__c = $j("#Manager_Wages__c").val();
                fields.Owner_Wages__c = $j("#Owner_Wages__c").val();
                fields.Number_of_Employees__c = $j("#Number_of_Employees__c").val()
                fields.Royalty__c = $j("#Royalty__c").val();
                fields.Advertising__c = $j("#Advertising__c").val();
                fields.Rent__c = $j("#Rent__c").val();
                fields.Utilities__c = $j("#Utilities__c").val();
                fields.Local_Store_Marketing__c = $j("#Local_Store_Marketing__c").val();
                fields.Credit_Card_Fees__c = $j("#Credit_Card_Fees__c").val();
                fields.Other_Operating__c = $j("#Other_Operating__c").val();
                fields.Other_Non_Operating_Income_Expense__c = $j("#Other_Non_Operating_Income_Expense__c").val();
                fields.Loan_Payment__c = $j("#Loan_Payment__c").val();
                fields.Partner_Contribution_Withdrawal__c = $j("#Partner_Contribution_Withdrawal__c").val();
                fields.P_L_Quarter__c = $j("select#plquarter option:selected").val();
                fields.P_L_Year__c = $j(" select#plyear option:selected").val();
                fields.Store__c = store.Id;
                fields.StoreYearQtr__c = store.Id + fields.P_L_Year__c + fields.P_L_Quarter__c;
                fields.Submitted_P_L__c = true;
                fields.DateSubmitted__c = new Date();
                console.log("Fields: " + JSON.stringify(fields));

                forcetkClient.create("P_L__c", fields, callbackcreatepl, onError);
                function callbackcreatepl(response) {
                    $j.mobile.loading('hide');
                    alert("P & L submitted successfully..");
                    console.log("response after creating pl obj.." + JSON.stringify(response));
                    $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
                }
                function onError(response) {
                    $j.mobile.loading('hide');
                    alert("Error: " + JSON.stringify(response.responseText));
                    console.log("Error: " + JSON.stringify(response));
                }
            }
        });

    }
    else {
        if (rid != null) {

            forcetkClient.query("SELECT Advertising__c,Cost_of_Purchases_Food__c,Cost_of_Purchases_Paper__c,Credit_Card_Fees__c, \
                             Discount_Rate__c,Fees_to_Ad_Fund__c,Franchise_Owner_Net_Cash__c,Id,IsDeleted,Loan_Payment__c,\
                             Local_Store_Marketing__c,Manager_Wages__c,Name,Net_2_Sales__c,Net_3_Sales__c,Number_of_Employees__c,\
                             Operating_Profit_Loss__c,Other_Non_Operating_Income_Expense__c,Other_Operating__c,Owner_Wages__c, \
                             Partner_Contribution_Withdrawal__c,Payroll_per_Quarterly_941_Report__c,P_L_Quarter__c,P_L_Status__c,\
                             P_L_Year__c,RecordTypeId,Rent__c,Royalties_to_Franchisor__c,Royalty__c,Staff_Wages__c,\
                             StoreYearQtr__c,Store__c,Submitted_P_L__c,Utilities__c FROM P_L__c where Id='"+ rid + "'", onsuccessSpecificPL, onError);
        }
        function onsuccessSpecificPL(response) {
            var pl = response.records[0];

            //Initialize all controls
            $j("#Net_2_Sales__c").val(pl.Net_2_Sales__c);
            $j("#Net_3_Sales__c").val(pl.Net_3_Sales__c);
            $j("#Cost_of_Purchases_Food__c").val(pl.Cost_of_Purchases_Food__c);
            $j("#Cost_of_Purchases_Paper__c").val(pl.Cost_of_Purchases_Paper__c);
            $j("#Payroll_per_Quarterly_941_Report__c").val(pl.Payroll_per_Quarterly_941_Report__c);
            $j("#Staff_Wages__c").val(pl.Staff_Wages__c);
            $j("#Manager_Wages__c").val(pl.Manager_Wages__c);
            $j("#Owner_Wages__c").val(pl.Owner_Wages__c);
            $j("#Number_of_Employees__c").val(pl.Number_of_Employees__c);
            $j("#Royalty__c").val(pl.Royalty__c);
            $j("#Advertising__c").val(pl.Advertising__c);
            $j("#Rent__c").val(pl.Rent__c);
            $j("#Utilities__c").val(pl.Utilities__c);
            $j("#Local_Store_Marketing__c").val(pl.Local_Store_Marketing__c);
            $j("#Credit_Card_Fees__c").val(pl.Credit_Card_Fees__c);
            $j("#Other_Operating__c").val(pl.Other_Operating__c);
            $j("#Other_Non_Operating_Income_Expense__c").val(pl.Other_Non_Operating_Income_Expense__c);
            $j("#Loan_Payment__c").val(pl.Loan_Payment__c);
            $j("#Partner_Contribution_Withdrawal__c").val(pl.Partner_Contribution_Withdrawal__c);
            $j("#plyear").val(pl.P_L_Year__c);
            $j("#plquarter").val(pl.P_L_Quarter__c);
            $j("#plyear").selectmenu('refresh');
            $j("#plquarter").selectmenu('refresh');

            //Disable all controls and hide submit button
            $j("input").attr("disabled", "disabled");
            $j('#plyear').selectmenu('disable');
            $j('#plquarter').selectmenu('disable');
            $j('#plsubmit').hide();
        }
    }

    function onError(response) {
        alert("Error:" + JSON.stringify(response));
    }
});

$(document).on('pagebeforeshow', "#mipage", function (event, data) {
    var $j = jQuery.noConflict();
    var storeId = window.localStorage.getItem("StoreId");
    $j("#storeidMI").html(store.Name);

    $j("#startdate").datepicker({
        //minDate: new Date(),
        onClose: function (dateText, inst) {

            //  $j(this).attr('type', "text");
        },
        beforeShow: function (input, inst) {

            // $j(this).attr('type',"hidden");
        }
    });

    $j("#enddate").datepicker({
        //minDate: new Date(),
        onClose: function (dateText, inst) {
        },
        beforeShow: function (input, inst) {
        }
    });
    $j("#startdatemi").datepicker();
    $j("#enddatemi").datepicker();
    $j("#createNewMilestoneForm").validate({
        rules: {
            startdate: "required",
            enddate: "required",
            descriptionmilestone: "required"
        },
        messages: {
            startdate: "Please enter start date",
            enddate: "Please enter end date",
            descriptionmilestone: "Please enter description"
        }
    });

    $j("#createNewMarketIntelligence").validate({
        rules: {
            startdatemi: "required",
            enddatemi: "required",
            descriptionmi: "required"
        },
        messages: {
            startdatemi: "Please enter start date",
            enddatemi: "Please enter end date",
            descriptionmi: "Please enter description"
        }
    });

    $j.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    $j.mobile.loading('show', {
        text: 'Loading',
        textVisible: true,
        //theme:theme,
        html: ""
    });
    //All milestones as well as market intelligence are displayed 
    forcetkClient.query("SELECT Id FROM RecordType where Name='Milestone'", onsucsessrecordtype, onError);
    function onsucsessrecordtype(response) {
        if (response.records != null) {
            window.localStorage.setItem("MilestoneRecordTypeId", response.records[0].Id);
            //loadHistory(response.records[0].Id, "milestone");
        }
    }
    //function loadHistory(recordTypeId, str) {
    //    forcetkClient.query("SELECT CreatedById,CreatedDate,Description__c,DMA__c,End_Date__c,Id,IsDeleted,Name,OwnerId,RecordTypeId,Region__c,\
    //                        Start_Date__c,States__c,Type__c FROM Milestone__c where RecordTypeId='" + recordTypeId + "'", onsuccesstablemyrecords, onError);
    //    function onsuccesstablemyrecords(response) {
    //        console.log(JSON.stringify(response));
    //        var list = '';
    //        $j.each(response.records, function (i, item) {

    //            list += '<tr><td class="col-md-6 col-sm-6">' + item.Description__c + '</td>\
    //                </tr>';
    //        });
    //        console.log("list" + list);
    //        $j("#tbodyfor" + str).append(list);
    //        console.log("body    :" + $j("#tablemi").html());
    //    }
    //}
    forcetkClient.query("SELECT Id FROM RecordType where Name='Market Intelligence'", onsucsessrecordtypemi, onError);
    function onsucsessrecordtypemi(response) {
        if (response.records != null) {
            window.localStorage.setItem("MarketIntelligenceRecordTypeId", response.records[0].Id);
            //loadHistory(response.records[0].Id, "mi");
        }
    }




    //Only Store Milestones are displayed
    forcetkClient.query(" SELECT Description__c,Name,Store_ID__c FROM Store_Milestone__c m, m.Store_ID__r s where s.Id='" + store.Id + "'", onsuccesstablemyrecords, onError);
    function onsuccesstablemyrecords(response) {
        console.log(JSON.stringify(response));
        var list = '';
        $j.each(response.records, function (i, item) {

            list += '<tr><td class="col-md-6 col-sm-6">' + item.Description__c + '</td>\
                    </tr>';
        });
        console.log("list" + list);
        checkVariable1();
        function checkVariable1() {
            if (list != '') {
                appendBody();
            }
            else {
                window.setTimeout("checkVariable1();", 100);
            }
        }
        function appendBody() {
            $j("#tbodyformi1").append(list);
            $j.mobile.loading('hide');
            console.log("body    :" + $j("#tablemi").html());
        }
        if (response.totalSize == 0)
            $j.mobile.loading('hide');
    }


    //forcetkClient.describe('Milestone__c', callbackdescribe, onError);
    //function callbackdescribe(response)
    //{
    //    console.log("describe response:   " + JSON.stringify(response));
    //    alert("response logged..");
    //}
    //forcetkClient.metadata('Milestone__c', callbackmetadata, onError);
    //function callbackmetadata(response) {
    //    console.log("metadata response:   " + JSON.stringify(response));
    //    alert("response logged..");
    //}
    //forcetkClient.query("Select controllingField, picklistValues from Picklist", onselect, onError);
    //function onselect(response)
    //{
    //    console.log("select response:   " + JSON.stringify(response));
    //    alert("response logged..");
    //}
    $j(document).off('click', '#submitmilestone').on('click', '#submitmilestone', function () {
        if ($j("#createNewMilestoneForm").valid()) {
            $j.mobile.loading('show', {
                text: 'Saving Milestone',
                textVisible: true,
                //theme:theme,
                html: ""
            });

            var recordtypeid = window.localStorage.getItem("MilestoneRecordTypeId");
            console.log("recordtypeid " + recordtypeid);
            var subtype = $j("#subtypemilestone").val();
            var enddate = $j("#enddate").val();
            var startdate = $j("#startdate").val();
            var desc = $j("#descriptionmilestone").val();
            var fields = {};
            fields.RecordTypeId = recordtypeid;
            fields.Start_Date__c = new Date(startdate);
            fields.End_Date__c = new Date(enddate);
            fields.Description__c = desc;
            fields.Type__c = subtype;
            console.log("fields: " + JSON.stringify(fields));
            forcetkClient.create("Milestone__c", fields, callbacksuccessmilestonecreate, onError);
            function callbacksuccessmilestonecreate(response) {
                console.log("response after creating milestone object successfully:" + JSON.stringify(response));
                fields = {};
                fields.Milestone_ID__c = response.id;
                fields.Store_ID__c = store.Id;
                fields.Store_Closed_Milestone__c = false; // verify this
                console.log("fields: " + JSON.stringify(fields));
                forcetkClient.create("Store_Milestone__c", fields, successcreatestoremilestone, onError);
                function successcreatestoremilestone(response) {
                    $j.mobile.loading('hide');
                    alert("Milestone and store milestone are created successfully.");
                    //console.log("response after creating store milestone object successfully:" + JSON.stringify(response));
                    $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
                }
            }
        }
    });
    $j(document).off('click', '#submitmi').on('click', '#submitmi', function () {
        if ($j("#createNewMarketIntelligence").valid()) {
            $j.mobile.loading('show', {
                text: 'Saving Market Intelligence',
                textVisible: true,
                //theme:theme,
                html: ""
            });
            var recordtypeid = window.localStorage.getItem("MarketIntelligenceRecordTypeId");
            var subtype = $j("#subtypemi").val();
            var enddate = $j("#enddatemi").val();
            var startdate = $j("#startdatemi").val();
            var desc = $j("#descriptionmi").val();
            var fields = {};
            fields.RecordTypeId = recordtypeid;
            fields.Start_Date__c = new Date(startdate);
            fields.End_Date__c = new Date(enddate);
            fields.Description__c = desc;
            fields.Type__c = subtype;
            //console.log("fields: " + JSON.stringify(fields));
            forcetkClient.create("Milestone__c", fields, callbacksuccessmicreate, onError);
            function callbacksuccessmicreate(response) {
                $j.mobile.loading('hide');
                console.log("response after creating market intelligence object successfully:" + JSON.stringify(response));
                alert("Market intelligence is created successfully.")
                $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
            }
        }
    });
    function onError(response) {
        $j.mobile.loading('hide');
        console.log("Error: " + JSON.stringify(response));
    }
});

//$(document).on('pagebeforechange', "#taskpage", function (event, data) {
//    var $j = jQuery.noConflict();
//    $j("#DueDateVis").datepicker("hide");
//});

$(document).on('pageinit', "#taskpage", function (event, data) {
    var $j = jQuery.noConflict();
    $j("#createNewTaskForm").validate({
        rules: {
            TaskVis: "required",
            StatusVis: "required",
            // DueDateVis:"required",
            PriorityVis: "required",
            SourceVis: "required",
            AssignToText: "required"
        },
        messages: {
            TaskVis: "Please enter subject",
            StatusVis: "Please select status",
            //  DueDateVis: "Please select Due Date",
            PriorityVis: "Please select priority",
            SourceVis: "Please select source",
            AssignToText: "Please select user"
        }
    });
    $j.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    $j("#TaskPagehead").html("Tasks for Store " + store.Name + "");
    var contype = checkInternetConnectivity();
    if (contype == 'No network connection') { }
    else
    {
        loadUsers();
    }
    function loadUsers() {
        $j.mobile.loading('show', {
            text: 'Loading ',
            textVisible: true,
            //theme:theme,
            html: ""
        });
        forcetkClient.query("SELECT Id,Alias,City,CommunityNickname,CompanyName,Country,Email,\
                FirstName,Name,Username,IsActive FROM User where IsActive=true", onsuccessListUsers, onError);

        function onsuccessListUsers(response) {
            var list = '';
            $j.each(response.records, function (i, item) {
                list += '<tr id="' + item.Id + '"class="AssigntToUserRow">\
                            <td>' + item.FirstName + '</td>\
                        <td>' + item.Email + '</td>\
                     </tr>';
            });
            $j("#tbodyforAssignToUsers").append(list);
            $j.mobile.loading('hide');
            //$j("#tableForAssignToUsers").table("refresh");
            //$j("#tableForAssignToUsers").attr("data-filter", "true");
            $j('table').filterTable();
            //$j("#susers").css("border-radius","3px");
            //$j("#susers").css("border-color","grey");
            //$j("#susers").css("border-width", ".5px");
            //$j(input[type="search"]).css("border-radius", "3px");
            //$j(input[type = "search"]).css("border-color", "grey");
            //$j(input[type = "search"]).css("border-width", ".5px");
        }
        function onError(r) {
            console.log(JSON.stringify(r));
            alert("Error" + JSON.stringify(r));
        }
    }
    $j(document).off('click', '#submitTask').on('click', '#submitTask', function () {
        if ($j("#createNewTaskForm").valid()) {
            $j.mobile.loading('show', {
                text: 'Adding New Task',
                textVisible: true,
                //theme:theme,
                html: ""
            });

            var task = $j("#TaskVis").val();
            var DueDate = $j("#DueDateVis").val();
            var Description = $j("#DescriptionVis").val();
            var Priority = $j("#PriorityVis").val();
            var Status = $j("#StatusVis").val();
            var Source = $j("#SourceVis").val();

            forcetkClient.query("SELECT Id FROM Survey_Response__c s, s.Store__r a where s.Survey__r.Survey_Type__c='" + Source + "'\
                            and s.Survey__r.Status__c='Active' and a.Name='" + store.Name + "' and s.Survey_Status__c='In Draft'",
                                onsuccessResponseIdInDraft, onError);

            function onsuccessResponseIdInDraft(response) {
                console.log("Response:" + JSON.stringify(response));
                if (response.totalSize != 0) {
                    var fields = {};
                    //fields.AccountId = store.Id;

                    fields.Subject = task;
                    fields.OwnerId = AssignToUserId;  // Assigned to
                    //  fields.WhoId = userId;  // Who created

                    fields.WhatId = response.records[0].Id;  //Related to what kind of task

                    fields.Description = Description;
                    if (DueDate != "") {
                        fields.ActivityDate = new Date(DueDate);
                    }
                    fields.Priority = Priority;
                    fields.Status = Status;

                    console.log("******Fields:  " + JSON.stringify(fields));
                    forcetkClient.create("Task", fields, callbackGetResponseTaskId, onError);

                    function callbackGetResponseTaskId(response) {
                        $j.mobile.loading('hide'); // hide loading add new task
                        alert("A task has been assigned to " + AssignToUserName + " successfully");
                        $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
                    }
                }
                else {
                    $j.mobile.loading('hide'); // hide loading add new task
                    alert("Please start a survey to assign tasks");
                    $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
                }
            }
            function onError(response) {
                alert("Error: "+ JSON.stringify(response));
            }
        }
    });

    $j("#DueDateVis").datepicker({
        minDate: new Date(),
        onClose: function (dateText, inst) {

            //  $j(this).attr('type', "text");
        },
        beforeShow: function (input, inst) {
            $j.datepicker._pos = $j.datepicker._findPos(input); //this is the default position
            $j.datepicker._pos[0] = 0;
            $j.datepicker._pos[1] = 150; //top
        }
    });

    var AssignToUserId;
    var AssignToUserName;

    $j(document).off('click', '.AssigntToUserRow').on('click', '.AssigntToUserRow', function () {
        AssignToUserId = $j(this).attr("id");
        $j(this).parent().parent().css("background-color", "#E0EEE0");
        AssignToUserName = $j(this).children()[0].innerText;
        $j(this).parent().parent().css("background-color", "#E0EEE0");
        $j(this).siblings().css("background-color", "#FFFFFF");
        $j(this).css("background-color", "#E0EEE0");
    });
    $j(document).off('click', '#btnAssignToAddUser').on('click', '#btnAssignToAddUser', function () {
        $j("#AssignToText").val(AssignToUserName);
        $j("#AssignUserPopup1").popup("close");
    });
    $j(document).off('click', '#btnAssignToCancel').on('click', '#btnAssignToCancel', function () {
        $j("#AssignUserPopup1").popup("close");
    });
});

$(document).on('pagebeforeshow', "#alltasks", function (event, data) {
    var $j = jQuery.noConflict();
    //$j.mobile.loading('show', {
    //    text: 'Loading',
    //    textVisible: true,
    //    //theme:theme,
    //    html: ""
    //});
    $j.blockUI({
        message: '<h1><img src="../www/Images/Loader.gif" /></h1><h4>Loading Tasks</h4>',
        css: {
            color: '#78604F', border: 'none',
            '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: 0.8
        }
    });
    var contype = checkInternetConnectivity();
    if (contype == 'No network connection') {
        $j("#allTasksContent").append('<div class="col-md-12 historyHeaders"><h5>Sorry..! Cant display Tasks in offline mode</h5></div>');
        $j.unblockUI();
    }
    else {
        $j.each(stores, function (i, item) {
            var listOfTasks = [];
            var tablelist = '<div class="historyHeaders" style=\"margin-top:5px\"><h4 id="TaskHistoryHeader">Open Task for Store : ' + item.Name + '</h4>\
                                        </div>\
                                        <div class="table-responsive">\
                                            <table class="table table-striped darkgrey" style="border-top-width: 1.5px" id="table1">\
                                                <thead class="tableHeadGrad">\
                                                    <tr>\
                                                        <th class="col-md-3 col-sm-3">Subject</th>\
                                                        <th class="col-md-3 col-sm-3">Due Date</th>\
                                                        <th class="col-md-3 col-sm-3">Priority</th>\
                                                        <th class="col-md-3 col-sm-3">Assign To</th>\
                                                        <th class="col-md-3 col-sm-3">Source</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody id="tbodyForTask'+ item.Id + '">\
                                                </tbody>\
                                            </table>\
                                        </div>';
            $j("#allTasksContent").append(tablelist);
            $j("#allTasksContent").trigger("create");
            if (contype != 'No network connection') {
                forcetkClient.query("SELECT AccountId,ActivityDate,CreatedById,CreatedDate,Description,Id,IsDeleted,\
        OwnerId,Priority,ReminderDateTime,Status,Subject,Type,WhatId,WhoId FROM Task where IsClosed= false and AccountId='"+ item.Id + "' ", onsuccesstableTask, onError);
                function onsuccesstableTask(response) {
                    var list = '';
                    var cntAlt = 0;
                    listOfTasks = response.records;

                    $j.each(response.records, function (i, item) {

                        if (cntAlt % 2 == 0) {
                            list += '<tr class="trVisitResponse"><td class="col-md-3 col-sm-3">' + item.Subject + '</td>\
                        <td class="col-md-3 col-sm-3">'+ item.ActivityDate + '</td>\
                        <td class="col-md-3 col-sm-3">' + item.Priority + '</td>\
                        <td class="col-md-3 col-sm-3" id="assignto_'+ item.Id + '"></td>\
                        <td class="col-md-3 col-sm-3" id= "source_'+ item.Id + '"></td></tr>';
                        }
                        else {
                            list += '<tr class="lightPink trVisitResponse"><td class="col-md-3 col-sm-3">' + item.Subject + '</td>\
                        <td class="col-md-3 col-sm-3">'+ item.ActivityDate + '</td>\
                        <td class="col-md-3 col-sm-3">' + item.Priority + '</td>\
                        <td class="col-md-3 col-sm-3" id="assignto_' + item.Id + '"></td>\
                        <td class="col-md-3 col-sm-3" id= "source_' + item.Id + '"></td></tr>';
                        }
                        cntAlt = cntAlt + 1;
                    });
                    if (response.totalSize != 0)
                        $j("#tbodyForTask" + response.records[0].AccountId).append(list);

                    fillAssignToAndSourceForOpenTasks();
                }
                function fillAssignToAndSourceForOpenTasks() {
                    $j.each(listOfTasks, function (i, item) {
                        forcetkClient.query("SELECT Survey__r.Survey_Type__c FROM Survey_Response__c where Id='" + item.WhatId + "'", onsuccesssourceid, onError);
                        function onsuccesssourceid(response) {
                            if (response.records[0] != null)
                                $j("#source_" + item.Id).html(response.records[0].Survey__r.Survey_Type__c);
                            else
                                $j("#source_" + item.Id).html("P & L");

                        }
                        forcetkClient.query("SELECT Name FROM User where Id='" + item.OwnerId + "'", onsuccesssownerid, onError);
                        function onsuccesssownerid(response) {
                            if (response.records[0] != null)
                                $j("#assignto_" + item.Id).html(response.records[0].Name);
                        }
                    });
                    // $j.mobile.loading('hide');
                    $j.unblockUI();
                }
            }
        });
    }

    $j(document).off("click", "#allstores").on("click", "#allstores", function () {
        $j.mobile.changePage('Stores.html', { transition: "slideup" });
    });

    $j(document).off("click", "#link_logout").on("click", "#link_logout", function () {
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            alert("Sorry!..Can't logout in offline mode");
        }
        else {
            if (confirm('Are you sure you want to Log Out?')) {
                logToConsole("link_logout clicked");
                var sfOAuthPlugin = cordova.require("salesforce/plugin/oauth");
                sfOAuthPlugin.logout();
            } else {
            }
        }
    });

});

$(document).on('pageshow', "#stores", function () {
    var $j = jQuery.noConflict();

    $j(document).off("vclick", ".storeThumbnail").on("vclick", ".storeThumbnail", function () {
        $j(this).css("background-color", "#6F5748");
        $j(this).addClass("storeSel").siblings().removeClass("storeSel");
        $j(this).siblings().css("background-color", "#FFFFFF");

        var storeName = $j(this).attr("id");
        window.localStorage.setItem("StoreId", storeName);

        // $j.mobile.changePage('file:///android_asset/www/StoreDetails.html?storeid=' + storeName + '', { transition: "slideup" });
        $j.mobile.changePage('StoreDetails.html', { transition: "slideup" });
        //window.location.assign("StoreDetails.html");
    });

    $j(document).off("vclick", "#link_logout").on("vclick", "#link_logout", function () {
        var contype = checkInternetConnectivity();
        if (contype == 'No network connection') {
            alert("Sorry!..Can't logout in offline mode");
        }
        else {
            if (confirm('Are you sure you want to Log Out?')) {
                logToConsole("link_logout clicked");
                var sfOAuthPlugin = cordova.require("salesforce/plugin/oauth");
                sfOAuthPlugin.logout();
            }
            else { }
        }
    });

    $j(document).off("vclick", "#allopentasks").on("vclick", "#allopentasks", function () {
        $j.mobile.changePage('AllOpenTasks.html', { transition: "none" });
    });

});

$(document).on('pageshow', "#detailedview", function (event, data) {

    var $j = jQuery.noConflict();
    $j("#detaiedViewHead").html("Qway Score for Store " + store.Name);
    var rid = window.localStorage.getItem("QwayRowId");
    $j.mobile.loading('show', {
        text: 'Loading Qway Scores',
        textVisible: true,
        //theme:theme,
        html: ""
    });
    if (rid != null) {
        forcetkClient.query("SELECT q.Question_Category__c, SUM(Earned_Points__c),SUM(Points_Evaluated__c)\
                         FROM Survey_Score__c s, s.Survey_Question_ID__r q \
                         where Survey_Response_ID__c='"+ rid + "' GROUP BY q.Question_Category__c", onsuccessqwayscore, onError);
    }
    function onsuccessqwayscore(response) {
        //console.log(" ####### response: " + JSON.stringify(response));
        var list = '';
        var cntAlt = 0;
        var totalEarnedForCategory = 0;
        var totalPointsForCategory = 0;
        var percent = 0;
        $j.each(response.records, function (i, item) {
            //console.log("**** each res: " + JSON.stringify(item));

            if (item.expr1 != 0)
                percent = item.expr0 / item.expr1 * 100;
            else
                percent = 0;
            percent = Math.round(percent * 100) / 100;
            totalEarnedForCategory += item.expr0;
            totalPointsForCategory += item.expr1;
            if (cntAlt % 2 == 0) {
                list += '<tr>\
                        <td>' + item.Question_Category__c + '</td>\
                        <td>' + item.expr1 + '</td>\
                        <td>' + item.expr0 + '</td>\
                        <td>' + percent + '%</td>\
                     </tr>';
            }
            else {
                list += '<tr class="lightPink">\
                        <td>' + item.Question_Category__c + '</td>\
                        <td>' + item.expr1 + '</td>\
                        <td>' + item.expr0 + '</td>\
                        <td>' + percent + '%</td>\
                     </tr>';
            }
            cntAlt = cntAlt + 1;
        });
        if (cntAlt % 2 == 0)
            list += '<tr>';
        else
            list += '<tr class="lightPink">';
        if (totalPointsForCategory != 0)
            percent = totalEarnedForCategory / totalPointsForCategory * 100;
        else
            percent = 0;
        percent = Math.round(percent * 100) / 100;
        list += '<td> Total Scores </td>\
                        <td>' + totalPointsForCategory + '</td>\
                        <td>' + totalEarnedForCategory + '</td>\
                        <td>' + percent + '%</td>\
                     </tr>';
        $j("#tableforqwayscore").append(list);
        $j.mobile.loading('hide');
    }

    function onError(response) {
        console.log(JSON.stringify(response));
        $j.mobile.loading('hide');
    }


});