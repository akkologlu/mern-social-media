import React from "react";
import "./FollowesCard.css";
import { Followers } from "../../Data/FollowersData";
function FollowesCard() {
  return (
    <div className="FollowersCard">
      <h3>Who is following you</h3>
      {Followers.map((follower, id) => {
        return (
          <div className="follower">
            <div>
              <div>
                <img src={follower.img} alt="" className="followerImage" />
              </div>
              <div className="name">
                <span>{follower.name}</span>
                <span>@{follower.username}</span>
              </div>
            </div>
            <button className="button fc-button">Follow</button>
          </div>
        );
      })}
    </div>
  );
}

export default FollowesCard;
