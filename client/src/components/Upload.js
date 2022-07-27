import react from 'react';
import Axios from 'axios';
import { useState } from 'react';
export default function Upload() {
    const [name, setName] = useState();
    const [file, setFile] = useState(null);
    const upload = () => {
        const data=new FormData();
        data.append('name',name);
        data.append('file',file);
        setName(file.name);
       
        let answer="";
        Axios.post('http://localhost:4000/upload',data)
        .then(res=>{ answer=res;})
        .catch(err=>{console.log(err)});
         setTimeout(() => {
            if(answer.data==="Incorrect Page"){
                window.location.href = "/IncorrectDatatable";
                // console.log("Incorrect Page");
            }else{
                window.location.href = "/CorrectDatatable";
                // console.log("Correct Page");
            }
        }, 3000);
    }
    const reset=()=>{
        Axios.get('http://localhost:4000/reset')
    }
    return (
        <>
            <div className='upload'>
                <h1>Upload Json File </h1>
                <input accept='.json' type='file' onChange={(e) =>setFile(e.target.files[0])} />
                <button onClick={upload}>Upload</button>
                <button onClick={reset}>Reset</button>
            </div>
        </>
    );
}