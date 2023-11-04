import ProjectForm from '../projects/ProjectForm'
import styles from './NewProject.module.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export function NewProject(){
    let navigate = useNavigate();

    function createPost(project){
        //initialize cost and services
        project.costs = 0;
        project.services = [];
        
        /*refiz com axios, não tava funcionando certo com fetch
        fetch('http://localhost:5000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
        },
            body: JSON.stringify(project)
        })
        .then((response) => {
            response.json()
        })
        .then((data) =>{
            navigate("/projects")
        })
        .catch((err) => console.log(err))*/

        axios.post('http://localhost:5000/projects', project)
        .then(function (response) {
            console.log(response.data);
            navigate("/projects", { state: { message: 'Projeto criado com sucesso!' } })
        })
        .catch((err) => console.log(err))
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Create a new Project</h1>
            <p>Create your project and then add the services</p>
            <ProjectForm handleSubmit={createPost} btnText="Create project"/>
        </div>
    )
}