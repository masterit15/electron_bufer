export default function fileExt(filename) {
  let icon = "";
  if(filename !== undefined){
    let ext = filename.split(".").pop();
    switch (ext.toLowerCase()) {
      case "zip":
      case "rar":
      case "7zip":
        icon = `<i class="fa fa-file-archive-o" style="color: #f7b731"></i>`;
        break;
      case "pdf":
        icon = `<i class="fa fa-file-pdf-o" style="color: #eb3b5a"></i>`;
        break;
      case "doc":
      case "docx":
      case "rtf":
        icon = `<i class="fa fa-file-word-o" style="color: #3867d6"></i>`;
        break;
      case "xls":
      case "xlsx":
        icon = `<i class="fa fa-excel-o" style="color: #3867d6"></i>`;
        break;
      case "sql":
        icon = `<i class="fa fa-database" style="color: #f7b731"></i>`;
        break;
      case "exe":
        icon = `<i class="fa fa-cog" style="color: #808080"></i>`;
        break;
      case "gif":
      case "png":
      case "jpeg":
      case "jpg":
        icon = `<i class="fa fa-file-image-o" style="color: #00b894"></i>`;
        break;
      default:
        icon = `<i class="fa fa-file" style="color: #808080"></i>`;
        break;
    }
  }else{
    icon = `<i class="fa fa-file" style="color: #808080"></i>`;
  }
  return icon;
}