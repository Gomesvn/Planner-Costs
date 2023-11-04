import styles from './Home.module.css'
import saving from '../../img/saving.png'
import { LinkButton } from '../layout/LinkButton'
export function Home(){
    return (
        <section className={styles.home_container}>
            <img src={saving} alt="Costs" />
            <div>
                <h1>Welcome to <span>Planner Cost's</span></h1>
                <p>Start managing your projects right now!</p>
                <LinkButton to="/newproject" text="Create a new project"/>
            </div>
        </section>
    )
}