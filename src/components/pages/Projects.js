import { useLocation } from 'react-router-dom';

import styles from './Projects.module.css'

import { Message } from "../layout/Message";
import { Container } from "../layout/Container";
import { LinkButton } from '../layout/LinkButton';
import { ProjectCard } from '../projects/ProjectCard';
import { useEffect, useState } from 'react';
import { Loading } from '../layout/Loading';


export function Projects(){
  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setPrejectMessage] = useState('')
  
  const location = useLocation()
  let message = ''
  if(location.state){
    message = location.state.message
  }

  useEffect(()=>{
    setTimeout(()=> {
      fetch("http://localhost:5000/projects", {
          method: "GET",
          headers: {
              'Content-Type': 'aplication/json', 
          },
      })
      .then( resp => resp.json())
      .then( data => {
          setProjects(data)
          setRemoveLoading(true)
      })
      .catch((err) => console.log(err))
    }, 300)
  }, [])


  function removeProject(id){
    fetch(`http://localhost:5000/projects/${id}`, {
          method: "DELETE",
          headers: {
              'Content-Type': 'aplication/json', 
          }
    })
    .then(resp => resp.json())
    .then(() => {
      setProjects(projects.filter((project) => project.id !== id))
      setPrejectMessage('Projeto removido com sucesso!')
    })
    .catch(err => console.log(err))
  }
    return (
       <div className={styles.project_container}>
         <div className={styles.title_container}>
            <h1>My projects</h1>
            <LinkButton 
            to="/newproject" 
            text="Create project"
            />
         </div>
         {message && (<Message type="sucess" msg={message}/>)}
         {projectMessage && (<Message type="sucess" msg={projectMessage}/> )}
          <Container customClass="start">
            {projects.length > 0 &&
              projects.map((project) => (
                <ProjectCard 
                id={project.id}
                name={project.name}
                budget={project.budget}
                category={project.category.name}
                key={project.id}
                handleRemove={removeProject}
                />
              ))
            }
            {!removeLoading && <Loading />}
            {removeLoading && projects.length === 0 && (
              <p>There are no registered projects!</p> 
            )}
          </Container>
       </div>
    )
}