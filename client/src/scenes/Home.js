import { useEffect, useState, useRef } from "react";
import ItemList from "./ItemList";

const Home = () => {

    const [item, setItem] = useState('');
    const [items, setItems] = useState([]);
    const [isSorted, setSorted] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8000/items');
                const data = await res.json();
                setItems(data);          
            } catch (e) {
                console.log(e.message);
            }    
        }

        fetchData();
    }, []);

    useEffect(() => {
        let result = [...items]; // make a copy of items

        // apply search filter
        result = result.filter(item =>
            item.item.toLowerCase().startsWith(searchQuery.toLowerCase())
        );

        // apply sorting
        result = isSorted
                ? [...result].sort((a, b) => a.checked - b.checked)
                : result  
        
        // setFilteredItems
        setFilteredItems(result);
    }, [items, searchQuery, isSorted])

    useEffect(() => {
        inputRef.current?.focus();
    }, [editingTaskId])

    const startEditing = (id) => {
        const item = items.find(i => i.id === id);
        setEditingTaskId(item.id);
        setEditedText(item.item);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch('http://localhost:8000/items', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item, checked: false })
            });

            const newItem = await res.json();
            setItems(prev => [...prev, newItem]);
            setItem('');

        } catch (e) {
            console.log(e.message);
        }
    }

    const toggleItem = async (id) => {
        const updatedItems = items.map(i =>
            i.id === id ? { ...i, checked: !i.checked } : i
        );
        setItems(updatedItems);

        const toggledItem = updatedItems.find(i => i.id === id);

        try {
            await fetch(`http://localhost:8000/items/${id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ checked: toggledItem.checked })
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleClear = async () => {

        if(!window.confirm("Are you sure you want to clear the entire list?")) return;

        for (const item of items) {
            await fetch(`http://localhost:8000/items/${item.id}`, {
                method: 'DELETE'
            })
        }

        setItems([]);
        setItem('');
    }

    const saveEdit = async (id) => {
        const item = items.find(i => i.id === id);
        try {
            const res = await fetch(`http://localhost:8000/items/${item.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item: editedText, checked: item.checked })
            });

            if (!res.ok) {
                throw new Error('There was an error saving your edit');
            }

            const updatedItem = await res.json();
            setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updatedItem} : item)))

        } catch (e) {
            console.log(e.message);
            alert(e.message);
        } finally {
            setEditedText('');
            setEditingTaskId(null);
        }
    }

    const cancelEdit = () => {
        setEditedText('');
        setEditingTaskId(null);
    }



    return (
        <div className="to-do-list">
            <h2>To-Do List</h2>

            <label>Sort by unchecked?</label>
            <input type="checkbox" checked={ isSorted } onChange={ () => setSorted(prev => !prev) }/>

            <div className="search-bar">
                <input type="text" placeholder="Search tasks" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>


            {<ItemList 
                items={ filteredItems } 
                inputRef={ inputRef }
                editingTaskId={ editingTaskId } 
                editedText= { editedText } 
                handlers={{
                    startEditing,
                    setEditedText, 
                    saveEdit,
                    toggleItem,
                    cancelEdit} 
                }
            />}

            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value) } 
                    required
                />
                <button>Add</button>
            </form>
            <button onClick={ handleClear }>Clear</button>

        </div>
    );
};
 
export default Home;