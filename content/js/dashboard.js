/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 80.0, "KoPercent": 20.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.63, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "https://10.180.10.161:18512/ManageUsers/getUser"], "isController": false}, {"data": [0.0, 500, 1500, "https://10.180.10.161:18512/LoginNew.aspx/GetSecurityQuestion"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/api/GetExternalCommunityConfiguration"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Common/html/showhide.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/SSOLogout.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Common/html/strap-sh-hide.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/lead-center-listing.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://10.180.10.161:18512/ManageUsers/Index"], "isController": false}, {"data": [0.2, 500, 1500, "https://10.180.10.161:18512/LeadJunction/Index"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/basic-info_V1.2.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://10.180.10.161:18512/LoginNew.aspx"], "isController": false}, {"data": [0.25, 500, 1500, "https://10.180.10.161:18512/API/DropDown/Get/LEADMANDATORYDDLIST"], "isController": false}, {"data": [0.0, 500, 1500, "https://10.180.10.161:18512/LoginNew.aspx/CheckValidUser"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/add-lead_V1.5.html"], "isController": false}, {"data": [0.85, 500, 1500, "https://10.180.10.161:18512/api/globalfilter/get/LEADCENTER"], "isController": false}, {"data": [0.4, 500, 1500, "https://10.180.10.161:18512/"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/api/buttonauthorization/leadcenter/DEMO"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp//Modules/Marketing/LeadCenter/html/lead-center_V1.4.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Common/html/session-modal.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/duplicates.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/api/leads"], "isController": false}, {"data": [0.0, 500, 1500, "https://10.180.10.161:18512/API/ColumnSetting/Get"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/quick-lead_V1.2.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://10.180.10.161:18512/AngularApp/Common/html/global-filter.html"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 250, 50, 20.0, 622.408, 0, 6682, 2187.9, 3423.749999999993, 4893.35, 7.694675284702986, 1005.5547440077715, 112.60183421822099], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["https://10.180.10.161:18512/ManageUsers/getUser", 10, 0, 0.0, 471.9, 293, 652, 640.1, 652.0, 652.0, 2.433682161109759, 7.025355926016062, 2.706996075687515], "isController": false}, {"data": ["https://10.180.10.161:18512/LoginNew.aspx/GetSecurityQuestion", 10, 10, 100.0, 5.300000000000001, 3, 9, 8.9, 9.0, 9.0, 263.1578947368421, 326.1204769736842, 235.14597039473685], "isController": false}, {"data": ["https://10.180.10.161:18512/api/GetExternalCommunityConfiguration", 10, 0, 0.0, 104.2, 12, 301, 298.9, 301.0, 301.0, 7.1890726096333575, 5.0618372573688, 7.610307332854061], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Common/html/showhide.html", 10, 0, 0.0, 3.500000000000001, 0, 8, 7.9, 8.0, 8.0, 7.22543352601156, 10.693500496748555, 7.415947886560694], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/SSOLogout.html", 10, 0, 0.0, 6.1, 1, 19, 18.300000000000004, 19.0, 19.0, 17.271157167530223, 14.049681563039725, 18.114475388601036], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Common/html/strap-sh-hide.html", 10, 0, 0.0, 4.0, 1, 7, 6.800000000000001, 7.0, 7.0, 42.016806722689076, 26.875984768907564, 43.32983193277311], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/lead-center-listing.html", 10, 0, 0.0, 2.1, 1, 4, 3.9000000000000004, 4.0, 4.0, 9.871668311944719, 23.12901036525173, 10.45008637709773], "isController": false}, {"data": ["https://10.180.10.161:18512/ManageUsers/Index", 10, 10, 100.0, 3282.8, 2380, 6682, 6388.9000000000015, 6682.0, 6682.0, 1.4894250819183796, 970.3559318681114, 99.30130836684539], "isController": false}, {"data": ["https://10.180.10.161:18512/LeadJunction/Index", 10, 0, 0.0, 1616.6999999999998, 1257, 1889, 1886.1, 1889.0, 1889.0, 5.0352467270896275, 2070.0986003587614, 662.2411568479356], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/basic-info_V1.2.html", 10, 0, 0.0, 2.8, 1, 8, 7.9, 8.0, 8.0, 12.886597938144329, 25.312600676546392, 13.591333762886597], "isController": false}, {"data": ["https://10.180.10.161:18512/LoginNew.aspx", 10, 0, 0.0, 4755.5, 4607, 4901, 4899.5, 4901.0, 4901.0, 2.0300446609825418, 3976.4336397431994, 270.85236500203], "isController": false}, {"data": ["https://10.180.10.161:18512/API/DropDown/Get/LEADMANDATORYDDLIST", 20, 0, 0.0, 1596.8000000000002, 599, 2622, 2429.7000000000003, 2613.3999999999996, 2622.0, 4.384042086804033, 80.42405332091188, 4.636638261727312], "isController": false}, {"data": ["https://10.180.10.161:18512/LoginNew.aspx/CheckValidUser", 10, 10, 100.0, 38.8, 22, 57, 56.9, 57.0, 57.0, 135.13513513513513, 167.46727195945948, 124.70967060810811], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/add-lead_V1.5.html", 10, 0, 0.0, 10.200000000000001, 1, 26, 24.900000000000006, 26.0, 26.0, 9.643201542912246, 7.8821871986499525, 10.151729749276761], "isController": false}, {"data": ["https://10.180.10.161:18512/api/globalfilter/get/LEADCENTER", 10, 0, 0.0, 326.09999999999997, 193, 565, 564.9, 565.0, 565.0, 6.329113924050633, 23.63528481012658, 6.66287579113924], "isController": false}, {"data": ["https://10.180.10.161:18512/", 10, 0, 0.0, 1335.6999999999998, 1098, 1584, 1578.0, 1584.0, 1584.0, 4.370629370629371, 774.3146136090472, 47.73119946459791], "isController": false}, {"data": ["https://10.180.10.161:18512/api/buttonauthorization/leadcenter/DEMO", 10, 0, 0.0, 28.6, 19, 43, 42.7, 43.0, 43.0, 13.404825737265416, 11.166324564343164, 14.216446045576408], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp//Modules/Marketing/LeadCenter/html/lead-center_V1.4.html", 10, 0, 0.0, 36.6, 1, 332, 299.8000000000001, 332.0, 332.0, 17.513134851138354, 16.658001313485116, 18.094625656742558], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Common/html/session-modal.html", 10, 0, 0.0, 7.4, 1, 35, 32.80000000000001, 35.0, 35.0, 17.513134851138354, 15.700251751313486, 16.57248795971979], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/duplicates.html", 10, 10, 100.0, 13.0, 2, 40, 38.7, 40.0, 40.0, 12.987012987012989, 49.912489853896105, 27.26765422077922], "isController": false}, {"data": ["https://10.180.10.161:18512/api/leads", 10, 0, 0.0, 16.2, 10, 30, 29.400000000000002, 30.0, 30.0, 13.605442176870747, 10.018069727891156, 20.075999149659864], "isController": false}, {"data": ["https://10.180.10.161:18512/API/ColumnSetting/Get", 10, 10, 100.0, 293.29999999999995, 109, 584, 582.9, 584.0, 584.0, 12.853470437017995, 33.80312098329049, 15.163078406169666], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/quick-lead_V1.2.html", 10, 0, 0.0, 1.8, 1, 5, 4.800000000000001, 5.0, 5.0, 13.642564802182811, 29.85643332196453, 14.388642564802183], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Common/html/global-filter.html", 10, 0, 0.0, 3.9999999999999996, 1, 10, 9.500000000000002, 10.0, 10.0, 41.84100418410041, 77.19338389121339, 43.14853556485356], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 30, 60.0, 12.0], "isController": false}, {"data": ["Assertion failed", 20, 40.0, 8.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 250, 50, "500/Internal Server Error", 30, "Assertion failed", 20, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://10.180.10.161:18512/LoginNew.aspx/GetSecurityQuestion", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://10.180.10.161:18512/ManageUsers/Index", 10, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://10.180.10.161:18512/LoginNew.aspx/CheckValidUser", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://10.180.10.161:18512/AngularApp/Modules/Marketing/LeadCenter/html/duplicates.html", 10, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://10.180.10.161:18512/API/ColumnSetting/Get", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
