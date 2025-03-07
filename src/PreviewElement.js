import React, { useState, useEffect } from 'react';

const PreviewElement = ({name, deletehandler}) => {
  const Url = "/uploads/" + name;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = Url;
    link.download = name;
    link.click();
  };

  const handleDelete = (event) => {
    deletehandler(event, name);
  }

  return (
    <div className="fileBox">
      <div className="storedFileName"><span>{name}</span></div>
      <div class="downloadDelete-box">
        <div className="downloadButton-box"><button className="downloadButton" onClick={handleDownload}>Download</button></div>
        <div className="deleteButton-box"><button className="deleteButton" onClick={handleDelete}>Delete</button></div>
      </div>
    </div>
  );
};

export default PreviewElement;