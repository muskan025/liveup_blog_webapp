
import { google, outlook, office365, yahoo } from "calendar-link"; 
import googleCal from '../../assets/google.png'
import outlookCal from '../../assets/outlookk.svg'
import yahooCal from '../../assets/yaho.svg'
import microsoft365Cal from '../../assets/microsoft365.svg'
import styles from './styles/styles.module.css'
 
const Calendar = ({ isOpen }) => {

  const event = {  
    title: 'Your event name here...',
    description: 'I create event so that I do not miss on things that will enhance the quality  of my life',
    start: '2024-07-14 10:00:00 +0300',
    duration: [8, 'hour'],
  };

  const googleUrl = google(event)       
  const outlookUrl = outlook(event)
  const microsoft365Url = office365(event)
  const yahooUrl = yahoo(event)
        
  return (

    <ul className={`${isOpen ? styles.opacity1 : styles.opacity0} ${styles.calendar_list}`}>

      <li><a href={googleUrl} target="_blank" rel="noopener noreferrer">
        <img src={googleCal} alt="Google Calendar" />Google</a></li> 
      <li><a href={microsoft365Url} target="_blank" rel="noopener noreferrer">
        <img src={microsoft365Cal} alt="Microsoft365 Calendar"/>
        Microsoft 365</a></li>
      <li><a href={outlookUrl} target="_blank" rel="noopener noreferrer">
      <img src={outlookCal} alt="Outlook Calendar"/>
        Outlook</a></li>
      <li><a href={yahooUrl} target="_blank" rel="noopener noreferrer">
      <img src={yahooCal} alt="Yahoo Calendar"/>
        Yahoo</a></li>

    </ul>

  )
}

export default Calendar


 