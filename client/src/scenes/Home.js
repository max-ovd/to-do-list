import { useEffect, useState, useRef } from "react";
import ItemList from "./ItemList";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import api from '../lib/axiosClient.js' 

const Home = () => {

    const [item, setItem] = useState('');
    const [items, setItems] = useState([]);
    const [isSorted, setSorted] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [lastDeletedItem, setLastDeletedItem] = useState(null);
    const inputElement = useRef(null);
    const navigate = useNavigate();
    const { user, loading } = useAuth();


    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate])


    const fetchItems = async () => {
        try {
            const res = await api.get('/items');
            console.log(res);
            const data = res.data;
            setItems(data); 
        } catch (e) {
            console.log("Error fetching: ", e.message);
        }   
    }

    useEffect(() => {
        fetchItems();
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
        inputElement.current?.focus();
    }, [editingTaskId])

    const startEditing = (id) => {
        const editingItem = items.find(i => i._id === id);
        setEditingTaskId(editingItem._id);
        setEditedText(editingItem.item);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await api.post('/items', {
                item, 
                checked: false
            });

            const newItem = res.data;
            setItems(prev => [...prev, newItem]);
            setItem('');

        } catch (e) {
            console.log(e.message);
        }
    }

    const toggleItem = async (id) => {
        const toggledItem = items.find(i => i._id === id);

        try {
            await api.patch(`/items/${id}`, {
                checked: !toggledItem.checked
            })
        } catch (e) {
            console.log(e.message);
        }

        setItems(prev =>
            prev.map(i =>
                i._id === id ? { ...i, checked: !i.checked } : i
            )
        )
    }

    const handleClear = async () => {

        if(!window.confirm("Are you sure you want to clear the entire list?")) return;

        await api.delete('/items')

        setItems([]);
        setItem('');
    }

    const saveEdit = async (id) => {
        const currentItem = items.find(i => i._id === id);
        try {
            const res = await api.patch(`/items/${id}`, {
                item: editedText,
                checked: currentItem.checked 
            })

            if (res.status !== 200) {
                throw new Error('There was an error saving your edit');
            }

            const updatedItem = res.data;
            setItems(prev => prev.map(i => (i._id === id ? { ...i, ...updatedItem} : i)))

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

    const deleteItem = async (id) => {
        try {
            const res = await api.delete(`/items/${id}`);

            const deletedItem = res.data
            setLastDeletedItem(deletedItem);
            setItems(prev => prev.filter(item => item._id !== id))
        } catch (e) {
            console.log("Failed to delete item: ", e.message)
        }
    }

    const handleUndo = async () => {
        if (lastDeletedItem === null) return;
        const updatedItems = [...items, lastDeletedItem];
        setItems(updatedItems)
        setLastDeletedItem(null);

        try {
            await api.post('/items', {
                _id: lastDeletedItem.id,
                item: lastDeletedItem.item,
                checked: lastDeletedItem.checked
            })
            
        } catch (e) {
            console.log('Failed to undo message: ', e.message);
        }
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
                inputElement={ inputElement }
                editingTaskId={ editingTaskId } 
                editedText={ editedText } 
                handlers={{
                    startEditing,
                    setItems,
                    setEditedText, 
                    saveEdit,
                    toggleItem,
                    cancelEdit,
                    deleteItem
                }}
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
            <button onClick={ handleUndo }>Undo Delete</button>
            <button onClick={ async () => await supabase.auth.signOut()}>Log Out</button>
        </div>
    );
};
 
export default Home;