import React, { useState, useEffect } from 'react';
import usePageVisibility from '../../hooks/usePageVisibility'; // Same hook from before

const changeFavicon = (faviconURL) => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link') as any;
    link.type = 'image/x-icon';
    link.rel = '[rel*="icon"]';
    link.href = `${faviconURL}?v=${new Date().getTime()}`;
    document.getElementsByTagName('head')[0].appendChild(link);
};
const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };
  
  const showNotification = (title, options) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
};

const TaskNotification = () => {
    const [taskCompleted, setTaskCompleted] = useState(false);
    const isHidden = usePageVisibility(); // This will return true if the tab is hidden

    const defaultFavicon = '/assets/red_light.png';
    const completedFavicon = '/assets/green_light.png';
    const inProgressFavicon = '/assets/red_light.png';

    let taskTimeout;
    function startTimeoutTask() {
        taskTimeout = setTimeout(() => {
            setTaskCompleted(true);
        }, 15000);
    }

    function clearTimeoutTask() {
        clearTimeout(taskTimeout);
    }

    useEffect(() => {
        // Request notification permission when component mounts
        requestNotificationPermission();
    
        // Simulate a task completion after 5 seconds
        const taskTimeout = setTimeout(() => {
          setTaskCompleted(true);
        }, 5000);
    
        return () => {
          clearTimeout(taskTimeout);
        };
      }, []);
    
      useEffect(() => {
        if (taskCompleted) { // && !isVisible) {
          // Show notification if task is completed and user is not on the current tab
          showNotification('Task Complete', {
            body: 'Your task has been completed successfully!',
            icon: '/path/to/icon.png',
          });
        }
      }, [taskCompleted, isHidden]);

      useEffect(() => {
        if (isHidden) {
            if (taskCompleted) {
                document.title = 'task complete!';
                changeFavicon(completedFavicon);
            } else {
                document.title = 'task in progress...';
                changeFavicon(inProgressFavicon);
            }
            startTimeoutTask()
        } else {
            document.title = 'txtx runbooks!';
            changeFavicon(defaultFavicon);
            clearTimeoutTask();
            setTaskCompleted(false);
        }

        return () => {
            document.title = 'txtx runbooks'; // Reset title when component unmounts
        };
    }, [isHidden, taskCompleted]);

    return (
        <div>
            <h1>Task Status</h1>
            {taskCompleted ? <p>Task Completed!</p> : <p>Task in progress...</p>}
        </div>
      );
};

export default TaskNotification;
