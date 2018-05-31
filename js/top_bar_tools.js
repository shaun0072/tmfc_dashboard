//check if tds
function checkTools() {
  if(app_obj.tds) {
    var tds_btn = $('<li>', {
      class: "tool_grp_item_cntr",
      html: '<a href="./pdf/'+app_obj.tds+'" target="_blank"><svg class="tool_grp_item"><use xlink:href="#tds_icon"></use></svg><p>TDS</p></a>'
    });
    $('.resources .tools_grp').append(tds_btn);
  } else {
    console.log(false);
  }
}
