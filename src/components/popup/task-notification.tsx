import React, { useEffect, useState } from 'react';
import usePageVisibility from '../../hooks/usePageVisibility'; // Same hook from before
import { ProgressBarStatus, ProgressBlock } from '../main/types';
import { selectVisibleProgressBlock } from '../../reducers/runbooks-slice';
import { useSelector } from 'react-redux';

const TITLE_TEXT = ['txtx runbooks', 'txtx - task in progress...', 'txtx - task complete'];
const TITLE_ICONS = ['favicon', 'red_light', 'green_light'];

const changeTab = (taskStatus:number) => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link') as any;
    link.type = 'image/x-icon';
    link.rel = '[rel*="icon"]';
    link.href = `/assets/${TITLE_ICONS[taskStatus]}.png?v=${new Date().getTime()}`;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = TITLE_TEXT[taskStatus];
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
  const isHidden = usePageVisibility();
  const [taskStatus, setTaskStatus] = useState(0);
  const progressBlocks = useSelector(selectVisibleProgressBlock);
  const pushProgressBlockStatus = useSelector(selectVisibleProgressBlock);

    useEffect(() => {
      if (taskStatus === 2) {
        if (isHidden) {
          showNotification('Task Complete', {
            body: 'Your task has been completed successfully!',
            icon: '/assets/favicon.png',
          });
        }
      }
      changeTab(taskStatus);
      setTimeout(() => {
        changeTab(0);
      }, 5000);
  
      return () => {
        changeTab(0);
      };
    }, [isHidden, taskStatus]);

    useEffect(() => {
      if (progressBlocks !== undefined) {
        const block: ProgressBlock = progressBlocks;
        console.log('TaskNotification:progressBlockEvent: ', progressBlocks)
        if (block && block.type === 'ProgressBar' && block.visible && block.panel.length === 0) {
          requestNotificationPermission();
          setTaskStatus(1);
          console.log('TaskNotification:progressBlockEvent: setTaskStatus(1)')
      }
      }
    }, [progressBlocks]);

    useEffect(() => {
      if (pushProgressBlockStatus?.type === 'ProgressBar') {
        console.log('TaskNotification:pushProgressBlockStatus: ', pushProgressBlockStatus)
        const statuses:Array<ProgressBarStatus> = pushProgressBlockStatus?.panel[0]?.statuses || []
        // the action holds an array of the all the progress updates - the complete looks to be the last.
        const idx = statuses.findIndex((o) => o.status.toLowerCase().startsWith('complete'))
        if (idx > -1) {
          setTaskStatus(2);
          console.log('TaskNotification:progressBlockEvent: setTaskStatus(2)')
        }
      }
    }, [pushProgressBlockStatus]);
    
    return (
        <div>
            <h1>Task Status</h1>
            {taskStatus ? <p>Task Completed!</p> : <p>Task in progress...</p>}
        </div>
      );
};

export default TaskNotification;
