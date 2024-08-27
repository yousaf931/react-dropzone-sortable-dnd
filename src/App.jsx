import React, { useState } from "react";
import DropZone from "./components/DropZone";

const App = () => {
  const [files, setFiles] = useState([]);


  return (
    <div className="flex m-5 justify-center">

    
    <div className="w-[80%]">
      <h1>Upload Your Images</h1>
      <DropZone
      multiple
      onUpload={setFiles}
      images={files}
      maxFiles={5}
      maxWidth={800}
      compressImages={true}
      compressionOptions={{ maxSizeMB: 0.5 }}
      acceptedFileTypes={{ 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'application/pdf': ['.pdf'] }}
     // renderThumbnail={customRenderThumbnail}
    />

      <div className="uploaded-files">
        <h2>Uploaded Files:</h2>
        {files && files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.id}</li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
    </div>
  )
}

export default App;
