import React, { useState } from 'react';
import MindMapCanvas from './components/MindMapCanvas';
import Sidebar from './components/Sidebar';

function App(){
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const handleColorChange = (id, color) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, color } } : node
            )
        );
    }

  return (
    <div style ={{ display: 'flex', height: '100vh'}}>
      <MindMapCanvas nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
      <Sidebar nodes={nodes} onColorChange={handleColorChange} />
    </div>
  );
}

export default App;