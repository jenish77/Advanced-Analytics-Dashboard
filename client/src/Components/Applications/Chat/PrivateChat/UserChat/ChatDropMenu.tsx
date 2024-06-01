import React from "react";

const ChatDropMenu = ({ handleFileUpload, fileInputRef }: any) => {

  return (
    <div className="dropdown-form">
      <div className="dropdown-item">
        <label htmlFor="dropzone-file" className="d-flex align-items-center justify-content-center mb-0" >
          {/* <SVG iconId="attchment"  /> */}
          <i className="icon-plus" />
        </label>
        <input
          type='file'
          ref={fileInputRef}
          multiple
          onChange={handleFileUpload}
          id='dropzone-file'
          className='d-none'
          accept=".pdf, image/*" 

        />
      </div>
    </div>
  );
};

export default ChatDropMenu;