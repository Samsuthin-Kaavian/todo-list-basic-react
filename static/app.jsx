const {useState, useEffect} = React;

const TodoList = ({items, setItems,display}) =>{
    useEffect(() => {
        fetch('/todo').then(res => res.json()).then(({todoItems}) =>setItems(todoItems));
    }, []);

    const remove =(id) =>{
        console.log(id);
        fetch('/todo',{method :"DELETE", body: JSON.stringify({id}),headers:{'Content-Type':'application/json'}})
            .then(res => res.json())
            .then(({todoItems,msg})=>{
                console.log(todoItems,msg)
                setItems(todoItems);
            })
    }
    return(
        <table>
            <tr>
                <th>Text</th>
                <th>Author</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Delete</th>
            </tr>
            <h2 style={{display : display}}>Record Not Found</h2>
            {items.map(({_id,text, author, location,priority},idx) =><tr key={`todo-${idx}-id-${_id}`}>
                <td>{text}</td>
                <td>{author}</td>
                <td>{location}</td>
                <td>{priority}</td>
                <td><a href='#' onClick={()=>remove(_id)}>🗑️</a></td>
            </tr>)}
        </table>
    );
    
}

const AddTodo =({setItems}) =>{
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [location, setLocation] = useState('');
    const [priority, setPriority] = useState(0);

    const insert =(text,author,location,priority) =>{
        console.log(text,author,location,priority,'check');
        if(text ==='' || author ==='' || location ==='' || priority <= 0){
            console.log('Please Check below condition:! \n 1.InputBox can not be empty \n 2.Priority must be a positive Number.');
            return;
        }
        fetch('/todo',{method : 'POST', body: JSON.stringify({text,author,location,priority}),headers:{'Content-Type':'application/json'}})
            .then(res => res.json())
            .then(({todoItems,msg}) =>{
                console.log(msg,1);
                setText('');
                setAuthor('');
                setLocation('');
                setPriority(0);
                setItems(todoItems);
                return;
            });
    }
    return (
        <div className='addToDo'>
            <label htmlFor='text'>Todo Text :</label>
            <input type='text' onChange={(e)=>setText(e.target.value)} value={text}/> <br />
            <label htmlFor='author'>Author : &nbsp;&nbsp;&nbsp;</label>
            <input type='text' onChange={(e)=>setAuthor(e.target.value)} value={author}/> <br />
            <label htmlFor='location'>Location : </label>
            <input type='text' onChange={(e)=>setLocation(e.target.value)} value={location}/> <br />
            <label htmlFor='text'>Priority : &nbsp;</label>
            <input type='number' onChange={(e)=>setPriority(e.target.value)} value={priority}/> <br />
            <button onClick={()=>insert(text,author,location,priority)}>Insert</button>
        </div>
    );
}
const SearchTodo =({setItems,setDisplay}) =>{
    const [authors,setAuthors] = useState([]);
    const [locations,setLocations] = useState([]);
    const [priorities, setPriorities] =useState([]);

    const [text, setText] = useState('');
    const [author,setAuthor] = useState('');
    const [location,setLocation] = useState('');
    const [priority, setPriority] =useState(0);

    useEffect(() =>{
        fetch('/authors').then(res => res.json()).then(({authors}) => setAuthors(authors))
        fetch('/locations').then(res => res.json()).then(({locations}) => setLocations(locations))
        fetch('/priorities').then(res => res.json()).then(({priorities}) => setPriorities(priorities))
    },[]);

    const filter =(text,author,location,priority) =>{
        console.log(text,author,location,priority);
        fetch('/search',{method : 'POST', body: JSON.stringify({text,author,location,priority}),headers:{'Content-Type':'application/json'}})
            .then(res => res.json())
            .then(({todoItems}) =>{
                console.log(todoItems);
                if(todoItems.length === 0){
                     setDisplay('');
                     setItems(todoItems);
                     return;
                }
                setDisplay('none')
                setItems(todoItems)
            });
        return;
    }

    return (
        <div className='search'>
            <label htmlFor='text'>Text</label> 
            <input type='text' onChange={(e) => setText(e.target.value)} value={text} />

            <label htmlFor='author'>Author</label>
            <select onChange={(e) =>setAuthor(e.target.value)} value={author}> <option></option>
                {authors.map((el,idx) => <option key={`author-${el}-${idx}`}>{el}</option>)}</select>

            <label htmlFor='location'>Location</label>
            <select onChange={(e) =>setLocation(e.target.value)} value={location}> <option></option>
                {locations.map((el,idx) => <option key={`location-${el}-${idx}`}>{el}</option>)}</select>
            <label htmlFor='priority'>Prority</label>
            <select onChange={(e) =>setPriority(e.target.value)} value={priority}> <option></option>
                {priorities.map((el,idx) => <option key={`priority-${el}-${idx}`}>{el}</option>)}</select>
            <button onClick={()=> filter(text,author,location,priority)}>🔍</button>
        </div>
    );
}
const App =() =>{
    const [items, setItems] = useState([]);
    const [display,setDisplay] =useState('none');
    return (<div className='container'>
                <SearchTodo setItems = {setItems} setDisplay={setDisplay}/>
                <AddTodo setItems={setItems} />
                <TodoList items={items} setItems={setItems} display={display}/>
            </div>);
}

ReactDOM.render(<App />, document.getElementById('root'));