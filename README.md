# DropZone Component

DropZone is a flexible and customizable React component for file uploading with sortable drag-and-drop functionality. It supports image compression, custom thumbnail rendering. Perfect for building modern file upload experiences based on tailwindcss styling.

## Features

- **Drag-and-Drop**: Easily drag and drop files to upload.
- **Image Compression**: Optionally compress images before uploading.
- **Custom Thumbnails**: Render custom thumbnails using a provided function.
- **Multiple Files**: Support for uploading multiple files.
- **Customizable File Types**: Control which file types can be uploaded.
- **Lightweight**: Minimal dependencies and easy to integrate.

## Props

| Prop                | Type                 | Default                     | Description                                                                                          |
| ------------------- | -------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `multiple`          | `bool`               | `true`                      | Allows multiple files to be uploaded.                                                                |
| `onUpload`          | `func`               | `required`                  | Callback function that receives the uploaded files.                                                  |
| `images`            | `array`              | `[]`                        | Initial array of images to display.                                                                  |
| `maxFiles`          | `number`             | `10`                        | Maximum number of files allowed to be uploaded.                                                      |
| `maxWidth`          | `number`             | `1024`                      | Maximum width (in pixels) for image compression.                                                     |
| `compressImages`    | `bool`               | `true`                      | Whether to compress images before uploading.                                                         |
| `compressionOptions`| `object`             | `{}`                        | Options for image compression. Follows the `browser-image-compression` options.                      |
| `loader`            | `elementType`        | `Loader`                    | Custom loader component to show while files are being processed.                                     |
| `className`         | `string`             | `''`                        | Additional CSS classes for styling the container.                                                    |
| `acceptedFileTypes` | `object`             | `{ 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] }` | Specifies the accepted file types for uploading.                         |
| `renderThumbnail`   | `func`               | `null`                      | Custom function to render thumbnails. Receives `(file, index, handleDragStart, handleDragEnter, handleDragEnd, removeFile)` as arguments. |

## Acknowledgments

This project is made possible thanks to the following libraries and tools:

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [react-dropzone](https://react-dropzone.js.org/) - Simple React hook to create a HTML5-compliant drag'n'drop zone.
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) - JavaScript library for image compression in browsers.
- [lucide-react](https://lucide.dev/) - Beautiful & consistent icon toolkit made by the community.

Thank you to the open-source community for providing these valuable resources!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please open an issue or submit a pull request on GitHub if you have ideas, bug reports, or improvements.

### How to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

Thank you for your contributions!

