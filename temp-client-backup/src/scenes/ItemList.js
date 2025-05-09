const ItemList = ({ items, editingTaskId, editedText, inputRef, handlers }) => {
    const { startEditing, setEditedText, saveEdit, toggleItem, cancelEdit } = handlers;
    return (
        <div className="item-list">
            {items.map((item) => (
                <div className="item-content" key={ item.id }>
                        <input 
                            type="checkbox" 
                            checked={ item.checked } 
                            onChange={ () => toggleItem(item.id) }
                        />
                        { editingTaskId === item.id ? (
                            <input 
                                type="text" 
                                value={ editedText } 
                                ref={inputRef}
                                onChange={ (e) => setEditedText(e.target.value) }
                                onKeyDown={ (e) => {
                                    if (e.key === 'Enter') {
                                        saveEdit(item.id);
                                    }
                                    else if (e.key === 'Escape') {
                                        cancelEdit();
                                    }
                                }}
                            />
                        )
                        : (
                            <span onDoubleClick={ () => startEditing(item.id) }>
                                { item.item }
                            </span>
                    )}
                </div>
            ))}
        </div>
    );
};
export default ItemList;