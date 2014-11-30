;(function(window) {
    "use strict";
    var document = window.document;
	document.addEventListener("DOMContentLoaded",function() {
        var all_files = [],
            current_file_id = 0,
            locked = false,
            prev_count_files = 0,
            waiting = 0,
            drop, dropzone, handleNextFile, handleReaderLoad,
        noopHandler = function(evt) {evt.stopPropagation();evt.preventDefault();};
        drop = function(evt) {
            noopHandler(evt);
            var files = evt.dataTransfer.files,
                count = files.length,
                i, j;
            if (count>0) {
                prev_count_files = all_files.length;
                if (d3.select("#dropzone")[0].length!=0) {d3.select("#dropzone").html('')}
                for (i = prev_count_files + waiting, j = 0; i < prev_count_files + files.length + waiting;i++,j++) {
                   var fbox = d3.select("#dropzone").append('div').attr("class","file " + "f"+i); 
  				   fbox.append("div").attr("class","name").text(files[j].name)
                   fbox.append("div").attr("class","progress").text("Waiting...")
                }
                waiting += count;
                if (!locked) {
                    waiting -= count;
                    all_files.push.apply(all_files, files);
                    handleNextFile();
                }
            }
        };
        handleReaderLoad = function(evt) {
            var current_file = {name:all_files[current_file_id].name,type:all_files[current_file_id].type,contents:evt.target.result};
            d3.xhr('/upload').post(JSON.stringify(current_file), function(error,XHR) {
               if (XHR.status === 200) {
                  d3.select("body").style("background","cornflowerblue")
                   d3.select(".file." + "f"+current_file_id + " .progress").html("Uploaded the file!");
           
                   }
                 else {
                    d3.select(".file." + "f"+current_file_id + " .progress").html("Failed");
                }
                all_files[current_file_id] = 1;
                current_file_id++;
                handleNextFile();
            });
        };
        handleNextFile = function() {
            if (current_file_id < all_files.length) {
                locked = true;
                d3.select(".file." + "f"+current_file_id + " .progress").html("Uploading...");
                var current_file = all_files[current_file_id],
                    reader = new FileReader();
                reader.onload = handleReaderLoad;
                reader.readAsDataURL(current_file);
            } else {
                locked = false;
            }
        };
        dropzone = document.getElementById("dropzone");
        dropzone.addEventListener("dragenter", noopHandler, false);
        dropzone.addEventListener("dragexit", noopHandler, false);
        dropzone.addEventListener("dragover", noopHandler, false);
        dropzone.addEventListener("drop", drop, false);
    });
}(window));
