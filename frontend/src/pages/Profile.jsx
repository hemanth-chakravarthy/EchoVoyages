import React, { useState } from 'react';
import CustomerProfile from './CustomerProfile';
import LocalGuideProfile from './LocalGuideProfile';
import TravelAgentProfile from './TravelAgentProfile';

const ProfilePage = () => {
  const [activeProfile, setActiveProfile] = useState('customer');

  const handleProfileToggle = (profile) => {
    setActiveProfile(profile);
  };

  return (
    <div>
      <h1>Your Profile</h1>
      <div className="profile-toggles">
        <button onClick={() => handleProfileToggle('customer')}>Customer</button>
        <button onClick={() => handleProfileToggle('localGuide')}>Local Guide</button>
        <button onClick={() => handleProfileToggle('travelAgent')}>Travel Agent</button>
      </div>

      <div className="profile-content">
        {activeProfile === 'customer' && <CustomerProfile />}
        {activeProfile === 'localGuide' && <LocalGuideProfile />}
        {activeProfile === 'travelAgent' && <TravelAgentProfile />}
      </div>
    </div>
  );
};

export default ProfilePage;
