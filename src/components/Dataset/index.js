import React, { useState, useEffect } from 'react';
import "./index.css";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const DatasetApp = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [file, setFile] = useState(null);
  const [folders, setFolders] = useState([]); // Storing created folders
  const [showFolderPopup, setShowFolderPopup] = useState(false); // To toggle folder popup
  const [folderName, setFolderName] = useState('');
  const [folderType, setFolderType] = useState('');
  const [folderCategory, setFolderCategory] = useState('');
  const [folderSno, setFolderSno] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null); // Track the opened folder
  
  const [showFileTypeDropdown, setShowFileTypeDropdown] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState('');
  const [createFolderButtonVisible, setCreateFolderButtonDisible] = useState(true)
  


  const handleFileTypeSelect = (type) => {
    setSelectedFileType(type);
    setShowFileTypeDropdown(false);
    setPopupVisible(true)
  };

  const handleBackButtonClick = () => {
    setSelectedFolderId(null);
    setCreateFolderButtonDisible(true)

  };

  const handleAddFileClick = () => {
    setShowFileTypeDropdown(!showFileTypeDropdown);
  };

  useEffect(() => {
    // Generate next folder serial number based on existing folders length
    const nextSno = folders.length + 1; // Start from 1 if there are no folders
    setFolderSno(nextSno.toString()); // Set the suggested folderSno
  }, [folders]); // Update whenever the folders array changes

  const handleInputChange = (e) => {
    setFolderSno(e.target.value); // Allow manual editing
  };

  // Handle file upload input


  // Handle file/URL/Text upload logic
  const handleFileSubmit = async () => {
    if (!selectedFolderId) return;

    const folder = folders.find(f => f.id === selectedFolderId);
    let fileDetails = {};

    if (selectedFileType === 'file' && fileInput) {
      fileDetails = {
        sNo: folder.folderSno,
        details: fileInput.name,
        type: 'File',
        action: 'Added',
        date: new Date().toISOString(),
      };
    } else if (selectedFileType === 'url' && urlInput) {
      fileDetails = {
        sNo: folder.folderSno,
        details: urlInput,
        type: 'URL',
        action: 'Added',
        date: new Date().toISOString(),
      };
    } else if (selectedFileType === 'text' && textInput) {
      fileDetails = {
        sNo: folder.folderSno,
        details: textInput,
        type: 'Text',
        action: 'Added',
        date: new Date().toISOString(),
      };
    } else {
      alert('Please provide the required input.');
      return;
    }

    // API call to upload file data
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadfile`, {
        folderName: folder.folderName,
        fileDetails,
      });

      if (response.data.success) {
        const updatedFolders = folders.map(f => {
          if (f.id === selectedFolderId) {
            return { ...f, files: [...f.files, { id: uuidv4(), name: fileDetails.details }] };
          }
          return f;
        });
        setFolders(updatedFolders);
        setSelectedFolderId(null); // Reset folder selection
        setFileInput(null); // Clear file input
        setUrlInput(''); // Clear URL input
        setTextInput(''); // Clear text input
      } else {
        console.error('File upload failed');
      }
    } catch (err) {
      console.error(`Error uploading file: ${err}`);
    }
  };

  // Fetch folders and files
  const getFoldersAndFiles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/list-folders-files`);
      if (response.data.success) {
        setFolders(response.data.folders || []); // Ensure folders is an array
      } else {
        console.error('Failed to fetch folders and files from S3');
      }
    } catch (error) {
      console.error('Error fetching folders and files:', error);
    }
  };

  useEffect(() => {
    getFoldersAndFiles(); // Fetch folders and files when the component mounts
  }, []);

  const handleFolderCreate = async () => {
    // Determine the folder category: use customCategory if 'Others' is selected, otherwise use folderCategory
    const category = folderCategory === 'others' ? customCategory : folderCategory;

    // Check for required fields (folderName, folderCategory, and folderType)
    if (!folderName || !category || !folderType) {
      console.error('Folder Name, Category, and Type are required');
      alert('Please fill out all required fields.');
      return; // Exit the function if validation fails
    }

    // Create a new folder object
    const newFolder = {
      id: new Date().getTime(),
      folderSno,
      folderName,
      folderCategory: category,  // Use the correct folder category
      folderType,                // Set the folder type
      files: [],                 // Initialize with an empty files array
    };

    // API call to upload folder metadata to S3 and MongoDB
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadfolder`, {
        folderName: newFolder.folderName,
        category: newFolder.folderCategory,
        folderType: newFolder.folderType,  // Include folderType in the request
      });

      if (response.data.success) {
        // Fetch updated folders from MongoDB and reflect them in the UI
        const updatedFolders = await fetchFolders();
        setFolders(updatedFolders); // Update state with the fetched folders

        // Clear form inputs after successful creation
        setFolderName('');
        setFolderType('');
        setFolderCategory('');
        setFolderSno('');
        setCustomCategory(''); // Clear customCategory
        setShowFolderPopup(false); // Close the popup
        getFoldersAndFiles()
        alert("Folder Created Successfully")
      } else {
        console.error('Failed to upload folder metadata');
      }
    } catch (err) {
      console.error(`Error uploading folder metadata: ${err}`);
    }
  };




  // Function to fetch updated folders list from MongoDB
  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/folders`);
      if (response.data.success) {
        return response.data.folders;
      } else {
        console.error('Failed to fetch folders');
        return [];
      }
    } catch (err) {
      console.error(`Error fetching folders: ${err}`);
      return [];
    }
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedFolderId) {
      console.error('File or selectedFolderId is missing');
      return;
    }

    // Ensure the folders array has been populated and the folder exists
    const folder = folders.find(f => f._id === selectedFolderId);
    if (!folder) {
      console.error(`No folder found for selectedFolderId: ${selectedFolderId}`);
      return;
    }

    // Get current date and time
    const currentDateTime = `${(new Date()).toLocaleDateString('en-GB')} ${(new Date()).toLocaleTimeString('en-GB')}`;

    const fileDetails = {
      sNo: folder.folderSno || 'defaultSno', // Provide fallback for folderSno
      details: file.name,
      type: file.type,
      action: 'Added',
      date: currentDateTime,
    };

    try {
      // Get a pre-signed URL from the server for the S3 upload
      const presignedResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getpresignedurl`, {
        folderName: folder.folderName,
        fileName: file.name,
      });

      if (presignedResponse.data.success && presignedResponse.data.url) {
        // Upload the file to S3 using the pre-signed URL
        await axios.put(presignedResponse.data.url, file, {
          headers: {
            'Content-Type': file.type, // Set the content type for S3
          },
        });

        // Get the S3 file URL from the upload response
        const fileUrl = presignedResponse.data.url.split('?')[0]; // Remove query params to get the direct URL

        // Save file metadata to MongoDB
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadfile`, {
          folderName: folder.folderName,
          fileDetails,
          fileUrl,
        });

        if (response.data.success) {
          // Update folders state and show success message
          const updatedFolders = folders.map(f => {
            if (f.id === selectedFolderId) {
              return {
                ...f,
                files: [
                  ...f.files,
                  {
                    id: uuidv4(),
                    name: file.name,
                    uploadDate: currentDateTime,
                    url: fileUrl,
                  },
                ],
              };
            }
            return f;
          });

          setFolders(updatedFolders);
          setSelectedFolderId(null);

          setMessageStyle('green');
          alert("File uploaded successfully!");
          setMessage("File uploaded successfully!");
          setTimeout(() => setMessage(''), 3000);
          getFoldersAndFiles()
        } else {
          setMessageStyle('red');
          setMessage("File upload failed!");
          setTimeout(() => setMessage(''), 3000);
        }
      }
    } catch (err) {
      console.error(`Error uploading file: ${err}`);
      setMessageStyle('red');
      setMessage("An error occurred while uploading the file.");
      setTimeout(() => setMessage(''), 3000);
    }
  };



  const handleFileClick = async (folderName, fileName) => {
    console.log(`File clicked: ${folderName} / ${fileName}`);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/getpresignedurl`, {
        folderName,
        fileName,
      });

      if (response.data.success && response.data.url) {
        window.open(response.data.url, '_blank'); // Open the file in a new tab
      } else {
        console.error('Failed to get presigned URL');
      }
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
    }
  };

  const handleFolderClose = () => {
    setShowFolderPopup(false)
  }
  const handleFolderClick = (folderId) => {
    setCreateFolderButtonDisible(false)
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null); // Deselect folder if it's already selected
    } else {
      setSelectedFolderId(folderId); // Select the clicked folder
    }
  };
  const handleFolderPopup = () => {
    setShowFolderPopup(true);
  };

  const handleDeleteFolder = async (folderId, folderName) => {
    try {
      // Call the backend API to delete the folder
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deletefolder`, {
        params: { folderId }
      });

      // Show success message
      alert(`Folder ${folderName} deleted successfully`);
      getFoldersAndFiles()

      // Optionally: Remove the folder from the local state after deletion
      // If you want to immediately update the UI without reloading the list from the backend.
      // setFolders(prevFolders => prevFolders.filter(folder => folder._id !== folderId));

    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder.');
    }
  };

  const handleFileDelete = async (folderId, fileId, fileName) => {
    try {
      console.log('Received request to delete:', folderId, fileId, fileName);

      // Send the DELETE request with query parameters
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deletefile`, {
        params: {
          folderId,
          fileId,
          fileName,
        },
      });

      if (response.status === 200) {
        console.log('File deleted successfully');
        alert("File deleted successfully");
        getFoldersAndFiles()
      } else {
        console.error('Failed to delete file');
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert(`Error deleting file: ${error.message}`);
    }
  };


  const handleCancel = () => {
    setShowPopup(false);
    setSelectedFileType(null); // Clear selected file type
    setFileInput(null); // Clear file input
    setUrlInput(''); // Clear URL input
    setTextInput(''); // Clear text input
  };
  const handlePopupClose = () => {
    setPopupVisible(false);
  };
  const handleClosePopup = () => {
    setPopupVisible(false)
  }


  return (
    <div className="main-body-container">
      <div className="w-80 business-container">
        <div className="business-container-header">
          <h1 className="bc-main-heading mt-5">Files Dataset</h1>
          {createFolderButtonVisible && <button onClick={handleFolderPopup}                    className="btn addnew-button btn-primary"
          >
            {folders.length === 0 ? "Create Folder" : "Add Book"}
          </button>}


          {showFolderPopup && (
            <div className="folder-popup">
              <h3 >Create Folder</h3>

              {/* Folder Serial Number Input */}
              <input
                type="text"
                value={folderSno}
                onChange={handleInputChange}
                placeholder="S.No"
                className="addnew-input"
              />

              {/* Folder Name Input */}
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder Name"
                className="addnew-input"
              />

              {/* Folder Category Select */}
              <div>
                <select
                  value={folderCategory}
                  onChange={(e) => setFolderCategory(e.target.value)}
                  className="addnew-input"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="others">Others</option>
                </select>

                {/* Custom Category Input (Visible when 'Others' is selected) */}
                {folderCategory === "others" && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category"
                    className="addnew-input mt-2"
                  />
                )}
              </div>

              {/* Folder Type Input */}
              <input
                type="text"
                value={folderType}
                onChange={(e) => setFolderType(e.target.value)}
                placeholder="Type"
                className="addnew-input"
              />

              {/* Cancel Button */}
              <button
                onClick={handleFolderClose}
                className="btn addnew-button btn-success"
                >
                Cancel
              </button>

              {/* Create Folder Button */}
              <button
                onClick={handleFolderCreate}
                className="btn addnew-button btn-success"
                >
                Create Folder
              </button>
            </div>

          )}
        </div>


        <hr style={{ color: "white" }} />
        <div className="business-container-body">
          {selectedFolderId === null ? (

            <div className="folder-list">
              <div className="folder-details">
                <h2 className="table-header">S.No</h2>
                <h2 className="table-header">Folder Name</h2>
                <h2 className="table-header">Folder Category</h2>
                <h2 className="table-header">Type</h2>
                <h2 className="table-header">Date</h2>
                <h2 className="table-header">Delete</h2>
              </div>
              {folders.length > 0 ? (
                folders.map((folder, index) => (
                  <div key={folder._id} className="folder-item">
                    <div className="folder-row">
                      <div className="table-data" onClick={() => handleFolderClick(folder._id)}>{index + 1}</div>
                      <div className="table-data" onClick={() => handleFolderClick(folder._id)}>{folder.folderName}</div>
                      <div className="table-data" onClick={() => handleFolderClick(folder._id)}>{folder.folderCategory}</div>
                      <div className="table-data" onClick={() => handleFolderClick(folder._id)}>{folder.folderType}</div>
                      <div className="table-data" onClick={() => handleFolderClick(folder._id)}>{new Date(folder.createdAt).toLocaleString()}</div>
                      <div className="table-data">
                        <button
                          onClick={() => handleDeleteFolder(folder._id, folder.folderName)}
                          className="delete-folder-button"
                        >
                          Delete Folder
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No folders created yet. Click the button above to create one.</p>
              )}
            </div>


          ) : (
            <div className="folder-content">

              <button
                onClick={handleAddFileClick}
                className="add-file-button addnew-button bg-blue-500 text-white p-2 rounded-lg fixed top-4 right-4 add_new_file mt-5"
              >
                Add File
              </button>
              {showFileTypeDropdown && (
                <div className="file-type-dropdown bg-white shadow-lg rounded-md p-2">
                  <p onClick={() => handleFileTypeSelect('file')} className="dropdown-item">
                    File
                  </p>
                  <p onClick={() => handleFileTypeSelect('url')} className="dropdown-item">
                    URL
                  </p>
                  <p onClick={() => handleFileTypeSelect('text')} className="dropdown-item">
                    Text
                  </p>
                </div>
              )}
              {popupVisible && (
                <div className="popup-overlay  popup-files">
                  <div className="popup bg-white shadow-lg rounded-lg p-6">
                    {selectedFileType === 'file'  && (
                      <div>
                        <input type="file" onChange={handleFileUpload} />
                        <button
                          className="addnew-button bg-green-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-success" 
                          onClick={handleClosePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="addnew-button bg-green-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-success"
                          onClick={handleFileSubmit}
                        >
                          Upload
                        </button>
                      </div>
                    )}

                    {selectedFileType === 'url' && (
                      <div>
                        <input
                          type="url"
                          placeholder="Enter URL"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="url-input p-2 border rounded-lg"
                        />
                        <button
                          className="addnew-button bg-green-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-success"
                          onClick={handleClosePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="addnew-button bg-green-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-success"
                          onClick={handleFileSubmit}
                        >
                          Upload
                        </button>
                      </div>
                    )}

                    {selectedFileType === 'text' && (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter Text"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="text-input p-2 border rounded-lg"
                        />
                        <button
                          className="addnew-button bg-green-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-success"
                          onClick={handleClosePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="addnew-button bg-green-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-success"
                          onClick={handleFileSubmit}
                        >
                          Upload
                        </button>
                      </div>
                    )}

                    
                  </div>
                </div>
              )}
              {folders.map(folder => (
                <div key={folder._id}>


                  {/* Show files only if the folder is selected */}
                  {selectedFolderId === folder._id && (
                    <div className="file-section">

                      <div className="files-list">
                      <div className="folder-details">
                              <h2 className="table-header">S.No</h2>
                              <h2 className="table-header">Folder Name</h2>
                              <h2 className="table-header">File Type</h2>
                              <h2 className="table-header">Link</h2>
                              <h2 className="table-header">Date</h2>
                              <h2 className="table-header">Delete</h2>
                            </div>

                        {folder.files.map((file, index) => (

                          <div key={file._id} className="files-container">
                            
                            <div className='file-row'>
                              <div className="table-data">{index + 1}</div>
                              <div className="table-data">
                                <button
                                  onClick={() => handleFileClick(folder.folderName, file.name)}
                                  className="file-link"
                                >
                                  {file.name}
                                </button>
                              </div>
                              <div className="table-data">{file.type}</div>
                              <div className="table-data">
                                <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
                              </div>
                              <div className="table-data">{new Date(file.date).toLocaleDateString()}</div>
                              <div className="table-data">
                                <button
                                  onClick={() => handleFileDelete(folder._id, file._id, file.name)}
                                  className="delete-button bg-red-500 text-white p-2 rounded-lg mt-4 btn addnew-button btn-danger"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>


                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
              onClick={handleBackButtonClick}
              className="btn back-button btn-secondary mb-4"
            >
              Back
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetApp;
