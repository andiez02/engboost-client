import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from 'react-router-dom';
import AccountTab from '../Settings/AccountTab';
import SecurityTab from '../Settings/SecurityTab';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';

const TABS = {
  ADMIN_ACCOUNT: 'admin_account',
  ADMIN_SECURITY: 'admin_security',
};

function AdminSettings() {
  const location = useLocation();
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.ADMIN_SECURITY))
      return TABS.ADMIN_SECURITY;
    return TABS.ADMIN_ACCOUNT;
  };
  const [activeTab, setActiveTab] = useState(getDefaultTab());

  const handleChangeTab = (event, selectedTab) => {
    setActiveTab(selectedTab);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <HeaderAdmin />
      <TabContext value={activeTab}>
        <Box
          sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '60px' }}
        >
          <TabList onChange={handleChangeTab}>
            <Tab
              label="Account"
              value={TABS.ADMIN_ACCOUNT}
              icon={<PersonIcon />}
              iconPosition="start"
              component={Link}
              to="/admin/settings/account"
            />
            <Tab
              label="Security"
              value={TABS.ADMIN_SECURITY}
              icon={<SecurityIcon />}
              iconPosition="start"
              component={Link}
              to="/admin/settings/security"
            />
          </TabList>
        </Box>
        <TabPanel value={TABS.ADMIN_ACCOUNT}>
          <AccountTab />
        </TabPanel>
        <TabPanel value={TABS.ADMIN_SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  );
}

export default AdminSettings;
