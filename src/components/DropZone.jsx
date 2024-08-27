import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import Loader from './Loader';
import { GripVertical, Upload } from 'lucide-react';

const DropZone = ({
  multiple = true,
  onUpload,
  images = [],
  maxFiles = 10,
  maxWidth = 1024,
  compressImages = true,
  compressionOptions = {},
  loader: LoaderComponent = Loader,
  className = '',
  acceptedFileTypes = { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
  renderThumbnail,
}) => {
  const [files, setFiles] = useState(
    multiple ? (Array.isArray(images) ? images : []) : images ? [images] : []
  );
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null); // Track the index of the dragged item
  const [placeholderIndex, setPlaceholderIndex] = useState(null); // Track where the placeholder should be
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const removeFile = (fileId) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);

    if (onUpload) {
      setTimeout(() => onUpload(multiple ? updatedFiles : updatedFiles.length > 0 ? updatedFiles[0] : null), 0);
    }
  };

  const removeRejectedFile = (fileId) => {
    const updatedRejectedFiles = rejectedFiles.filter((file) => file.id !== fileId);
    setRejectedFiles(updatedRejectedFiles);
  };

  const stripFileExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, '');
  };

  const onDrop = async (acceptedFiles) => {
    setLoading(true);

    const newFiles = await Promise.all(
      acceptedFiles.map(async (file, index) => {
        const fileNameWithoutExtension = stripFileExtension(file.name);

        if (compressImages) {
          try {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: maxWidth,
              useWebWorker: true,
              ...compressionOptions,
            };
            const compressedFile = await imageCompression(file, options);
            return {
              file: compressedFile,
              preview: URL.createObjectURL(compressedFile),
              id: `${fileNameWithoutExtension}-${Date.now()}-${index}`,
            };
          } catch (error) {
            console.error('Error compressing file', error);
            return null;
          }
        } else {
          return {
            file,
            preview: URL.createObjectURL(file),
            id: `${fileNameWithoutExtension}-${Date.now()}-${index}`,
          };
        }
      })
    );

    const updatedFiles = multiple
      ? [...files, ...newFiles.filter((f) => f !== null)].slice(0, maxFiles)
      : newFiles.filter((f) => f !== null).slice(0, 1);

    setFiles(updatedFiles);

    if (onUpload) {
      setTimeout(() => onUpload(multiple ? updatedFiles : updatedFiles[0] || null), 0);
    }

    setLoading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: multiple ? maxFiles : 1,
    onDrop,
    onDropRejected: (fileRejections) => {
      setRejectedFiles((prevRejectedFiles) => [
        ...prevRejectedFiles,
        ...fileRejections.map(({ file, errors }, index) => ({
          file,
          errors,
          id: `${file.name}-${Date.now()}-${index}`,
        })),
      ]);
    },
  });

  const handleDragStart = (index) => {
    dragItem.current = index;
    setDraggedIndex(index);
    setDragging(true);
    setPlaceholderIndex(index);
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
    setPlaceholderIndex(index);
  };

  const handleDragEnd = () => {
    const updatedFiles = [...files];
    const draggedItemContent = updatedFiles[dragItem.current];
    updatedFiles.splice(dragItem.current, 1);
    updatedFiles.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setFiles(updatedFiles);
    setDragging(false);
    setDraggedIndex(null);
    setPlaceholderIndex(null);

    if (onUpload) {
      setTimeout(() => onUpload(multiple ? updatedFiles : updatedFiles[0] || null), 0);
    }
  };

  const defaultRenderThumbnail = (file, index) => (
    <div
      key={file.id}
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragEnter={() => handleDragEnter(index)}
      onDragEnd={handleDragEnd}
      className={`${
        index === 0
          ? 'col-span-2 row-span-2 h-40 w-40 mr-3'
          : 'h-20 w-20 mb-2'
      } border-slate-300 p-0.5 border rounded-lg cursor-pointer transition-transform duration-200 ease-in-out`}
    >
      <div className={`relative group w-full h-full ${dragging && draggedIndex === index ? 'opacity-80' : ''}`}>
        {dragging && draggedIndex === index ? (
          <img
            src={file.preview}
            className="object-cover w-full h-full rounded-md"
            onLoad={() => URL.revokeObjectURL(file.preview)}
          />
        ) : (
          <>
            <img
              src={file.preview}
              className="object-cover w-full h-full rounded-md"
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
            {dragging && placeholderIndex === index && (
              <div className="absolute inset-0 bg-slate-200 rounded-md"></div>
            )}
          </>
        )}

        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 bg-slate-950 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => removeFile(file.id)}
            className="flex text-red-600 hover:text-red-800 bg-slate-50 pb-0.5 h-4 w-4 rounded-full items-center justify-center"
          >
            &times;
          </button>
        </div>
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="text-slate-50 h-5 w-5" />
        </div>
      </div>
    </div>
  );
    
  
  
  const thumbs = files.map((file, index) =>
    renderThumbnail
      ? renderThumbnail(file, index, handleDragStart, handleDragEnter, handleDragEnd, removeFile)
      : defaultRenderThumbnail(file, index)
  );

  const rejectedThumbs = rejectedFiles.map(({ file, errors, id }) => (
    <div key={id} className="relative p-2 border rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-red-600">
          {file.path} - {errors.map((e) => e.message).join(', ')}
        </p>
        <button
          onClick={() => removeRejectedFile(id)}
          className="text-red-600 hover:text-red-800"
        >
          &times;
        </button>
      </div>
    </div>
  ));

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <section className={`container mx-auto mt-2 ${className}`}>
      <div
        {...getRootProps({
          className:
            'dropzone border-2 h-40 flex flex-col gap-4 items-center justify-center border-dashed border-slate-200 dark:border-slate-700 p-6 text-center cursor-pointer',
        })}
      >
        <Upload className="h-8 w-8 text-slate-500 dark:text-slate-400" />
        <input {...getInputProps()} />
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Drag 'n' drop some files here, or click to select files{' '}
          <br></br> (max {multiple ? maxFiles : 1} file{multiple && 's'})
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-4">
          <LoaderComponent />
        </div>
      )}
      <div className="flex items-center justify-center mt-4">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 w-[80%]">
          {thumbs}
          {rejectedFiles.length > 0 && (
            <div className="col-span-full">
              <h4 className="text-rose-700 mt-4">Rejected Files:</h4>
              {rejectedThumbs}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

DropZone.propTypes = {
  multiple: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
  images: PropTypes.array,
  maxFiles: PropTypes.number,
  maxWidth: PropTypes.number,
  compressImages: PropTypes.bool,
  compressionOptions: PropTypes.object,
  loader: PropTypes.elementType,
  className: PropTypes.string,
  acceptedFileTypes: PropTypes.object,
  renderThumbnail: PropTypes.func,
};

export default DropZone;
