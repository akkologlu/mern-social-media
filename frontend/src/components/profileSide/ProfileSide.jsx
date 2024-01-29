import React from "react";
import "./ProfileSide.css";
import LogoSearch from "../LogoSearch/LogoSearch";
import ProfileCard from "../ProfileCard/ProfileCard";
import FollowesCard from "../FollowersCard/FollowesCard";

function ProfileSide() {
  return (
    <div className="ProfileSide">
      <LogoSearch />
      <ProfileCard />
      <FollowesCard />
    </div>
  );
}

export default ProfileSide;
