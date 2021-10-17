import {
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  text: string;
  Icon: typeof SvgIcon;
}

const NavigationDrawerItem = (props: Props) => {
  const { text, Icon } = props;
  const { t: translate } = useTranslation();
  return (
    <ListItem button>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={translate(text)} />
    </ListItem>
  );
};

export { NavigationDrawerItem };
