import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const App = () => {
  const [addedData, setAddedData] = useState([]);
  const [updatedText, setUpdatedText] = useState(""); 

  const handleAddTextUpdate = (updatedText) => {
    setAddedData([updatedText]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <ResizableComponentWithInputAndButton onTextUpdate={handleAddTextUpdate} updatedText={updatedText} />
        <ResizableComponentWithButton onUpdateText={(text) => setUpdatedText(text)} /> 
      </div>
      <div className="flex flex-row h-full">
        <ResizableComponentWithCount />
      </div>
    </div>
  );
};

const ResizableComponentWithInputAndButton = ({ onTextUpdate, updatedText }) => { 
  const [inputText, setInputText] = useState("");
  const [addedData, setAddedData] = useState([]);

  useEffect(() => {
    if (updatedText) {
      setAddedData([updatedText]); 
    }
  }, [updatedText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleAddButtonClick = async () => {
    try {
      await axios.post('https://dataneuron-be.onrender.com/data', { type: 'add', newData: inputText });
      console.log("Data added successfully");
      setAddedData([inputText]);
      setInputText(""); 
      onTextUpdate(inputText); 
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <ResizableBox
      className="border p-4 m-2"
      width={window.innerWidth}
      height={window.innerHeight}
      minConstraints={[100, 100]}
      maxConstraints={[window.innerWidth, window.innerHeight]}
      resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
    >
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="flex">
          <input type="text" value={inputText} onChange={handleInputChange} style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }} />
          <button onClick={handleAddButtonClick}>Add</button>
        </div>
        {addedData.length > 0 &&
          <table className="mt-4">
            <thead>
              <tr>
                <th>Added Data</th>
              </tr>
            </thead>
            <tbody>
              {addedData.map((data, index) => (
                <tr key={index}>
                  <td>{data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </ResizableBox>
  );
};

const ResizableComponentWithButton = ({ onUpdateText }) => { 
  const [newData, setNewData] = useState("");

  const handleInputChange = (event) => {
    setNewData(event.target.value);
  };

  const handleUpdateButtonClick = async () => {
    try {
      await axios.post('https://dataneuron-be.onrender.com/data', { type: 'update', newData });
      console.log("Data updated successfully");
      onUpdateText(newData); 
      setNewData(""); 
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <ResizableBox
      className="border p-4 m-2"
      width={window.innerWidth}
      height={window.innerHeight}
      minConstraints={[100, 100]}
      maxConstraints={[window.innerWidth, window.innerHeight]}
      resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
    >
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="flex">
          <input type="text" value={newData} onChange={handleInputChange} style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }} />
          <button onClick={handleUpdateButtonClick}>Update</button>
        </div>
      </div>
    </ResizableBox>
  );
};


const ResizableComponentWithCount = () => {
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get('https://dataneuron-be.onrender.com/count');
        const { add, update } = response.data;
        const total = add + update;
        setTotalCount(total);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <ResizableBox
      className="border p-4 m-2"
      width={window.innerWidth}
      height={window.innerHeight}
      minConstraints={[100, 100]}
      maxConstraints={[window.innerWidth, window.innerHeight]}
      resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
    >
      <div className="h-full w-full flex items-center justify-center">
        <p>Total Count: {totalCount}</p>
      </div>
    </ResizableBox>
  );
};

export default App;
