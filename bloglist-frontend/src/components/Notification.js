import React from 'react'
const Notification = ({message, notificationType}) => {
    if (message === null) {   
      return null
    }
    return (
        <div id = "notification" className={notificationType} > 
        <p>{message}</p>
        </div>)
  }


export default Notification