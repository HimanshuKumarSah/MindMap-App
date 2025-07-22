import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function EditableNode({ data, id }) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingSubtitle, setEditingSubtitle] = useState(false);
    const inputRef = useRef(null);
    const subtitleInputRef = useRef(null);

    useEffect(() => {
        if (editingTitle && inputRef.current) inputRef.current.focus();
    }, [editingTitle]);

    useEffect(() => {
        if (editingSubtitle && subtitleInputRef.current) subtitleInputRef.current.focus();
    }, [editingSubtitle]);

    useEffect(() => {
        if (subtitleInputRef.current) {
            subtitleInputRef.current.style.height = 'auto';
            subtitleInputRef.current.style.height = subtitleInputRef.current.scrollHeight + 'px';
        }
    }, [data.subtitle, editingSubtitle]);

    const onTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current.blur();
            setEditingTitle(false);
        }
    };

    const onSubtitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                const cursorPos = subtitleInputRef.current.selectionStart;
                const value = data.subtitle;
                const newValue = value.substring(0, cursorPos) + '\n' + value.substring(cursorPos);
                data.onSubtitleChange(id, newValue);

                setTimeout(() => {
                    subtitleInputRef.current.selectionStart = subtitleInputRef.current.selectionEnd = cursorPos + 1;
                }, 0);
                e.preventDefault();
            } else {
                e.preventDefault();
                subtitleInputRef.current.blur();
                setEditingSubtitle(false);
            }
        }
    };
    
    return (
        <div style={{ 
            padding: 10, 
            border: '1px solid #222', 
            borderRadius: 5, 
            position: 'relative', 
            backgroundColor: data.color || '#fff', 
            fontSize: '9px', 
            minWidth: 100, 
            maxWidth: 200, 
            wordWrap: 'break-word', 
            overflowWrap: 'break-word'
        }}
        >
            < Handle
                type="target"
                position={Position.Top}
                id="target"
                style={{ background: '#555' }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="target"
            />
                {editingTitle ? (
                    <input 
                        ref={inputRef}
                        value={data.label}
                        onChange={(e) => data.onChange(id, e.target.value)}
                        onBlur={() => setEditingTitle(false)}
                        onKeyDown={onTitleKeyDown}
                        style={{ width: '100%', fontSize: '1em', fontWeight: 'bold' }}
                    />
                ) : (
                        <div onDoubleClick={() => setEditingTitle(true)} 
                            style={{ 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer', 
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',    
                                    overflowWrap: 'break-word', 
                                }}>
                            {data.label}
                        </div>
                    )}

                {editingSubtitle ? (
                    <textarea
                        rows={2}
                        ref={subtitleInputRef}
                        value={data.subtitle}
                        onChange={(e) => data.onSubtitleChange(id, e.target.value)}
                        onBlur={() => setEditingSubtitle(false)}
                        onKeyDown={onSubtitleKeyDown}
                        style={{ width: '100%', fontSize: '0.85em', color: '#555', marginTop: 4}}
                    />
                ) : (
                    <div
                        onDoubleClick={() => setEditingSubtitle(true)}
                        style={{ fontSize: '0.85em', 
                                    color: '#555', 
                                    marginTop: 4, 
                                    cursor: 'pointer',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word', 
                                    overflowWrap: 'break-word', 
                                    wordBreak: 'break-word' 
                                }}
                    >
                        {data.subtitle}
                    </div>
                )}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -55,
                        left: '20%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '2px 6px',
                        fontSize: '0.65em',
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                    }}
                    >
                        {data.tags.map((tag, index) => (
                        <span key={index}
                            style={{
                                    background: '#eee',
                                    padding: '1px 3px',
                                    marginRight: '2px',
                                    borderRadius: '4px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    lineHeight: '1', 
                                }}
                        >
                            {tag}
                                <span
                                    onClick={() => data.onRemoveTag(id, tag)}
                                    style={{ marginLeft: 2, cursor: 'pointer', color:'red'}}
                                    >x</span>
                        </span>
                        ))}
                        <button
                            onClick={() => {
                                const newTag = prompt('Enter new tag:');
                                if (newTag) {
                                    data.onAddTag(id, newTag);
                                }
                            }}
                            style={{ 
                                marginLeft: 4, 
                                fontSize: '0.85em',
                                padding: '2px 4px',
                                border: 'none',
                                borderRadius: '4px',
                                background: '#ddd',
                                cursor: 'pointer'}}
                        >+</button>
                    </div>
                </div>
        </div>
        
    );
}

export default EditableNode;