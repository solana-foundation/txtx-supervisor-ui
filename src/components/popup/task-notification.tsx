import React, { useState, useEffect } from 'react';
import usePageVisibility from '../../hooks/usePageVisibility';

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
  
const TaskComponent = () => {
  const [taskCompleted, setTaskCompleted] = useState(false);
  const isVisible = usePageVisibility();

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
  }, [taskCompleted, isVisible]);

  return (
    <div>
      <h1>Task Status</h1>
      {taskCompleted ? <p>Task Completed!</p> : <p>Task in progress...</p>}
    </div>
  );
};

export default TaskComponent;
