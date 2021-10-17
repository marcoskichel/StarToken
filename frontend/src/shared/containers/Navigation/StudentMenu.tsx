import React from 'react';
import { List } from '@material-ui/core';
import { NavigationDrawerItem } from 'shared/containers/Navigation/NavigationDrawerItem';
import { Inbox as InboxIcon } from '@material-ui/icons';

const StudentMenu = () => {
  return (
    <List>
      <NavigationDrawerItem text="student_home" Icon={InboxIcon} />
    </List>
  );
};

export { StudentMenu };
