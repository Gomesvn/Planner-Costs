import {useEffect, useState} from 'react'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'

function ProjectForm({ handleSubmit, btnText, projectData}){
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})
    //requisição(request com fetch api)
    useEffect(()=>{
        fetch("http://localhost:5000/categories", {
        method: "GET",
        headers: {
            'Content-Type': 'aplication/json', 
        },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setCategories(data)
        })
        .catch((err) => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    //funciona para qualquer input onde digitamos 
    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})//independente do input que estiver sendo preenchido a prop será mudada
    }   

    function handleCategory(e){
        setProject({ 
            ...project, 
            category: {
                id: e.target.value, 
                name: e.target.options[e.target.selectedIndex].text
            }
        })
    }

    return(
        <form onSubmit={submit} className={styles.form}>
            <Input 
            type="text"
            text="Name"
            name="name"
            placeholder="Enter project name"
            handleOnChange={handleChange}
            value={project.name ? project.name : ''}
            />
            <Input 
            type="number"
            text="Budget for the Project"
            name="budget"
            placeholder="Enter total budget"
            handleOnChange={handleChange}
            value={project.budget ? project.budget : ''}
            />
            <Select 
            name="category_id"
            text="Select the category"
            options={categories}
            handleOnChange={handleCategory}
            value={project.category ? project.category.id : ''}
            />
            <SubmitButton 
            text={btnText}
            />
        </form>
    )
}
export default ProjectForm;