import React, { useState, useEffect } from 'react';
import PreviewElement from "./PreviewElement";

const FileUpload = () => {
  const [storedFiles, setStoredFiles] = useState([]);
  const [originalFile, setOriginalFile] = useState(null);

  useEffect(() => {
    // Fetch data from an API when the component mounts
    fetch('/files')
      .then((response) => response.json())
      .then((data) => {console.log(data); setStoredFiles(data)})
      .catch(error => console.error('Error fetching files:', error));
  }, []);


  const handleFileChange = (event) => {
    setOriginalFile(event.target.files[0]);
  }

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  }

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!originalFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("upfile", originalFile);

    try {
      const response = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json(); // Get file details from backend

      setOriginalFile(null);
      setStoredFiles((prevStoredFiles) => [
        ...prevStoredFiles, 
        data.name // Append the new file name
      ]);

      console.log("Uploaded: " + data.name);

    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const handleFileDelete = async (event, name) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    try {
      const response = await fetch("/api/filedelete", {
        method: "DELETE",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File delete failed");
      }

      const data = await response.json(); // Get file details from backend
      const deleted = data.deletedName;
      console.log("Deleted: " + deleted);
      
      setStoredFiles((prevStoredFiles) => 
        prevStoredFiles.filter((file) => file !== deleted) // Remove the deleted file by name
      );


    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  return (
    <div>
      {/* File Upload Form */}
      <form onSubmit={handleFileUpload}>
        <div className="grid1">

          <div id="chooseFile">
            <button className="inputButton" type="button" onClick={triggerFileInput}>
              Choose File
            </button>
          </div>
          
          <div id="fileNameBeforeUpload">
            <p>{originalFile ? originalFile.name : ''}</p>
          </div>

          <input 
            type="file" 
            id="fileInput" 
            accept="text/plain" 
            onChange={handleFileChange}
          />

          <div id="Upload">
            <button className="inputButton" type="submit">Upload</button>
          </div>

        </div>
      </form>

      <h3>File Preview:</h3>

      {/* File Preview */}
      <div id="previewBox">
        {storedFiles.length > 0 && 
          storedFiles.map((file, index) => (
            <PreviewElement 
              key={index} 
              name={file} 
              deletehandler={handleFileDelete} 
            />
          ))
        }
      </div>
      
    </div>
  );

}


export default FileUpload;