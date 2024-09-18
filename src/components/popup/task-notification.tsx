import React, { useEffect, useState } from "react";
import usePageVisibility from "../../hooks/usePageVisibility"; // Same hook from before
import { ProgressBarStatus, ProgressBlock } from "../main/types";
import { selectVisibleProgressBlock } from "../../reducers/runbooks-slice";
import { useSelector } from "react-redux";

const TITLE_TEXT = [
  "txtx runbooks",
  "txtx - task in progress...",
  "txtx - task complete",
];
const TITLE_ICONS = ["favicon", "pending", "complete"];
const enum TaskStatus {
  NotRunning,
  Pending,
  Complete,
}
const changeTabContents = (taskStatus: number) => {
  const link =
    document.querySelector("link[rel*='icon']") ||
    (document.createElement("link") as any);
  link.type = "image/x-icon";
  link.rel = '[rel*="icon"]';
  link.href = `/assets/${TITLE_ICONS[taskStatus]}.png?v=${new Date().getTime()}`;
  document.getElementsByTagName("head")[0].appendChild(link);
  document.title = TITLE_TEXT[taskStatus];
};
const requestNotificationPermission = () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};

const showNotification = (title: string, options: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
};

const TaskNotification = () => {
  const isBrowserTabHidden = usePageVisibility();
  const [taskStatus, setTaskStatus] = useState(TaskStatus.NotRunning);
  const progressBlocks = useSelector(selectVisibleProgressBlock);
  const pushProgressBlockStatus = useSelector(selectVisibleProgressBlock);

  useEffect(() => {
    changeTabContents(taskStatus);
    if (taskStatus === TaskStatus.Complete) {
      setTimeout(() => {
        setTaskStatus(TaskStatus.NotRunning);
        changeTabContents(TaskStatus.NotRunning);
      }, 5000);
      if (isBrowserTabHidden) {
        showNotification("Task Complete", {
          body: "Your task has been completed successfully!",
          icon: "/assets/favicon.png",
        });
      }
    }

    return () => {
      //changeTabContents(TaskStatus.NotRunning);
    };
  }, [isBrowserTabHidden, taskStatus]);

  useEffect(() => {
    if (progressBlocks !== undefined) {
      requestNotificationPermission();
      setTaskStatus(TaskStatus.Pending);
    }
  }, [progressBlocks]);

  useEffect(() => {
    if (pushProgressBlockStatus?.type === "ProgressBar") {
      const statuses: Array<ProgressBarStatus> =
        pushProgressBlockStatus?.panel[0]?.statuses || [];
      const idx = statuses.findIndex(
        (o) =>
          o.status.toLowerCase().startsWith("complete") ||
          o.status.toLowerCase().startsWith("valid"),
      );
      if (idx > -1) {
        setTaskStatus(TaskStatus.Complete);
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
