import React, {useState, useRef} from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'react-flow-renderer';
import EditableNode from './EditableNode';
import { v4 as uuidv4 } from 'uuid';
import {Background} from 'react-flow-renderer';

const nodeTypes = { editableNode: EditableNode };

function MindMapCanvas({ nodes, edges, setNodes, setEdges}) {

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const clickTimeout = useRef(null);
    const clickCount = useRef(0);
    const onPaneClick = (event) => {
        clickCount.current += 1;

        if (clickCount.current === 1) {
            clickTimeout.current = setTimeout(() => {
                clickCount.current = 0;
            }, 250);
        } else if (clickCount.current === 2) {
            clearTimeout(clickTimeout.current);
            clickCount.current = 0;

            const reactFlowPosition = reactFlowInstance.project({
                x: event.clientX,
                y: event.clientY,
            });
            if (!reactFlowPosition) return;

            const newNode = createNewNode({
                position: reactFlowPosition,
                onNodeLabelChange,
                onNodeSubtitleChange,
            });
            setNodes((nds) => [...nds, newNode]);
        }
    };

    const onNodeLabelChange = (id, newLabel) => {
        setNodes((nds) => 
            nds.map((node) =>
                node.id === id ? { ...node, data: { 
                        ...node.data, 
                        label:newLabel,
                        subtitle: node.data.subtitle,
                        onChange: onNodeLabelChange,
                        onSubtitleChange: onNodeSubtitleChange,
                        color: node.data.color
                } } : node
            )
        );  
    };

    const onNodeSubtitleChange = (id, newSubtitle) => {
        setNodes((nds) => 
            nds.map((node) => 
                node.id === id ? {
                    ...node,
                    data: {
                        ...node.data,
                        subtitle: newSubtitle,
                        onChange: onNodeLabelChange,
                        onSubtitleChange: onNodeSubtitleChange,
                        color: node.data.color
                    }
                } : node
            )
        );
    };

    const onAddTag = (id, newTag) => {
        setNodes((nds) => 
            nds.map((node) =>
                node.id === id ? {
                    ...node,
                    data: {
                        ...node.data,
                        tags: [...(node.data.tags || []), newTag],
                        onAddTag,
                        onRemoveTag,
                        onChange: onNodeLabelChange,
                        onSubtitleChange: onNodeSubtitleChange
                    }
                } : node
            )
        );
    };

    const onRemoveTag = (id, tagToRemove) => {
        setNodes((nds) => 
            nds.map((node) => 
                node.id === id ? {
                    ...node,
                    data: {
                        ...node.data,
                        tags: node.data.tags.filter(tag => tag !== tagToRemove),
                        onAddTag,
                        onRemoveTag
                    }
                } : node
            )
        );
    };

    function createNewNode({ setNodes, label = 'New Node', subtitle = 'Secondary Text', color = '#FFD6D6', position = { x: 100, y: 100 }, onAddTag, onRemoveTag } = {}) {
    return {
        id: uuidv4(),
        type: 'editableNode',
        data: { 
            label, 
            subtitle, 
            color, 
            onChange: onNodeLabelChange, 
            onSubtitleChange: onNodeSubtitleChange,
            tags: [] },
        position,
    };
}

    const addNode =() => {
        const newNode = createNewNode({ position: { x: 100, y: 100 }, onNodeLabelChange, onNodeSubtitleChange });
        setNodes((nds) => [...nds, newNode]);
    };

    const onConnect = (connection) => setEdges((eds) => addEdge(connection, eds));
    const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
    const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));
    
    const nodesWithProps = nodes.map(node => ({
        ...node,
        type: 'editableNode',
        data: { ...node.data, onChange: onNodeLabelChange, onSubtitleChange: onNodeSubtitleChange, onAddTag, onRemoveTag },
    }));

    return (
        <div style={{ flexGrow: 1, height: '100%'}}>
            <ReactFlow 
                nodes={nodesWithProps}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onInit={setReactFlowInstance}
                onPaneClick={onPaneClick}
                fitView
                style={{ width: '100%', height: '100%', backgroundColor: '#ffffffff' }}
            >
                <Background
                    color="#000000"
                    gap={50}
                    variant="dots"
                />
            </ReactFlow>
            <button 
                onClick = {addNode}
                style ={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    padding: '8px 12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >Add Node</button>
        </div>
    );
}

export default MindMapCanvas;
