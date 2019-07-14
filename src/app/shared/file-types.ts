interface FileType {
  ext: string;
  mime: string;
  icon: string;
}

const path = '../../assets/icon/';
const video = 'video_icon.png';
const audio = 'video_icon.png';
const word = 'word_icon.jpg';
const excel = 'excel_icon.png';
const pdf = 'pdf_icon.png';
const zip = 'zip_icon.png';
const file = 'file_icon.jpg';
const dcm = 'dcm_icon.jpg';
const text = 'text_icon.png';
const presentation = 'presentation_icon.png';
const unknown = 'document_icon.png';

export const fileTypes: FileType[] = [
  {ext: 'acc', mime: 'audio/aac', icon: path + audio},
  {ext: 'avi', mime: 'video/x-msvideo', icon: path + video},
  {ext: 'bin', mime: 'application/octet-stream', icon: path + unknown},
  {ext: 'bmp', mime: 'image/bmp', icon: ''},
  {ext: 'csv', mime: 'text/csv', icon: path + text},
  {ext: 'dcm', mime: 'application/dicom', icon: path + dcm},
  {ext: 'dcm30', mime: 'application/dicom', icon: path + dcm},
  {ext: 'dicom', mime: 'application/dicom', icon: path + dcm},
  {ext: 'doc', mime: 'application/msword', icon: path + word},
  {ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: path + word},
  {ext: 'gif', mime: 'image/gif', icon: ''},
  {ext: 'ico', mime: 'image/vnd.microsoft.icon', icon: ''},
  {ext: 'ics', mime: 'text/calendar', icon: path + text},
  {ext: 'jpeg', mime: 'image/jpeg', icon: ''},
  {ext: 'jpg', mime: 'image/jpeg', icon: ''},
  {ext: 'mp3', mime: 'audio/mpeg', icon: path + audio},
  {ext: 'mpeg', mime: 'video/mpeg', icon: path + video},
  {ext: 'opd', mime: 'application/vnd.oasis.opendocument.presentation', icon: path + presentation},
  {ext: 'ods', mime: 'application/vnd.oasis.opendocument.spreadsheet', icon: path + excel},
  {ext: 'odt', mime: 'application/vnd.oasis.opendocument.text', icon: path + text},
  {ext: 'oga', mime: 'audio/ogg', icon: path + audio},
  {ext: 'ogv', mime: 'video/ogg', icon: path + video},
  {ext: 'png', mime: 'image/png', icon: ''},
  {ext: 'pdf', mime: 'application/pdf', icon: path + pdf},
  {ext: 'ppt', mime: 'application/vnd.ms-powerpoint', icon: path + presentation},
  {ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: path + presentation},
  {ext: 'tif', mime: 'image/tiff', icon: ''},
  {ext: 'tiff', mime: 'image/tiff', icon: ''},
  {ext: 'ts', mime: 'video/mp2t', icon: path + video},
  {ext: 'txt', mime: 'text/plain', icon: path + text},
  {ext: 'wav', mime: 'audio/wav', icon: path + audio},
  {ext: 'weba', mime: 'audio/webm', icon: path + audio},
  {ext: 'webm', mime: 'video/webm', icon: path + video},
  {ext: 'webp', mime: 'image/webp', icon: ''},
  {ext: 'xls', mime: 'application/vnd.ms-excel', icon: path + excel},
  {ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: path + excel},
  {ext: 'zip', mime: 'application/zip', icon: path + zip}
];
