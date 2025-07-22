function Sidebar({ nodes, onColorChange }) {
    const pastelColors = [
        '#FFD6D6', // light pink
        '#FFF5BA', // light yellow
        '#D5F0C1', // light green
        '#A9DEF9', // light blue
        '#E4C1F9', // light purple
        '#FBC4AB', // peach
        '#B5EAD7', // mint
    ];

    return (
        <div style={{ width: 250, borderLeft: '2px solid #ccc', padding: 10, overflowY: 'auto', backgroundColor: 'rgba(245, 245, 245, 1)', borderRadius: '20px' }}>
            <h3>Nodes</h3>
            {nodes.map((node) => (
                <div key={node.id}
                    style={{ padding: 5, borderBottom: '1px solid #ddd'}}>
                        <div style={{ marginBottom: 4 }}>{node.data.label}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {pastelColors.map(color => (
                                <div key={color}
                                onClick={() => onColorChange(node.id, color)}
                                style={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: color,
                                    border: color === node.data.color ? '2px solid #333' : '1px solid #ccc',
                                    cursor: 'pointer',
                                    borderRadius: 4
                                }}
                                ></div>
                            ))}
                        </div>
                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap:'4px'}}>
                            {(node.data.tags || []).map((tag, index) => (
                                <span key={index}
                                    style={{
                                        background: '#eee',
                                        padding: '4px, 2px',
                                        borderRadius: '2px',
                                        fontSize: '0.9em',
                                        color: '#333',
                                        userSelect: 'none',
                                    }}
                                >{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}      
        </div>
    )
}

export default Sidebar;